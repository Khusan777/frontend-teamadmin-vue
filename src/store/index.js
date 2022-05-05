import { createStore } from 'vuex';
import auth from './auth';
import core from './core';

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    core,
  },
});
