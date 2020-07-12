<template>
    <div class="container">
        <h5>Electrum Server configuration</h5>
        <div class="row">
            <div class="col s9">Server URL</div>
            <div class="col s3">Server Port</div>
        </div>
        <div class="row">
            <div class="col s9">
                <div class="input-field">
                    <input
                    v-model="electrum.serverUrl"
                    type="text"
                    placeholder="Electrum server url"
                    >
                    <!--<span class="helper-text">Enter recipient of insurance</span>-->
                </div>
            </div>
            <div class="col s3">
                <div class="input-field">
                    <input
                    v-model="electrum.port"
                    type="text"
                    placeholder="Electrum server port"
                    >
                    <!--<span class="helper-text">Enter recipient of insurance</span>-->
                </div>
            </div>
        </div>

        <h5>Network configuration</h5>
        <div class="row">
            <select class="browser-default" v-model="network">
                <option :selected="network == null" value="" disabled>Choose your network</option>
                <option :selected="network == 'btcMain'" value="btcMain">Bitcoin Mainnet</option>
                <option :selected="network == 'btcTest'" value="btcTest">Bitcoin Testnet</option>
                <option value="" disabled>Litecoin Mainnet (soon)</option>
                <option value="" disabled>Litecoin Testnet (soon)</option>
                <option value="" disabled>Bitcoin Cash Mainnet (soon)</option>
                <option value="" disabled>Bitcoin Cash Testnet (soon)</option>
                
            </select>
        </div>
        <div class="row center">
            <button class="btn waves-effect waves-light" @click="saveSettings();$emit('close')">Save
                <i class="material-icons right">save</i>
            </button>
            <button class="btn waves-effect waves-light" @click="$emit('close')">Cancel
                <i class="material-icons right">close</i>
            </button>
        </div>
    </div>
</template>

<script>
const { ipcRenderer } = window.require('electron')
const bitcoinjs = window.require('bitcoinjs-lib')

export default {
    name: 'MainSettings',
    props: {},
    components: {},
    data() {
        return {
            electrum: {
                serverUrl: "",
                port: ""
            },
            network: ""
        }
    },
    methods: {
        saveSettings() {
            ipcRenderer.send("updateSettings", {
                electrum: this.electrum,
                network: this.network
            })
        }
    },
    mounted() {
        let config = ipcRenderer.sendSync("fetchSettings")
        this.electrum = config.electrum
        // TODO nicer way to do this check
        if (JSON.stringify(config.network) == JSON.stringify(bitcoinjs.networks.bitcoin)) {
            this.network = "btcMain"
        } else if (JSON.stringify(config.network) === JSON.stringify(bitcoinjs.networks.testnet)) {
            this.network = "btcTest"
        } else {
            this.network = null
        }
    }
}
</script>

<style scoped>
.row {
  margin-bottom: 1px
}
.input-field {
    margin: 0
}
.unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.btn {
    margin: 5px;
}
</style>