import { getUser } from '~/services/auth/auth.api';

const state = {
  user: undefined,
};

const actions = {
  getUser: async ({ commit }) => {
    await getUser().then(response => {
      commit('SET_USER', response.data);
    });
  },
};

const mutations = {
  SET_USER: (state, user) => {
    state.user = user;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
