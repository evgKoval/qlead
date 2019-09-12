export default {
  state: {
    loadingQ: false,
    loadingO: false,
    error: null
  },
  mutations: {
    setLoadingQ(state, payload) {
      state.loadingQ = payload
    },
    setLoadingO(state, payload) {
      state.loadingO = payload
    },
    setError(state, payload) {
      state.error = payload
    },
    clearError(state) {
      state.error = null
    }
  },
  actions: {
    setLoadingQ({ commit }, payload) {
      commit('setLoadingQ', payload)
    },
    setLoadingO({ commit }, payload) {
      commit('setLoadingO', payload)
    },
    setError({ commit }, payload) {
      commit('setError', payload)
    },
    clearError({ commit }) {
      commit('clearError')
    }
  },
  getters: {
    loadingQ(state) {
      return state.loadingQ
    },
    loadingO(state) {
      return state.loadingO
    },
    error(state) {
      return state.error
    }
  }
}
