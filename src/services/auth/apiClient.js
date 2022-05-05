import axios from 'axios';
import { throttleAdapterEnhancer } from 'axios-extensions';
import router from '~/router';
import { parseErrorsFromResponse } from '~/utils/parsers';
import { objCheckType } from '~/utils/computeFunc';
import { app } from '~/main';
import VueCookie from 'vue-cookie';

const throttleConfig = {
  threshold: 1000,
};

const apiClient = axios.create({
  baseURL: `${process.env.VUE_APP_BACKEND_API}/`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'x-access-token': `${process.env.VUE_APP_API_KEY}`,
    'X-Token-Lifetime': 14400,
  },
  adapter: throttleAdapterEnhancer(axios.defaults.adapter, throttleConfig),
});

const generateToaster = errors => {
  if (errors && objCheckType(errors, 'string')) {
    app.config.globalProperties?.$toast.error(errors);
  } else if (errors && errors.length) {
    errors.forEach(error => {
      app.config.globalProperties?.$toast.error(error);
    });
  }
};

const authInterceptor = config => {
  const authToken = app.config.globalProperties?.$cookie?.get('auth');
  if (authToken) {
    config.headers['Authorization'] = authToken;
  }
  return config;
};

const clearCookie = () =>
  app.config.globalProperties?.$cookie
    ? new Promise((resolve, reject) => {
        const $cookie = app.config.globalProperties?.$cookie;
        try {
          $cookie.delete('auth');
          $cookie.delete('sms-verify');
          $cookie.delete('sms-verify-phone');
          $cookie.delete('sms-verify-phone-prefix');
          $cookie.delete('sms-verify-remember-me');
          $cookie.delete('sms-verify-sms-attempts');
          resolve();
        } catch (e) {
          reject(e);
        }
      })
    : (() => {
        const error = '[FE]Ошибка, не можем получить доступ к `cookie` на вашем устройстве';
        generateToaster(error);
        return Promise.reject(error);
      })();

const errorStatus = {
  400: function () {
    app.config.globalProperties?.$toast?.warning('Данные не найдены');
  },
  401: function () {
    delete apiClient.defaults.headers['Authorization'];
    VueCookie.delete('auth');
    router.push('/');
  },
  // 404: function () {
  //   router.push({ name: 'not-found' });
  // },
  419: function () {
    router.back() || router.push('/');
  },
  // 500: function () {
  //   router.push({ name: 'object-not-found' });
  // },
};

const errorInterceptor = error => {
  let errors = parseErrorsFromResponse(error);
  if (error?.response?.status in errorStatus) {
    errorStatus[error.response.status]();
  } else {
    generateToaster(errors);
  }
  return Promise.reject(error);
};
const responseInterceptor = response => response;

apiClient.interceptors.response.use(responseInterceptor, errorInterceptor);
apiClient.interceptors.request.use(authInterceptor);

export { apiClient, clearCookie };
