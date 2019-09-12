import * as fb from 'firebase'

class User {
  constructor(id, email) {
    ;(this.id = id), (this.email = email)
  }
}

export default {
  state: {
    user: null
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    }
  },
  actions: {
    registerUser({ commit }, { email, password }) {
      commit('clearError')
      fb.auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => {
          commit('setUser', new User(user.uid))
        })
        .then(res => {
          var user = fb.auth().currentUser

          user
            .sendEmailVerification()
            .then(function() {})
            .catch(function(error) {})
        })
        .catch(error => {
          commit('setError', error.message)
        })
    },
    loginUser({ commit }, { email, password }) {
      commit('clearError')
      fb.auth()
        .signInWithEmailAndPassword(email, password)
        .then(user => {
          commit('setUser', new User(user.user.uid))
        })
        .then(() => {
          var user = fb.auth().currentUser
        })
        .catch(error => {
          commit('setError', error.message)
        })
    },
    forgotPassword({ commit }, email) {
      fb.auth()
        .sendPasswordResetEmail(email)
        .then(function() {})
        .catch(function(error) {
          commit('setError', error.message)
        })
    },
    autoLoginUser({ commit }, payload) {
      commit('setUser', new User(payload.uid, payload.email))
    },
    logoutUser({ commit }) {
      fb.auth().signOut()
      commit('setUser', null)
    }
  },
  getters: {
    user(state) {
      return state.user
    }
  }
}
