import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import AlifUI from '~/plugins/aliftech-ui';
import sentry from '~/plugins/sentry';
import VueCookie from 'vue-cookie';
import store from '~/store';
import AtToast from '~/plugins/aliftech-ui/toast';
import { formatDateByDayMonthYear, formatDistanceDate, readableDate, readableTime } from '~/utils/filters/dateFilters';
import '~/assets/scss/main.scss';
import loaderDirectives from '~/directives/loaderDirectives';

export const app = createApp(App);
app.use(router);
app.use(AlifUI);
app.use(AtToast);
app.use(sentry);
app.use(store);
app.provide('$toast', AtToast);

app.config.globalProperties.$filters = {
  formatDateByDayMonthYear,
  formatDistanceDate,
  readableDate,
  readableTime,
};

app.directive('img-loader', loaderDirectives);
app.config.globalProperties.$cookie = VueCookie;
app.config.globalProperties.$toast = AtToast;
export const $toast = AtToast;

app.mount('#app');
