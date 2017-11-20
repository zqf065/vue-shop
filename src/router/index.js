import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Model from '@/components/Model'
import GoodList from './../views/GoodList.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    }, {
      path: '/model',
      name: 'Model',
      component: Model
    }, {
      path: '/index',
      name: 'GoodList',
      component: GoodList
    }
  ]
})
