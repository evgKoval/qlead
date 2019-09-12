import * as fb from 'firebase'

export default function(to, from, next) {
  fb.auth().onAuthStateChanged(user => {
    if (user) {
      next('/quizzes')
    } else {
      next()
    }
  })
}
