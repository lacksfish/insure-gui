<template>
  <div class="mainDiv">
    <v-dialog v-bind:click-to-close="false"/>
    <modals-container/>
    <div class="navbar-fixed">
      <nav>
        <div class="nav-wrapper center" style="padding-left: 20px">
          Create a insurance transaction which is valid after a certain date. If you're still alive by then, move your coins before the validity date.
        </div>
      </nav>
    </div>

    <div class="container">
      <div class="divider"></div>

      <h3></h3>

      <div class="row">
        <div class="left balanceInfo">Wallet balance: <span class="wallet-balance" style="float:right; margin-left: 5px"> {{ walletInfo ? walletInfo.balance / 1e8 : "--------"}}</span></div>
        <button class="btn waves-effect waves-light right" @click="reloadWallet()">Resync wallet
          <i class="material-icons right">repeat</i>
        </button>
        <button class="btn waves-effect waves-light right settingsButton" @click="openSettings()">Settings
          <i class="material-icons right">settings</i>
        </button>
      </div>

      <div class="row">
        <div class="col s3 indigo lighten-1 grey-text text-lighten-5 center">Derivation</div>
        <div class="col s6 indigo lighten-1 grey-text text-lighten-5 center">Address</div>
        <div class="col s3 indigo lighten-1 grey-text text-lighten-5 center">Balance</div>
      </div>

      <div style="overflow: hidden">
        <div class="utxos" style="max-height: 275px; overflow-y: overlay; overflow-x: hidden">
          <div v-if="walletInfo">
            <div class="row addressRow" v-for="(deri, idx) in walletInfo.derivations" :key="idx">
              <div class="col s3 lighten-1 center">{{ deri.derivationPath }}</div>
              <div class="col s6 lighten-1">{{ deri.address }}</div>
              <div class="col s3 lighten-1 center">{{ " ".repeat(leadingZeros - leadingZerosVue(deri.totalValue / 1e8)) + (deri.totalValue / 1e8).toFixed(8) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
      </div>
      <button class="waves-effect waves-light btn" v-on:click="addRecipient()">
        Add recipient
        <i class="material-icons left">group_add</i>
      </button>
      
      <div class="row">
        <div class="col s8">
          <div class="input-field invalid">
            <input
              v-for="(recipient) in recipients" v-bind:key="recipient.id"
              v-model="recipient.address"
              v-bind:id="recipient.id"
              type="text"
              placeholder="Bitcoin address"
              v-on:change="event => checkAddress(event)"
            >
            <span class="helper-text">Enter recipient of insurance</span>
          </div>
        </div>
        <div class="col s4 center">
          <div class="input-field invalid" 
                v-if="recipients.length - 1">
              <input
                style="text-align: center"
                v-for="(recipient) in recipients" v-bind:key="recipient.id + 'percent'"
                v-model="recipient.percentage"
                v-bind:id="recipient.id + '-percent'"
                type="number" max="100" accuracy="2" min="0" step="0.05"
                placeholder="Bitcoin address"
                v-bind:class="{ 'invalid': !isPercentagesValid() }"
              >
              <span class="helper-text" data-error="Percentage total has to be at least 99% and less than 100%.">Percentage of insurance balance</span>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="input-field inline">
          <DatePicker @picked-date="updateDate"></DatePicker>
          <span class="helper-text">Select insurance validity date</span>
        </div>
      </div>

      <div class="row">
        <button 
          class="btn waves-effect waves-light right"
          @click="createInsurance()"
          v-bind:class="{ 'disabled': !areRecipientsValid() || !isPercentagesValid() }"
        >Create insurance
          <i class="material-icons right">lock</i>
        </button>
      </div>
    </div>
  </div>
</template>



<script>
const { ipcRenderer } = window.require('electron')
const bitcoinjs = window.require('bitcoinjs-lib')

import DatePicker from './DatePicker.vue'
import MainSettings from './MainSettings.vue'
import { leadingZeros, roundDownToClosest, getIntFromStringEnd, percentageDistributionMaximize } from '../utils/utils.js'
import { errorDialog } from '../utils/dialogs.js'

export default {
  name: 'Main',
  props: {},
  components: {
    DatePicker
  },
  data() {
    return {
      network: null,
      walletInfo: null,
      recipientsCount: 1,
      recipients: [{
        id: "bitcoinAddress-1",
        address: '',
        isValid: false,
        percentage: 100
      }],
      validDate: null,
      leadingZeros: 9 // Print amounts nicely
    }
  },
  methods: {
    reloadWallet() {
      ipcRenderer.send("clearStorage");
      setTimeout(() => {location.reload()}, 1000);
    },
    updateDate(date) {
      this.validDate = new Date(Date.parse(date))
    },
    openSettings() {
      this.$modal.show(MainSettings)
    },
    processWalletInfo(walletInfo) {
      let maxLeadingDigits = 0
      walletInfo.derivations = walletInfo.derivations.map((deri) => {
        let deriutxovalues = [].concat.apply([], deri.utxos.map(utxo => utxo.value))
        let deritotalvalue = deriutxovalues.reduce((balance, acc) =>  acc + balance, 0)

        // Determine current max leading digits count
        if (deriutxovalues.length > 0) {
          let leadingDigits = Math.max.apply(null, deriutxovalues.map(val => leadingZeros(val / 1e8)))
          if (leadingDigits > maxLeadingDigits) maxLeadingDigits = leadingDigits
        }
        this.leadingZeros = maxLeadingDigits

        deri.totalValue = deritotalvalue
        return deri
      })
      this.walletInfo = walletInfo
      this.network = walletInfo.network
    },
    addRecipient() {
      let recipientsCount = this.recipientsCount + 1
      // Apply even percentage for each recipient initially
      this.recipients.map((recipient, idx) => {
        this.recipients[idx].percentage = roundDownToClosest((100 / recipientsCount), 0.05)
      })
      this.recipients.push({
        id: "bitcoinAddress-" + recipientsCount,
        address: '',
        isValid: false,
        percentage: roundDownToClosest((100 / recipientsCount), 0.05)
      })
      this.recipientsCount = this.recipients.length
    },
    createInsurance() {
      this.$modal.show('dialog', {
        title: 'Wallet interaction',
        text: 'Check your hardware wallet to confirm insurance transaction',
        buttons: []
      })
      let r = this.recipients.map((recipient) => {
        return [recipient.address, recipient.percentage]
      })
      // Maximize output amounts
      let amounts = percentageDistributionMaximize(r.map(r => r[1]), this.walletInfo.balance)
      amounts.forEach((amount, idx) => {
        r[idx][1] = amount
      })

      ipcRenderer.send("createInsurance", {
        recipients: r,
        derivations: this.walletInfo.derivations,
        validDate: this.validDate
      })
    },
    
    // Validation and formatting
    checkAddress(event) {
      if (!this.network) return false
      // I know this is hacky. Need to know which address input fired the event
      let idx = getIntFromStringEnd(event.target.id) - 1
      try {
        bitcoinjs.address.toOutputScript(this.recipients[idx].address, this.network)
        this.recipients[idx].isValid = true
        event.target.className = ""
      } catch (e) {
        this.recipients[idx].isValid = false
        event.target.className = "invalid"
      }
    },
    isPercentagesValid(){
        // I'd like to use reduce here, but it causes errors for dynamically added list elements...
        let percentageSum = 0
        this.recipients.forEach((r) => {
          percentageSum += parseFloat(r.percentage)
        })
        return percentageSum > 99 && percentageSum <= 100
    },
    areRecipientsValid() {
      let valid = true
      this.recipients.forEach((r) => {
        valid = valid && r.isValid
      })
      return valid
    },
    leadingZerosVue(value) {
      return leadingZeros(value)
    }
  },
  
  mounted() {
    ipcRenderer.send("initHardwareWallet")
    this.$modal.show('dialog', {
      title: 'Hodl on',
      text: "Syncing wallet history from hardware wallet ...",
      buttons: []
    })

    ipcRenderer.on('error', (event, data) => {
      this.$modal.hide('dialog');
      this.$modal.show('dialog', errorDialog(data))
    })

    ipcRenderer.on('walletInfo', (event, walletInfo) => {
      this.$modal.hide('dialog');
      if (walletInfo.loadedFromStore) {
        this.$modal.show('dialog', {
          title: 'Wallet info loaded',
          text: "Wallet information has been loaded from local memory.<br>If you're expecting an incoming transaction and it is not listed here, or you have moved your coins in the meantime, please click on \"RESYNC WALLET\" before proceeding.",
          buttons: [{ title: 'OK, thanks' }]
        })
      }
      this.processWalletInfo(walletInfo)
    })

    ipcRenderer.on('signedInsurance', (event, signedInsurance) => {
      this.$modal.hide('dialog');
      console.log(signedInsurance)
    })
  }
}
</script>





<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mainDiv {
  height: 100%;
  max-height: 100%;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.addressRow {
  margin-bottom: 5px !important;
  white-space: pre;
	font-family: Consolas,monaco,monospace;
}
.row {
  margin-bottom: 10px;
}
.balanceInfo {
	font-family: Consolas,monaco,monospace; 
  font-size: 24px;
}
.settingsButton {
  margin-right: 5px;
}
</style>
