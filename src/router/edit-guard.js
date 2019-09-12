import store from '../store'
import * as fb from 'firebase'

export default (to, from, next) => {
  fb.auth().onAuthStateChanged(user => {
    if (user) {
      store.dispatch('autoLoginUser', user)

      let idQuiz =
        'https://myquiz-9b908.firebaseio.com/quizzes/' + to.params.id + '.json'

      $.ajax({
        type: 'GET',
        url: idQuiz,
        success: (data, textStatus, request, response) => {
          if (data.owner === store.getters.user.id) {
            next()
          } else {
            next('/quizzes')
          }
        },
        error: function(request, textStatus, errorThrown, response) {
          next('/quizzes')
        }
      })
    } else {
      next('/login?message=isnotauth')
    }
  })
}
