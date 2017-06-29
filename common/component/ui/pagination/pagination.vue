/**
 * 分页组件
 *
 * props
 * @param  {Number} total 列表总条目数 *必传项
 * @param  {String} page 可选的初始页码数,默认为1
 * @param  {Number} pageSize 默认每页条目数 default: 10
 * @param  {Array} pageSizeList [可选的分页数 default: [10,20,50,100]
 * @param  {String} q 可选的查询参数,发生变化时自动调整选中页码为1与并重置可选页码列表
 * @param  {String} layout 所需的功能，提供total(条目数与页数显示)，go(直接跳转页码)，pageSize(分页条目数切换)，由","分隔
 *
 * events
 * current-change 当前列表页码发生变化时触发 @return {Number} page 页数 只有当前页发生变化时会触发重新请求
 * size-change 当前列表分页数发生变化时触发 @return {Number} size 每页条数
 *
 * 2017-6-16 by Mingxu
 */
<template lang="html">
    <div class="mod-pagination">

        <!-- 总条数与页数 -->
        <span class="total" v-if="layouts.showTotal">{{total}}条,共{{pages}}页</span>
        <select class="page-size" v-model="pageSize" v-if="layouts.showPageSize">
          <template v-for="item in pageSizeList">
            <option :value="item">{{item}}条/页</option>
          </template>
        </select>

        <!-- 前往页数功能 -->
        <span class="go-to " v-if="layouts.showGo">前往<input type="text" class="page-number" @keyup.enter="goTo">页</span>

        <!-- 分页功能 -->
        <ul class="page-list">

          <!-- 首页与前一页 -->
          <li class="page-item"
              :class="currentPage === 1 ? 'disabled' : ''"
              @click="changePage(1)">首页</li>
          <li class="page-item"
              :class="currentPage === 1 ? 'disabled' : ''"
              @click="pageLast">last</li>

          <!-- 页码部分 -->
          <template v-for="page in pageNumList">
              <li class="page-item page"
                  :class="page===currentPage ? 'active': ''"
                  @click="changePage(page)">{{page}}</li>
          </template>

          <!-- 尾页与下一页 -->
          <li class="page-item"
              :class="currentPage === pages || total === 0 ? 'disabled' : ''"
              @click="pageNext">next</li>
          <li class="page-item"
              :class="currentPage === pages || total === 0 ? 'disabled' : ''"
              @click="changePage(pages)">尾页</li>
        </ul>
    </div>
</template>

