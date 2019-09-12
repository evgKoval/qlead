import store from '../store'
import * as fb from 'firebase'

var config = {
  apiKey: 'AIzaSyBlDk3EZ85bopYjcRpMKNwcA8xqJG8CmyQ',
  authDomain: 'myquiz-9b908.firebaseapp.com',
  databaseURL: 'https://myquiz-9b908.firebaseio.com',
  projectId: 'myquiz-9b908',
  storageBucket: 'myquiz-9b908.appspot.com',
  messagingSenderId: '693337904492'
}

fb.initializeApp(config)

export default function(to, from, next) {
  fb.auth().onAuthStateChanged(user => {
    if (user) {
      store.dispatch('autoLoginUser', user)
      next()
    } else {
      next('/login?message=isnotauth')
    }
  })
}
