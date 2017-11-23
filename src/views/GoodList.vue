<template>
    <div>
      <NavHeader></NavHeader>
      <NavBread></NavBread>
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
                        <a href="javascript:;" class="btn btn--m">加入购物车</a>
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
        param: {
          pageSize: 8,
          pageIndex: 1,
          sort: 'asc'
        },
        overLayFlag: false,
        sortDefault: true,
        busy: false,
        loading: false,
        goodList: []
      }
    },
    methods: {
      getGoods (flag) {
        axios.get('http://127.0.0.1:3000/goods', {
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
      setFilter (index) {
        this.curIndex = index
        this.busy = false
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
