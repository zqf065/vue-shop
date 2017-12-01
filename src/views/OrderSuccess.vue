<template>
    <div>
      <NavHeader></NavHeader>
      <NavBread>
        <span>订单提交成功</span>
      </NavBread>
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>订单提交成功，请尽快付款！</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>确认</span> 收货地址</li>
            <li class="cur"><span>核对</span> 订单信息</li>
            <li class="cur"><span>支付</span> 方式</li>
            <li class="cur"><span>成功提交</span> 订单</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="static/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>恭喜! <br>订单提交成功，请尽快付款！</h3>
            <p>
              <span>订单号：{{orderId}}</span>
              <span>应付金额：{{subTotal|currency}}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <router-link href="javascript:;" class="btn btn--m" :to="{path: 'cart'}" replace>购物车列表</router-link>
              </div>
              <div class="btn-r-wrap">
                <router-link href="javascript:;" class="btn btn--m" :to="{path: 'index'}" replace>商品列表</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NavFooter></NavFooter>
    </div>
</template>

<script>
  import NavBread from './../components/NavBread.vue'
  import NavHeader from './../components/NavHeader.vue'
  import NavFooter from './../components/NavFooter.vue'
  import Modal from './../components/Modal.vue'
  import {currency} from './../util/currency'
  import axios from 'axios'
  export default {
    data () {
      return {
        subTotal: 0,
        orderId: 0
      }
    },
    mounted () {
      this.getOrderDetail()
    },
    filters: {
      currency: currency
    },
    components: {
      NavBread,
      NavHeader,
      NavFooter,
      Modal
    },
    methods: {
      getOrderDetail () {
        let orderId = this.$route.query.orderId
        axios.post('/users/orderDetail', {orderId: orderId}).then((res) => {
          let result = res.data
          if (result.status === 0) {
            this.subTotal = result.result.subTotal
            this.orderId = orderId
          }
        })
      }
    }
  }
</script>

<style scope>

</style>
