<template>
<body>
    <div id="content">
        <nav class="orange">
            <div class="nav-wrapper container"></div>
        </nav>

        <div class="section no-pad-bot no-pad-top" id="index-banner">
            <div class="container">
                <h1 class="header center orange-text">Bitcoin Insurance</h1>
                <div class="row center">
                    <h6 class="header col s12 light">This transaction is valid on {{ validDate }}, <br>if inputs are not spent before.</h6>
                </div>
            </div>
        </div>

        <div class="container datadiv">
            <div class="row">
                <div class="col s12 center orange lighten-2">
                    Transaction (Raw)
                </div>
                <div class="col s12">
                    <div class="rawtx">{{ rawTx }}</div>
                </div>
            </div>

            <div class="pagebreak" v-if="renderingQR">
                <div class="row">
                    <div class="col s12 center orange lighten-2">
                        Transaction QR
                    </div>
                    <div class="col s12 txQR center">
                        <canvas id="qrcode"></canvas>
                    </div>
                </div>
            </div>
            <!-- TODO readd footer, but it messes up the PDF print as-is
            <footer class="page-footer orange foot">
                <div class="container">
                    <div class="row">
                        <div class="col l6 s12">
                        <h5 class="white-text">Bitcoin Insurance</h5>
                        <div class="grey-text text-lighten-4">This PDF has been created with open source software.<br>Visit insure.cc to learn more.</div>
                        </div>
                    </div>
                </div>
            </footer> -->
        </div>
    </div>
</body>
</template>

<script>
const { ipcRenderer } = window.require('electron')
const QRCode = window.require('qrcode')

import { getFormattedDate } from '../utils/utils.js'

export default {
    name: "InsurancePdf",
    data: () => ({
        rawTx: 'NOT_VALID',
        validDate: 'NEVER',
        renderingQR: true
    }),
    methods: {
        processInsuranceInfo(insuranceInfo) {
            this.rawTx = insuranceInfo.rawTx
            this.validDate = getFormattedDate(new Date(insuranceInfo.validDate))

            this.renderQR()
        },
        renderQR() {
            let qrcodeElement = document.getElementById('qrcode')
            try {
                QRCode.toCanvas(qrcodeElement, this.rawTx, {
                    scale: 2
                }, (error) => {
                    if (error) {
                        this.renderingQR = false
                        console.error(error)
                    }
                })
            } catch (e) {
                console.error(e)
            }
        }
    },
    mounted() {
        window.addEventListener("load", function() {
            this.renderQR()
        })

        ipcRenderer.on('insuranceInfo', (event, insuranceInfo) => {
            this.processInsuranceInfo(insuranceInfo)
        })
    }
}
</script>

<style scoped>
#content {
    page-break-before: always;
    height: 100%;
}
.index-banner {
    height: 14%;
}
nav {
    height: 5%;
}
.datadiv {
    min-height: 64%;
}
.rawtx {
    font-family: Consolas,monaco,monospace;
    font-size: 8px;
    padding-top: 5px;
    word-wrap: break-word;
    word-break: break-all;
}
h1 {
    margin: 0;
}
h3 {
  margin: 40px 0 0;
}
.page-footer {
    padding-top: 0px;
    height: 17%;
}
.foot {
    left: 0;
    bottom: 0;
    position: static;
    width: 100%;
}
.nav {
    height: 32px;
}

.last-page {
    page: last_page;
}

@media print {
    .pagebreak {
        page-break-before: always;
    }
}
</style>
