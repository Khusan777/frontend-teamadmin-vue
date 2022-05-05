<template>
  <div className="w-full flex justify-center items-center">
    <AtLoginPage
      @login="loginFunc"
      v-model:phone="user.phone"
      v-model:password="user.password"
      :title-logo="TeamLogo"
      :submitLoading="loading"
    />
  </div>
</template>
<script>
  import { defineAsyncComponent, defineComponent, inject, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { login } from '~/services/auth/auth.api';
  import logo from '~/assets/img/favicon.svg';

  export default defineComponent({
    name: 'AuthPage',
    components: {
      AtLoginPage: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtLoginPage/AtLoginPage')),
    },
    setup() {
      let loading = ref(false);
      const TeamLogo = ref({
        path: logo,
        name: 'Team',
      });
      const user = ref({
        phone: '',
        password: '',
        'app': 'Admin',
      });
      const $toast = inject('$toast');
      const router = useRouter();
      const loginFunc = () => {
        loading.value = true;
        login(user.value)
          .then(() => {
            router.push({ name: 'employees' });
          })
          .catch(error => {
            if (error) {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            }
          })
          .finally(() => (loading.value = false));
      };
      return {
        loading,
        user,
        loginFunc,
        TeamLogo,
      };
    },
  });
</script>
