import Vue from 'vue'
import Vuex from 'vuex'
import quizzes from './quizzes'
import orders from './orders'
import user from './user'
import loading from './loading'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    loading,
    quizzes,
    orders,
    user
  }
})
