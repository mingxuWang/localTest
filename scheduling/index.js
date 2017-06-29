import Vue from 'vue';
import vueRouter from 'vue-router'
import router from './router/index';
import App from 'pages/app.vue';
import Axios from 'axios';
import State from './store/state';
import {Loading} from 'element';

Vue.prototype.$loading = Loading;
Vue.prototype.$http = Axios;
Vue.prototype.$state = State;

new Vue({
  // el: '#app',
  router,
  render: h => h( App )
}).$mount('#app');
