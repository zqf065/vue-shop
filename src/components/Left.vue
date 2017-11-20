<template>
<div>
{{msg}}
<ul>
<li v-for="item in menu"><a :href="item.href">{{item.text}}</a></li>
</ul>
</div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'this is left slide',
      menu: [
      {href: '#/', text: '首页'},
      {href: '#/model', text: '模块'}
      ]
    }
  }
}
</script>
<style scope>
.left{
  color: green;
}
</style>