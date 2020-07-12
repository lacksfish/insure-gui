const { BitcoinLedgerService, WalletContext, Insurance, ElectrumConnection } = require('insure-lib')
const Store = require('electron-store')
const bitcoinjs = require('bitcoinjs-lib')
const fs = require('fs')
const path = require('path')

const store = new Store();

let config = {
  networkName: 'testnet',
  network: bitcoinjs.networks.testnet,
  electrum: {
    serverUrl: "electrumx-test.1209k.com",
    port: 50002
  }
}

let walletctx;
let ledgerInstance;
let electrum;

const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')

let baseUrl
if (process.env.NODE_ENV === 'DEV') {
  baseUrl = 'http://localhost:8080/#/'
} else {
  baseUrl = `file://${path.join(__dirname, '../dist/index.html#')}`
}

let mainWindow
let insuranceWindow

app.on('ready', () => {
  Menu.setApplicationMenu(null)

  let window = new BrowserWindow({
    width: process.env.NODE_ENV === 'DEV' ? 1600 : 900,
    height: 750,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    },
    title: "Insurance Transaction Creator"
  })
  window.loadURL(baseUrl)
  if (process.env.NODE_ENV === 'DEV') window.webContents.openDevTools()

  mainWindow = window
})

ipcMain.on("fetchSettings", (event) => {
  event.returnValue = config
})
ipcMain.on("updateSettings", (event, args) => {
  config.electrum = args.electrum
  
  if (args.network == "btcMain") {
    config.network = bitcoinjs.networks.bitcoin
    config.networkName = 'mainnet'
  } else if (args.network == "btcTest") {
    config.network = bitcoinjs.networks.testnet
    config.networkName = 'testnet'
  } else {
    config.network = null
  }

  // Reinit hardware wallet
  initHardwareWallet()
})

const initHardwareWallet = () => {
  let saveDerivations = true
  let storageDerivation = store.get('derivations.' + config.networkName)
  electrum = new ElectrumConnection(config.electrum.serverUrl, config.electrum.port, config.network)
  ledgerInstance = new BitcoinLedgerService(config)
  ledgerInstance.isConnected()
    .then(() => {
      if (storageDerivation) {
        saveDerivations = false
        return electrum.connect()
        .then(() => {
          walletctx = new WalletContext(ledgerInstance, electrum, config.network)
          return walletctx.initialize(storageDerivation.derivations)
        })
        .catch(() => {
          mainWindow.webContents.send("error", {message: 'Couldn\'t connect to Electrum server'})
        })
      } else {
        return electrum.connect()
          .then((connected) => {
              if (!connected) {
                throw {message: 'Couldn\'t connect to Electrum server'}
              }
              walletctx = new WalletContext(ledgerInstance, electrum, config.network)
              return walletctx.initialize()
          })
          .catch(() => {
            throw {message: 'Couldn\'t connect to Electrum server'}
          })
      }
        
    })
    .then(() => {
      let derivations = walletctx.getDerivationsWithUTXOs()

      if (saveDerivations && derivations.length > 0) {
        store.set('derivations.' + config.networkName, {
          derivations: derivations,
          ts: (new Date()).getTime()
        })
      }

      let fullBalanceSats = walletctx.getTotalBalance();
      mainWindow.webContents.send("walletInfo", {
        balance: fullBalanceSats,
        derivations: derivations,
        network: config.network,
        loadedFromStore: !!storageDerivation
      });
    })
    .catch((e) => {
      console.error(e)
      mainWindow.webContents.send("error", e)
    })
}

ipcMain.on("initHardwareWallet", (event, args) => {
  initHardwareWallet(event, args)
});

ipcMain.on("clearStorage", () => {
  store.delete('derivations.testnet')
  store.delete('derivations.mainnet')
});


const showInsurance = (txInsurance, validDate) => {
  const windowPath = baseUrl + 'showInsurance'
  insuranceWindow = new BrowserWindow({
    height: 842, 
    width: 595,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    },
    title: "Insurance Transaction Creator - Transaction"
  })

  var menu = Menu.buildFromTemplate([
    {
      label: 'Save PDF',
      click() {
        dialog.showSaveDialog(insuranceWindow, {
          defaultPath: 'Insurance.pdf'
        }).then((result) => {
          if(!result.canceled) {
            insuranceWindow.webContents.printToPDF({printBackground: true}).then(data => {

              fs.writeFile(result.filePath, data, (err) => {
                // TODO error handling
                if (err) {
                  console.error(err)
                }
              })
            })
          }
        })
      }
    }
  ])
  insuranceWindow.setMenu(menu)

  if (process.env.NODE_ENV === 'DEV') insuranceWindow.webContents.openDevTools()
  insuranceWindow.on('close', function () { insuranceWindow = null })

  insuranceWindow.loadURL(windowPath).then(() => {
    insuranceWindow.webContents.send("insuranceInfo", {rawTx: txInsurance, validDate: validDate} );
  })
}

ipcMain.on("createInsurance", (event, args) => {

  let outputs = args.recipients.map((recipient) => {
    return {
      script: bitcoinjs.address.toOutputScript(recipient[0], config.network),
      value: recipient[1] - 10000, // TODO: better fee calculation
      network: config.network
    }
  })

  let insurance = new Insurance(walletctx.getDerivationsWithUTXOs(), outputs, ledgerInstance, config.network)
  insurance.createUnsignedInsurance()
  insurance.signInsurance(args.validDate)
  .then((txInsurance) => {
    mainWindow.webContents.send("signedInsurance", txInsurance)

    showInsurance(txInsurance, args.validDate.getTime())
  })
  .catch((error) => {
    mainWindow.webContents.send("error", error)
  })
})