import Vue    from 'vue';
import Router from 'vue-router';
import Index  from '@/pages/Index';

// Enable VUE router.
Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    }
  ]
});
