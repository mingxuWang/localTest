<template lang="html">
    <div class="mod-home">
      <div class="left"></div>
      <div class="right">1111111111111111111111111111111111111111111111111111111111111</div>
    </div>
</template>

<script>
export default {
    data(){
      return {

      }
    }
}
</script>

<style lang="less">
.mod-home{
    width: 100%;
    height: 30px;
    background-color: green;
    display: flex;
    .left{
      width: 100px;
      background-color: red;
      height: 100%;
      flex-shrink: 0;
    }
    .right{
      // width: 100%;
      background-color: yellow;
      // overflow: hidden;
      word-wrap: break-word;
      word-break: break-all;
    }
}

</style>
