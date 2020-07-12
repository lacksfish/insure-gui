import Vue from 'vue'
import App from './App.vue'
import Main from './components/Main.vue'
import VModal from 'vue-js-modal'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import 'materialize-css/dist/css/materialize.min.css'
import 'material-design-icons/iconfont/material-icons.css'

import InsurancePdf from './components/InsurancePdf.vue'

Vue.config.productionTip = false

Vue.use(VModal, { dialog: true, dynamic: true, dynamicDefaults: { clickToClose: false, focusTrap: true } })

const router = new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/showInsurance', 
      name: 'showInsurance',
      component: InsurancePdf
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

new Vue(
  {
    router,
    template: '<App />',
    components: { App, Main, InsurancePdf }
  }).$mount('#app')
