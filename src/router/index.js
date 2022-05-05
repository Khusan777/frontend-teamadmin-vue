import { createRouter, createWebHistory } from 'vue-router';
import { publicRoutes } from '~/router/public';
import { privateRoutes } from '~/router/private';
import VueCookie from 'vue-cookie';
import store from '~/store';

const router = createRouter({
  history: createWebHistory(),
  routes: privateRoutes.concat(publicRoutes),
});

router.beforeEach(async (to, from, next) => {
  document.title = 'Team' + (to?.meta?.title ? ' - ' + to.meta.title : '');
  const loggedIn = VueCookie.get('auth');
  if (!loggedIn && to.name !== 'auth.login') next({ name: 'auth.login' });
  else if (to.matched.some(record => record.meta.public) && loggedIn) {
    next({ name: 'profile' });
  } else {
    if (!store.state?.auth?.user && loggedIn) {
      await store.dispatch('auth/getUser');
      if (!store.state?.core?.globals) {
        await store.dispatch('core/getApp');
      }
    }
    next();
  }
});

export default router;
