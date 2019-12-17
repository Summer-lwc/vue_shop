import Vue from 'vue';
import VueRouter from 'vue-router';
import login from '../components/login.vue';
import home from '../components/home.vue';
import welocme from '../components/welcome.vue';
import users from '../components/user/users.vue';
import rights from '../components/power/rights.vue';
import roles from '../components/power/roles.vue';
import cate from '../components/goods/cate.vue';
import params from '../components/goods/params.vue';
import goodslist from '../components/goods/list.vue';
import add from '../components/goods/add.vue';
import order from '../components/order/order.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  { 
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [
      {path: '/welcome', component: welocme},
      {path: '/users', component: users},
      {path: '/rights', component: rights},
      {path: '/roles', component: roles},
      {path: '/categories', component: cate},
      {path: '/params', component: params},
      {path: '/goods', component: goodslist},
      {path: '/goods/add', component: add},
      {path: '/orders', component: order},
    ]
  },
  
];

const router = new VueRouter({
  routes
});


router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next();
  } else {
    const tokenStr =window.sessionStorage.getItem( "token" );
    if ( !tokenStr ) {
      return next('/login');
    }else{
      return next();
    }
  }
});

export default router;
