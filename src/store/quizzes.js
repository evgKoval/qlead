import store from '../store'

export default {
  state: {},
  mutations: {},
  actions: {
    getQuizzes({ commit, context }, state) {
      $.ajax({
        type: 'GET',
        url: 'https://myquiz-9b908.firebaseio.com/quizzes.json',
        success: (data, textStatus, request, response) => {
          for (let quiz in data) {
            data[quiz].id = quiz
          }

          arguments[0].state.quizzes = data

          commit('setLoadingQ', false)
        },
        error: function(request, textStatus, errorThrown, response) {}
      })
    }
  },
  getters: {
    quizzes(state) {
      return state.quizzes
    },
    myQuizzes(state) {
      let myQ = Object.values(state.quizzes).filter(quiz => {
        return quiz.owner == store.getters.user.id
      })
      return myQ
    }
  }
}
