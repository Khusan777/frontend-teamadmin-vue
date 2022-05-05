<script>
  export default {
    beforeRouteEnter(to, from, next) {
      if (!to.query.tab) return next({ path: to.path, query: { tab: 'income' } });
      next();
    },
  };
</script>

<script setup>
  import { defineAsyncComponent, computed, ref, reactive } from 'vue';
  import { ChevronLeftIcon, UserIcon, UserGroupIcon } from '@heroicons/vue/solid';
  import { useRoute } from 'vue-router';
  import { useStore } from 'vuex';
  import { deleteEmployeeById, getEmployeeData } from '~/services/core/employee.api';
  import { $toast } from '~/main';
  import router from '~/router';
  import AtInput from '~/plugins/aliftech-ui/components/AtInput/AtInput';
  import { minLength, required } from '@vuelidate/validators';
  import useVuelidate from '@vuelidate/core';
  const ColleaguesIncomeData = defineAsyncComponent(() => import('~/components/colleagues/ColleaguesSalaryData'));
  const AtTabs = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTabs/AtTabs'));
  const AtBadge = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtBadge/AtBadge'));
  const ColleaguesProfileData = defineAsyncComponent(() => import('~/components/colleagues/ColleaguesProfileData'));
  const ColleaguesPositionData = defineAsyncComponent(() => import('~/components/colleagues/ColleaguesPositionData'));
  const AtButton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtButton/AtButton'));
  const AtSkeleton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton'));
  const AtModal = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtModal/AtModal'));
  const route = useRoute();
  const store = useStore();
  const btnLoading = ref(false);
  const modalDeleteEmployee = ref(false);
  const loading = ref(false);
  const statuses = store.getters['core/status'];
  const state = reactive({
    reasonDeleteEmployee: '',
  });
  const rules = {
    reasonDeleteEmployee: { required, minLength: minLength(4) }, // Matches state.firstName
  };
  const v$ = useVuelidate(rules, state, { $scope: false });
  const colleagueData = ref(null);
  const colleagueDepartment = ref(null);
  const tabComponents = computed(() => ({
    income: {
      component: ColleaguesIncomeData,
      props: {
        userId: Number(route.params.id),
      },
    },
    profile: {
      component: ColleaguesProfileData,
      props: {
        userId: Number(route.params.id),
      },
    },
    position: {
      component: ColleaguesPositionData,
      props: {
        userId: Number(route.params.id),
      },
    },
  }));

  const deleteEmployee = async () => {
    v$.value.$reset();
    if (v$.value.$invalid) {
      v$.value.$touch();
      return;
    } else {
      btnLoading.value = true;
      deleteEmployeeById(Number(route.params.id), {
        'reason': state.reasonDeleteEmployee,
      })
        .then(response => {
          $toast.show({ title: 'Success', subTitle: response?.data?.message, type: 'success' });
          router.push({ name: 'employees' });
        })
        .catch(error => {
          if (error) {
            $toast.show({ title: 'Error', subTitle: error?.data?.message, type: 'error' });
          }
        })
        .finally(() => (btnLoading.value = false));
    }
  };

  const getColleagueHeaderData = ColleagueId => {
    loading.value = true;
    getEmployeeData(ColleagueId)
      .then(response => {
        colleagueData.value = response?.data.data;
        colleagueDepartment.value = response?.data.data.teams;
      })
      .catch(error => {
        if (error) {
          $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
        }
      })
      .finally(() => (loading.value = false));
  };
  getColleagueHeaderData(Number(route.params.id));
</script>

<template>
  <div>
    <div class="-m-6 mb-4">
      <div class="w-full bg-alpha pb-5">
        <div v-if="loading">
          <at-skeleton class="px-4 py-2" type="row"></at-skeleton>
          <at-skeleton class="px-4 py-2" type="row"></at-skeleton>
        </div>
        <div v-else>
          <div class="flex items-center p-3 border-b">
            <chevron-left-icon
              class="w-10 h-18 text-gray-300 mr-2 ml-2 cursor-pointer"
              @click="$router.go(-1)"
            ></chevron-left-icon>
            <h1 @click="$router.go(-1)" class="text-xl font-bold cursor-pointer">{{ colleagueData?.name || '-' }}</h1>
            <div class="flex-grow flex items-center justify-end">
              <AtButton class="mr-6" size="sm" :to="{ name: 'productivity.index' }">Перейти к продуктивности</AtButton>
            </div>
          </div>
          <div class="ml-9 mt-4 flex items-center">
            <at-badge class="mr-4" :color="statuses[colleagueData?.status - 1]?.color" rounded>
              {{ statuses[colleagueData?.status - 1]?.title }}
            </at-badge>
            <user-icon class="w-6 h-6 text-gray-400 items-center"></user-icon>
            <p class="ml-2 mr-6">{{ colleagueData?.current_position?.position?.name || '-' }}</p>
            <user-group-icon class="w-6 h-6 text-gray-400 items-center"></user-group-icon>
            <p class="ml-2">{{ colleagueDepartment[colleagueDepartment?.length - 1]?.department?.name || '-' }}</p>
            <div class="flex-grow flex justify-end px-8 items-center">
              <at-button
                @click="deleteEmployee, (modalDeleteEmployee = true)"
                color="danger"
                icon="trash"
                :loading="btnLoading"
                >Удалить сотрудника</at-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-6">
      <AtTabs
        :items="[
          { title: 'Профиль', value: 'profile' },
          { title: 'Доход', value: 'income', exact: true },
          { title: 'Позиция', value: 'position', exact: true },
        ]"
        :model-value="$route.query.tab"
        @update:model-value="$router.push({ path: $route.path, query: { tab: $event } })"
      />
      <keep-alive>
        <component
          :is="tabComponents[route.query.tab]?.component || tabComponents.profile.component"
          v-bind="tabComponents[route.query.tab]?.props || tabComponents.profile.props"
        ></component>
      </keep-alive>
    </div>

    <AtModal v-model="modalDeleteEmployee" :title="'Удалить сотрудника'">
      <div class="mt-2">
        <p class="text-yellow-500 text-center text-lg">Вы точно хотите удалить этого сотрудника?</p>
        <at-input
          v-model="state.reasonDeleteEmployee"
          :error="v$.reasonDeleteEmployee.$error"
          label="Причина"
        ></at-input>
        <div v-for="error of v$.reasonDeleteEmployee.$errors" :key="error.$uid">
          <p class="text-red-600">{{ error.$message }}</p>
        </div>
      </div>
      <div class="flex space-x-3 mt-3">
        <AtButton class="w-full p-4" @click="modalDeleteEmployee = false">Закрыть</AtButton>
        <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="deleteEmployee()">Удалить</AtButton>
      </div>
    </AtModal>
  </div>
</template>
