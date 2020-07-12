const { ipcRenderer } = window.require('electron')

export const errorDialog = (data) => {
    if (typeof data == "object") {
        // Ledger no device error
        let message = ""
        let buttons = [{
            title: 'Close'
        }]
        if (data.message == "NoDevice") {
            message = "No Ledger hardware wallet was found."
            buttons = [{
                  title: 'Try again',
                  handler: () => { ipcRenderer.send("initHardwareWallet") }
            }]
        } else if (data.message == "Ledger device: INS_NOT_SUPPORTED (0x6d00)") {
            message = data.message + '<br>Are you inside the correct wallet app?'
        } else {
            message = data.message
        }

        return {
            title: 'Error',
            text: message,
            buttons: buttons
        }
    }
}