// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import store from './store'
import * as fb from 'firebase'
import VueLodash from 'vue-lodash'
import { VueMaskDirective } from 'v-mask'
import VueResource from 'vue-resource'
import VeeValidate from 'vee-validate'
import { Validator } from 'vee-validate'
import ru from 'vee-validate/dist/locale/ru'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VCalendar from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'

const configV = {
  errorBagName: 'errors', // change if property conflicts.
  fieldsBagName: 'inputs ', //Default is fields
  delay: 0,
  locale: 'en',
  dictionary: null,
  strict: true,
  enableAutoClasses: false,
  classNames: {
    touched: 'touched', // the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', // model is valid
    invalid: 'invalid', // model is invalid
    pristine: 'pristine', // control has not been interacted with
    dirty: 'dirty' // control has been interacted with
  },
  events: 'input|blur',
  inject: true
}

Vue.use(BootstrapVue)
Vue.use(VueLodash)
Vue.use(VueResource)
Vue.use(VeeValidate, configV)
Vue.use(VCalendar, {
  firstDayOfWeek: 2
})
Validator.localize('ru', ru)
Vue.directive('mask', VueMaskDirective)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created() {
    var config = {
      apiKey: 'AIzaSyBlDk3EZ85bopYjcRpMKNwcA8xqJG8CmyQ',
      authDomain: 'myquiz-9b908.firebaseapp.com',
      databaseURL: 'https://myquiz-9b908.firebaseio.com',
      projectId: 'myquiz-9b908',
      storageBucket: 'myquiz-9b908.appspot.com',
      messagingSenderId: '693337904492'
    }

    fb.initializeApp(config)

    fb.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('autoLoginUser', user)
      }
    })
  }
})
