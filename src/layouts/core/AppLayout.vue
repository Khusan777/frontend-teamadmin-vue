<template>
  <div class="w-full min-h-screen bg-gray-50">
    <AtSidebar
      :logo="logo"
      @logout="logout"
      :items="[
        { title: 'Сотрудники', icon: 'userGroup', to: { name: 'employees' } },
        { title: 'Зарплаты', icon: 'currencyDollar', to: { name: 'salaries' } },
        { title: 'Продуктивность', icon: 'viewGrid', to: { name: 'productivity.index' } },
        { title: 'Активность', icon: 'wifi', to: { name: 'activity.index' } },
        { title: 'Опросы', icon: 'clipboardList', to: { name: 'surveys.index' } },
        { title: 'OutBot', icon: 'chat', to: { name: 'outbot.index' } },
      ]"
      :user="user"
    >
      <div class="container mx-auto -px-2">
        <div>
          <router-view></router-view>
        </div>
      </div>
    </AtSidebar>
  </div>
</template>

<script>
  import { defineAsyncComponent, ref, computed } from 'vue';
  import VueCookie from 'vue-cookie';
  import adminLogo from '~/assets/img/favicon.svg';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  export default {
    name: 'AppLayout',
    components: {
      AtSidebar: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSidebar/AtSidebar')),
    },
    setup() {
      const router = useRouter();
      const store = useStore();
      const logo = ref({
        name: 'TeamAdmin',
        path: adminLogo,
      });
      function logout() {
        VueCookie.delete('auth');
        router.push({ name: 'auth' });
      }
      return { user: computed(() => store.state.auth.user), adminLogo, logo, logout, router };
    },
  };
</script>
