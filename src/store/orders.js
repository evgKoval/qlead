import store from '../store'

export default {
  state: {
    orders: []
  },
  mutations: {},
  actions: {
    getOrders({ commit, context }, state) {
      $.ajax({
        type: 'GET',
        url: 'https://myquiz-9b908.firebaseio.com/orders.json',
        success: (data, textStatus, request, response) => {
          for (let order in data) {
            data[order].id = order
            data[order].question = JSON.parse(data[order].question)
            data[order].answers = JSON.parse(data[order].answers)
          }

          arguments[0].state.orders = Object.values(data)

          commit('setLoadingO', false)
        },
        error: function(request, textStatus, errorThrown, response) {}
      })
    }
  },
  getters: {
    orders(state) {
      let a = []

      for (var i = 0; i < store.getters.myQuizzes.length; i++) {
        for (var j = 0; j < state.orders.length; j++) {
          if (store.getters.myQuizzes[i].id === state.orders[j].quiz_id) {
            a.push(state.orders[j])
          }
        }
      }

      return a.reverse()
    },
    fiveOrders(state) {
      let a = []

      for (var i = 0; i < store.getters.myQuizzes.length; i++) {
        for (var j = 0; j < state.orders.length; j++) {
          if (store.getters.myQuizzes[i].id === state.orders[j].quiz_id) {
            a.push(state.orders[j])
          }
        }
      }

      return a.reverse().slice(0, 5)
    }
  }
}
