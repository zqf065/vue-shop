<template>
  <div class="index">
  <h1>{{ msg }}</h1>
    
  <div class="header"><Header /></div>
  <div class="left"><Left /></div>
  <div class="right"><Right /></div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Left from '@/components/Left'
import Right from '@/components/Right'
export default {
  name: 'Index',
  components: {
    Header,
    Right,
    Left
  },
  data () {
    return {
      msg: 'this is the index component'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header{
  width:100%;
  height:200px;
  border: 1px solid red;
  padding: 10px;
  float:left;
}
.left{
  width:20%;
  height:500px;
  float:left;
  border:1px solid gray;
}
.right{
  width:79%;
  height:500px;
  float:right;
  border:1px solid green;
}

</style>