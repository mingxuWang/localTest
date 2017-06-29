<template lang="html">
  <div id="app">
      <div class="container">
          <div class="content">
            <router-view></router-view>
          </div>
      </div>
  </div>
</template>

<script>

export default {
  data: function () {
    return {}
  },
  components: {

  },
  computed:{
  },
  created(){
  }
}
</script>

<style lang="less">
html{
  height: 100%;
}
body {
  height: 100%;
}
.container{
  width: 1200px;
  margin: 0 auto;
  .content{
    width: 100%;
  }
}
</style>
