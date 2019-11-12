import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import vuetify from './plugins/vuetify';

import Registration from './views/Registration.vue'
import ErrorPage from './views/ErrorPage.vue'
import Message from './components/Message.vue'
import GoEvent from './components/GoEvent.vue'
import Ws from './api/webCalculation.js'

import {i18n} from './plugins/i18n'

Vue.mixin(Ws)

Vue.use(VueRouter)

const routes = [
  {
    path: '/registrationform/:eventGuid/:personGuid', 
    name: 'registrationknown',
    component: Registration
  },
  {
    path: '/registrationform/:eventGuid',
    name: 'registrationnew',
    component: Registration
  },
  {
    path: '/registrationform',
    name: 'noparams',
    component: Registration
  },
  {
    path: '/registrationform/message/:message',
    name: 'message',
    component: Message,
    props: true
  },
  {
    path: '/goevent/:eventGuid/:personGuid?',
    name: 'goevent',
    component: GoEvent,
  },
  {
    path: '*',
    name: 'notvalidlink',
    component: ErrorPage,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: window.myConfig.BASE_URL,
  routes
})

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
