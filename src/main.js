import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
//import router from './router/index.js'
import vuetify from './plugins/vuetify';

import Registration from './views/Registration.vue'
import ErrorMessage from './views/ErrorMessage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/registrationform/:eventGuid/:personGuid', 
    name: 'registrationform',
    component: Registration
  },
  {
    path: '/registrationform/:eventGuid',
    name: 'noregistration',
    component: Registration
  },
  {
    path: '/registrationform',
    name: 'noparams',
    component: Registration
  },
  {
    path: '*',
    name: 'notvalidlink',
    component: ErrorMessage,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
