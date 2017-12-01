// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import VueInifiniteScroll from 'vue-infinite-scroll'
import './util/veelidate'

Vue.use(Vuex)
Vue.config.productionTip = false
Vue.use(VueLazyLoad, {
  loading: '/static/loading-svg/loading-bars.svg',
  attempt: 3
})
Vue.use(VueInifiniteScroll)
const store = new Vuex.Store({
  state: {
    nickName: '',
    cartCount: 0
  },
  mutations: {
    updateUserInfo (state, name) {
      state.nickName = name
    },
    updateCartCount (state, count) {
      state.cartCount += count
    }
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  mounted () {
    this.checkLogin()
    this.getCartCount()
  },
  methods: {
    checkLogin () {
      axios.post('/users/checkLogin').then((res) => {
        var result = res.data
        if (result.status === 0) {
          this.$store.commit('updateUserInfo', result.result.userName)
        } else {
          if (this.$route.path !== 'index') {
            this.$router.push({path: 'index'})
          }
        }
      })
    },
    getCartCount () {
      axios.post('/users/getCarList').then((response) => {
        var res = response.data
        if (res.status === 0) {
          var count = 0
          res.result.cartList.forEach(function (item) {
            count += parseInt(item.productNum)
          })
          this.$store.commit('updateCartCount', count)
        }
      })
    }
  },
  template: '<App/>',
  components: { App }
})
