import Vue from 'vue';
import VueRouter from 'vue-router';
import login from '../components/login.vue';
import home from '../components/home.vue';
import welocme from '../components/welcome.vue';
import users from '../components/user/users.vue';

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
      {path: '/users', component: users}]
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
