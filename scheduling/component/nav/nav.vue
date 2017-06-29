<template lang="html">
  <div class="mod-header">
      <h1 class="title">
          链商调度可视化
      </h1>
      <div class="nav">
        <el-menu mode="horizontal" default-active="/project/list" router>
          <el-menu-item index="/project/list">项目列表</el-menu-item>
        </el-menu>
      </div>
  </div>
</template>

<script>

import { Menu, MenuItem, Submenu, Input } from 'element';
export default {
    data(){
      return {

      };
    },
    components:{
      "el-menu": Menu,
      "el-menu-item": MenuItem,
      "el-submenu": Submenu
    },
    watch: {
      $route(val){
          // console.log(val);
      }
    },
    methods:{
    }
}
</script>

<style lang="less">
.mod-header{
  width: 1200px;
  display: flex;
  align-items: center;
  .title{
    padding-right: 240px;
  }
  .el-menu{
    background-color: inherit;
  }
}
</style>