<script>
export default {
    data(){
      let that = this;
      return {
          // 当前所在页
          currentPage: that.page || 1,
          // 可点击页码
          pageNumList: [],
          // 是否初始化过，要对 可点击页码 进行一次初始化
          inited: false,
      }
    },
    props: {
      // 列表总条目数
      total : {
        type: Number,
        required: true
      },
      // 每页条目数
      pageSize: {
        type: Number,
        default: 10
      },
      // 所需功能
      layout: {
        type: String,
        default: ""
      },
      // 可选每页条目数列表
      pageSizeList: {
        type: Array,
        default: [10,20,50,100]
      },
      // 查询参数，会对该参数进行监听，发生变化时自动调整选中页码与可选列表
      q: {
        type : String
      },
      // 可选的page页码数，只在初始化时使用
      page: {
        type: Number
      }
    },
    watch: {
      /**
       * 监听当前页码数变化，当页码数发生变化时要抛出，进行请求
       * @param  {String} newPage 新的页码数
       */
      currentPage(newPage){
        let that = this,
            // 强制转换一下，避免获得的是字符串
            page = Number(newPage);
        that.changePageList(page);
        that.$emit("current-change",page);
      },
      /**
       * 第一次获取到数据时需要进行一次可选页码的初始化
       * @param  {Boolean} inited 是否初始化
       */
      inited(inited){
          let that = this;
          if(inited){
            that.initPageList();
          }
      },
      /**
       * 监听每页条目数变化，要向外抛出事件需要重新进行数据请求
       * @param  {Number} pageSize 每页的条目数
       */
      pageSize(pageSize){
        let that = this,
            size = Number(pageSize);
        that.inited = false;
        that.pageNumList = [];
        that.$emit("size-change",size);
        // 只有currentPage发生变化时会触发请求，因此要对当前页码进行判断，如果为第一页则要手动抛出事件
        if(that.currentPage === 1){
          that.$emit("current-change",1);
        }else{
          that.currentPage = 1;
        }
      },
      /**
       * 当搜索请求完成后会将新的查询参数q传入，监听其变化，发生变化后需要重置当前所选页数和可选页码列表
       */
      q(){
        let that = this;
        that.currentPage = 1;
        // 初始化页码列表
        that.initPageList();
      }
    },
    computed:{
      /**
       * 通过总条目数与每页条数计算总页数
       * @return {Number} 总页码数
       */
      pages(){
        let that = this,
            aliquot = (that.total % that.pageSize === 0),
            result = parseInt(that.total / that.pageSize),
            sumPages = aliquot ? result : result + 1;
            // 首次加载page时要初始化一次pageList
            if(!that.inited && that.total){
              that.inited = true;
            }
        return sumPages;
      },
      /**
       * 用户使用到的功能
       * @return {Object} 用户需要使用到的功能
       */
      layouts(){
        let that = this,
            layout = {},
            user = that.layout.split(',');
        // 总条目与页码数
        if(user.indexOf("total") !== -1){
            layout.showTotal = true;
        }
        // 直接跳转功能
        if(user.indexOf("go") !== -1){
            layout.showGo = true;
        }
        // 可选分页数
        if(user.indexOf("pageSize") !== -1){
            layout.showPageSize = true;
        }
        return layout;
      }
    },
    methods: {
      /**
       * 点击页数时
       * @param  {Object} page 选中的页码
       */
      changePage(page){
        if(page !== 0){
          this.currentPage = page;
        }
      },
      /**
       * 加载上一页
       */
      pageLast(){
        let that = this;
        if(that.currentPage !== 1){
          that.currentPage--;
        }
      },
      /**
       * 加载下一页
       */
      pageNext(){
        let that = this;
        if(that.currentPage !== that.pages && that.total !== 0){
          that.currentPage++;
        }
      },
      /**
       * 通过输入框进行列表页加载
       * @param  {Object} event 事件对象
       */
      goTo(event){
        let that = this,
            page = Number(event.target.value);
        // 判断输入类型是否正确
        if(isNaN(page)){
          return alert("请输入数字!");
        }
        // 判断输入数值是否在范围内
        if(page < 1 || page > that.pages){
            return alert("页码超出了可填范围!");
        }
        that.currentPage = page;
      },
      /**
       * 输入的页码是否在页码范围内
       * @param  {Number}  page 输入的页码
       * @return {Boolean}      是否在页码范围内
       */
      isInPageArea(page){
        return (page >= 1 && page <= this.pages);
      },
      /**
       * 根据选中页调整可选页码
       * @param  {Number} page 选中的页码
       */
      changePageList(page){
        let that = this,
            list = that.pageNumList,
            len = list.length,
            index = list.indexOf(page),
            begin,
            newList;
        // 判断是否在当前页码列中
        if(index === -1){
          // 如果为第一页，则直接进行初始化
          if(page === 1){
            return that.initPageList();
          }
          // 如果前后两页都在范围内
          if(that.isInPageArea(page - 2) && that.isInPageArea(page + 2)){
            begin = page - 2;
          }else if(!that.isInPageArea(page + 1) || (page + 1 === that.pages)){
            // 判断后续一页不在范围内，则是最后一页
            // 如果页码是1则为重置操作
            begin = page - 4;
          }else if(!that.isInPageArea(page - 1) || (page - 1 === 1)){
            // 判断前一页不在范围内，则是第一页
            begin = page;
          }
          newList = that.getPageList(begin);
          list.splice(0,len,...newList);
        }else{
          // 判断是否为首尾项
          if(index === 0 && page !== 1){
            list.pop();
            list.unshift(page-1);
          }
          if(index === 4 && page !== that.pages){
            list.shift();
            list.push(page+1);
          }
        }

      },
      /**
       * 获取可选页码数组
       * @param  {Number} n 起始页码数
       * @return {Array}   页码数组
       */
      getPageList(n){
        return [n,n+1,n+2,n+3,n+4];
      },
      /**
       * 初始化可选页码
       * @return {[type]} [description]
       */
      initPageList(){
        let that = this;
        that.pageNumList = [];
        for(let i = 1; i <= 5 ; i++){
            if(i <= that.pages){
              that.pageNumList.push(i);
            }
        }
      }
    }
}
</script>

<style lang="less">
@import url('../base/base.less');
.mod-pagination{
  display: flex;
  .total{
    height: 30px;
    line-height: 30px;
  }
  .page-size{
    margin-left: 10px;
    height: 30px;
    line-height: 30px;
    border:  1px solid @base-line-color;
    &:focus{
      border: 1px solid @base-color;
      outline: none;
    }
  }
  .go-to{
    height: 30px;
    line-height: 30px;
    margin-left: 10px;
    .page-number{
      width: 30px;
      height: 30px;
      box-sizing: border-box;
      border: 1px solid @base-line-color;
      &:focus{
        border: 1px solid @base-color;
        outline: none;
      }
    }
  }
  .page-list{
    display: flex;
    margin-left: 10px;
    .page-item{
      min-width: 20px;
      height: 30px;
      padding: 0 5px;
      line-height: 30px;
      text-align: center;
      color: @base-text-color;
      border:  1px solid @base-line-color;
      cursor: pointer;
      &:not(:first-child){
        border-left: 0;
      }
      &.active{
        color: @base-select-text-color;
        background-color: @base-color;
      }
      &.disabled{
        cursor: not-allowed;
        color: @base-not-allowed-text-color;
      }
    }
  }
}
</style>
