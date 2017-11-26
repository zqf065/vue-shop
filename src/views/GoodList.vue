<template>
    <div>
      <NavHeader></NavHeader>
      <NavBread>
        <span>商品列表</span>
      </NavBread>
      <div class="accessory-result-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">排序:</span>
            <a href="javascript:void(0)" class="default" v-bind:class="{'cur': sortDefault == true}"
               @click="setSortDefault">默认
            </a>
            <a href="javascript:void(0)" class="price" v-bind:class="{'cur': sortDefault == false, 'sort-up':
            param.sort == 'asc'}"
               @click="setSort">价格
              <svg
              class="icon icon-arrow-short"><use
              xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby" @click.stop="showFilterPop">筛选</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter" id="filter" v-bind:class="{'filterby-show': filterBy}">
              <dl class="filter-price">
                <dt>价格区间:</dt>
                <dd><a href="javascript:void(0)" @click="setFilter('all')"
                       v-bind:class="{'cur' : curIndex==='all'}">选择价格
                </a></dd>
                <dd v-for="(item, index) in priceFilter">
                  <a href="javascript:void(0)" @click="setFilter(index)" v-bind:class="{'cur' : index===curIndex}">￥
                    {{item.startPrice}} -
                    {{item.endPrice}} 元</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="item in goodList">
                    <div class="pic">
                      <a href="#"><img v-lazy="'static/' + item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="view-more-normal"
                   v-infinite-scroll="loadMore"
                   infinite-scroll-disabled="busy"
                   infinite-scroll-distance="20">
                <img src="./../../static/loading-svg/loading-spinning-bubbles.svg" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal v-bind:mdShow="mdShow" v-on:close="closeModal">
        <p slot="message">
          {{msg}}
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:void(0);" @click="closeModal">关闭</a>
        </div>
      </Modal>
      <Modal v-bind:mdShow="mdSuccess" v-on:close="closeModal">
        <p slot="message">
          {{msg}}
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:void(0);" @click="closeModal">继续购物</a>
          <router-link class="btn btn--m btn--red" href="javascrip:void(0);" to="/cart">去购物车结算</router-link>
        </div>
      </Modal>
      <div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>
      <NavFooter></NavFooter>
    </div>

</template>
<script>
  import './../assets/css/base.css'
  import './../assets/css/goods-list.css'

  import NavHeader from './../components/NavHeader.vue'
  import NavBread from './../components/NavBread.vue'
  import NavFooter from './../components/NavFooter.vue'
  import Modal from '../components/Modal.vue'

  import axios from 'axios'

  export default {
    mounted () {
      this.getGoods()
    },
    components: {
      Modal,
      NavHeader,
      NavBread,
      NavFooter
    },
    data () {
      return {
        priceFilter: [
          {
            startPrice: 0,
            endPrice: 100
          }, {
            startPrice: 100,
            endPrice: 1000
          }, {
            startPrice: 1000,
            endPrice: 10000
          }
        ],
        param: {
          startPrice: 0,
          endPrice: 0,
          pageSize: 8,
          pageIndex: 1,
          sort: 'asc'
        },
        curIndex: 'all',
        filterBy: false,
        overLayFlag: false,
        sortDefault: true,
        busy: false,
        loading: false,
        mdShow: false,
        mdSuccess: false,
        msg: '',
        goodList: []
      }
    },
    methods: {
      closeModal () {
        this.mdShow = false
        this.mdSuccess = false
      },
      getGoods (flag) {
        axios.get('/goods/list', {
          params: this.param
        }).then((data) => {
          let array = data.data.result
          if (flag) {
            this.busy = false
            if (array.length < 8) {
              this.busy = true
            }
            this.goodList = this.goodList.concat(array)
          } else {
            this.goodList = array
          }
          this.loading = false
        })
      },
      addCart (productId) {
        axios.post('/goods/addCart', {productId: productId}).then((res) => {
          var status = res.data.status
          if (status === 0) {
            this.msg = '加入购物车成功！'
            this.mdSuccess = true
          } else {
            this.msg = res.data.msg
            this.mdShow = true
          }
        })
      },
      setFilter (index) {
        this.curIndex = index
        this.busy = false
        this.param.pageIndex = 1
        if (index !== 'all') {
          this.param.startPrice = this.priceFilter[index].startPrice
          this.param.endPrice = this.priceFilter[index].endPrice
        } else {
          this.param.startPrice = 0
          this.param.endPrice = 0
        }
        this.getGoods()
      },
      showFilterPop () {
        this.filterBy = true
        this.overLayFlag = true
      },
      closePop () {
        this.filterBy = false
        this.overLayFlag = false
      },
      setSortDefault () {
        this.sortDefault = true
        this.busy = false
        this.param.sort = 'asc'
        this.param.pageIndex = 1
        this.getGoods()
      },
      setSort () {
        this.sortDefault = false
        this.busy = false
        this.param.pageIndex = 1
        let sort = this.param.sort
        if (sort === 'asc') {
          sort = 'desc'
        } else {
          sort = 'asc'
        }
        this.param.sort = sort
        this.getGoods()
      },
      loadMore () {
        this.busy = true
        this.param.pageIndex ++
        this.loading = true
        setTimeout(() => {
          this.getGoods(true)
        }, 500)
      }
    }
  }
</script>
