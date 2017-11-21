<template>
    <div>
      <NavHeader></NavHeader>
      <NavBread></NavBread>
      <div class="accessory-result-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">排序:</span>
            <a href="javascript:void(0)" class="default cur">默认</a>
            <a href="javascript:void(0)" class="price">价格 <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
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
                      <a href="#"><img v-bind:src="'static/' + item.productPicture" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.productPrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
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

  import axios from 'axios'

  export default {
    mounted () {
      this.getGoods()
    },
    components: {
      NavHeader,
      NavBread,
      NavFooter},
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
        curIndex: 'all',
        filterBy: false,
        overLayFlag: false,
        goodList: []
      }
    },
    methods: {
      getGoods () {
        axios.get('/goods').then((data) => {
          var array = data.data.result
          this.goodList = array
        })
      },
      setFilter (index) {
        this.curIndex = index
      },
      showFilterPop () {
        this.filterBy = true
        this.overLayFlag = true
      },
      closePop () {
        this.filterBy = false
        this.overLayFlag = false
      }
    }
  }
</script>
