import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';

Vue.use( VueRouter );

export default new VueRouter({
  // 这里名称必须要是routes，因为是对应的属性名，不能出错..
  routes
});
