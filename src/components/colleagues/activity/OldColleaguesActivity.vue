<template>
  <div class="grid grid-cols-6 items-end gap-x-4 gap-y-6 pb-4">
    <div class="md:col-span-2 col-span-6">
      <at-input placeholder="Поиск по ФИО" iconAfter="search" v-model="query.search" />
    </div>
    <div class="md:col-span-1 col-span-6">
      <at-select
        :options="selectOptions('Все позиции', positions)"
        v-model="query.position_id"
        placeholder="Выберите позиции"
      ></at-select>
    </div>
    <div class="md:col-span-1 col-span-6">
      <at-select
        :options="selectOptions('Все отделы', departments)"
        v-model="query.department_id"
        placeholder="Выберите отдел"
      ></at-select>
    </div>
    <div class="md:col-span-1 col-span-6">
      <at-select
        :options="selectOptions('Все команды', teams)"
        v-model="query.team_id"
        placeholder="Выберите команду"
      ></at-select>
    </div>
    <div class="md:col-span-1 col-span-6">
      <at-select
        :options="selectOptions(' Выберите статус активности', statuses)"
        v-model="query.status"
        placeholder="Выберите статус активности"
      ></at-select>
    </div>
  </div>
  <div class="mt-6 pt-4 border-t" v-if="loading">
    <at-skeleton type="input-with-label" class="mb-5"></at-skeleton>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <div v-for="i in 26" :key="i">
        <stats-skeleton class="mb-1 px-14 py-6"></stats-skeleton>
      </div>
    </div>
  </div>
  <div v-else v-for="activityList in activities" :key="activityList.id">
    <div v-if="activities?.length && activityList?.employees.length" class="mt-4 pt-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          class="cursor-pointer hover:opacity-80 relative"
          v-for="activityColleague in activityList?.employees"
          :key="activityColleague?.id"
        >
          <AtTooltip :body="activityColleague?.case?.reason" trigger="hover" position="top">
            <at-panel
              @click="
                $router.push({
                  name: 'colleagues.detail',
                  params: { id: activityColleague?.id },
                  query: { tab: 'profile' },
                })
              "
            >
              <div class="flex">
                <img
                  v-img-loader
                  class="h-20 w-20 object-cover bg-gray-400"
                  :src="getUserImage(activityColleague?.id)"
                  @error="getUserImage(activityColleague?.id, $event)"
                  :alt="activityColleague.name"
                />
                <div class="ml-4">
                  <p>{{ activityColleague?.name }}</p>
                  <p class="mb-1">
                    <span class="text-gray-400">от - </span> {{ activityColleague?.work_start_time }}
                    <span class="text-gray-400"> до - </span> {{ activityColleague?.work_end_time }}
                  </p>
                  <div class="flex mt-2 gap-3">
                    <at-badge :color="statuses[activityColleague?.status - 1]?.color" rounded>
                      {{ statuses[activityColleague?.status - 1]?.title }}
                    </at-badge>
                    <p v-if="statuses[activityColleague?.status - 1]?.title == 'в отпуске'" class="text-blue-400">
                      - {{ activityColleague?.case?.vacation_type }}
                    </p>
                  </div>
                </div>
              </div>
            </at-panel>
          </AtTooltip>
        </div>
      </div>
    </div>
  </div>
  <div class="mt-6 text-center" v-if="!activities?.length">
    <at-alert type="info">Нет данных</at-alert>
  </div>
</template>

<script>
  import AtBadge from '~/plugins/aliftech-ui/components/AtBadge/AtBadge';
  import AtPanel from '~/plugins/aliftech-ui/components/AtPanel/AtPanel';
  import AtSkeleton from '~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton';
  import AtSelect from '~/plugins/aliftech-ui/components/AtSelect/AtSelect';
  import AtInput from '~/plugins/aliftech-ui/components/AtInput/AtInput';
  import StatsSkeleton from '~/components/skeleton/StatsSkeleton';
  import AtTooltip from '~/plugins/aliftech-ui/components/AtTooltip/AtTooltip';
  import { useRoute } from 'vue-router';
  import useUserAvatar from '~/utils/hooks/useUserAvatar';
  import useRouterReplace from '~/utils/hooks/useRouterReplace';
  import { activityColleagues } from '~/services/core/colleagues.api';
  import { ref, watch, computed } from 'vue';
  import { $toast } from '~/main';
  import { useStore } from 'vuex';
  import AtAlert from '~/plugins/aliftech-ui/components/AtAlert/AtAlert';
  import { debounce } from '~/plugins/aliftech-ui/utils';
  export default {
    name: 'ColleaguesActivity',
    components: {
      AtAlert,
      AtTooltip,
      StatsSkeleton,
      AtSelect,
      AtBadge,
      AtPanel,
      AtInput,
      AtSkeleton,
    },
    setup() {
      const store = useStore();
      const routerReplace = useRouterReplace();
      const loading = ref(false);
      const activities = ref([]);
      const userAvatar = useUserAvatar();
      const route = useRoute();
      const colleaguesImg = ref(null);
      const binaryImage = ref(null);
      const query = ref({
        position_id: route.query.position_id || '',
        team_id: route.query.team_id || '',
        department_id: route.query.department_id || '',
        search: route.query.search || '',
        status: route.query.status_id || '',
      });

      const selectOptions = (defaultTitle, options) => {
        return [{ title: defaultTitle, value: '' }, ...options];
      };

      const getColleaguesActivity = async query => {
        loading.value = true;
        await activityColleagues(query)
          .then(response => {
            activities.value = response?.data.data;
          })
          .catch(error => {
            if (error) {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            }
          })
          .finally(() => (loading.value = false));
      };

      getColleaguesActivity();

      watch(
        query.value,
        debounce(() => {
          routerReplace.setRouter(query, {
            page: 1,
          });
          getColleaguesActivity(query.value);
        }, 500),
        { deep: true }
      );

      return {
        route,
        routerReplace,
        query,
        useUserAvatar,
        activities,
        getUserImage: userAvatar.getUserResizedImage,
        colleaguesImg,
        binaryImage,
        loading,
        getColleaguesActivity,
        selectOptions,
        userAvatar,
        positions: computed(() => store.getters['core/positions']),
        departments: computed(() => store.getters['core/departments']),
        teams: computed(() => store.getters['core/teams']),
        statuses: computed(() => store.getters['core/status']),
      };
    },
  };
</script>

<style scoped></style>
