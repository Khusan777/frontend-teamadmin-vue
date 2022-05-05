import { getApplication } from '~/services/core/app.api';

const state = {
  globals: undefined,
};

const actions = {
  getApp: async ({ commit }) => {
    await getApplication().then(res => {
      commit('SET_APP', res?.data);
    });
  },
};

const mutations = {
  SET_APP: (state, app) => {
    state.globals = app;
  },
};

const getters = {
  positions: state => {
    return state.globals?.positions?.map(item => {
      return { title: item.name, value: item.id };
    });
  },

  departments: state => {
    return state.globals?.departments?.map(item => {
      return { title: item.name, value: item.id };
    });
  },
  teams: state => {
    return state.globals?.teams?.map(item => {
      return { title: item.name, value: item.id };
    });
  },
  status: state => {
    return state.globals?.statuses?.map(item => {
      return { title: item.name, value: item.id, color: item.color };
    });
  },
  gradations: state => {
    return state.globals?.gradations?.map(item => {
      return { title: item.name, value: item.id };
    });
  },
  cities: state => {
    return state.globals?.cities?.map(item => {
      return { title: item.name, value: item.id };
    });
  },
  vacation_types: state => {
    return Object.values(state.globals?.vacation_types).map(item => {
      return { title: item.name_ru, value: item.id };
    });
  },
  surveysCategory: state => {
    return state.globals?.survey_categories?.map(item => {
      return { title: item.title, value: item.id };
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
