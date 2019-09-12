import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'
import EditGuard from './edit-guard'
import Logined from './logined'
import HeaderFooter from '@/components/HeaderFooter'
import Header from '@/components/Header'
import Quizzes from '@/components/Quizzes'
import Orders from '@/components/Orders'
import Patterns from '@/components/Patterns'
import Edit from '@/components/Edit'
import Questions from '@/components/Questions'
import GetContacs from '@/components/GetContacs'
import Integration from '@/components/Integration'
import Install from '@/components/Install'
import Login from '@/components/Login'
import Registration from '@/components/Registration'
import ResetPassword from '@/components/ResetPassword'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '',
      component: HeaderFooter,
      redirect: { name: 'quizzes' },
      children: [
        {
          path: '/quizzes',
          name: 'quizzes',
          component: Quizzes
        },
        {
          path: '/orders',
          name: 'orders',
          component: Orders
        },
        {
          path: '/patterns',
          name: 'patterns',
          component: Patterns
        }
      ],
      beforeEnter: AuthGuard
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: Logined
    },
    {
      path: '/reset',
      name: 'reset',
      component: ResetPassword,
      beforeEnter: Logined
    },
    {
      path: '/registration',
      name: 'registration',
      component: Registration,
      beforeEnter: Logined
    },
    {
      path: '/edit',
      name: 'header',
      component: Header,
      redirect: { name: 'quizzes' },
      children: [
        {
          path: ':id',
          name: 'edit',
          component: Edit,
          children: [
            {
              path: 'questions',
              name: 'questions',
              component: Questions
            },
            {
              path: 'contacs',
              name: 'getcontacs',
              component: GetContacs
            },
            {
              path: 'integration',
              name: 'integration',
              component: Integration
            },
            {
              path: 'install',
              name: 'install',
              component: Install
            }
          ]
        }
      ],
      beforeEnter: EditGuard
    }
  ]
})
