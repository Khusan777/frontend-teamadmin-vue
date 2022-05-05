<template>
  <div class="md:col-span-1 col-span-2">
    <at-input placeholder="Поиск по ФИО" iconAfter="search" v-model="query.search" />
  </div>
  <div class="md:col-span-1 col-span-2">
    <at-select
      :options="selectOptions('Все позиции', positions)"
      v-model="query.position_id"
      placeholder="Выберите позиции"
    ></at-select>
  </div>
  <div class="md:col-span-1 col-span-2">
    <at-select
      :options="selectOptions('Все отделы', departments)"
      v-model="query.department_id"
      placeholder="Выберите отдел"
    ></at-select>
  </div>
  <div class="md:col-span-1 col-span-2">
    <at-select
      :options="selectOptions('Все команды', teams)"
      v-model="query.team_id"
      placeholder="Выберите команду"
    ></at-select>
  </div>
  <div class="col-span-4">
    <div v-if="loading">
      <AtTable class="max-h-96 overflow-y-auto" :elements="loadingArray">
        <template #element>
          <at-table-item>
            <at-skeleton type="row"></at-skeleton>
          </at-table-item>
        </template>
      </AtTable>
    </div>
    <div v-else>
      <at-table :head="messagesTableHead" :elements="colleagues?.data">
        <template #element="{ element, index }">
          <at-table-item>
            <p class="text-gray-400">{{ index + 1 }}</p>
          </at-table-item>
          <at-table-item
            class="max-w-md"
            :to="{ name: 'colleagues.detail', params: { id: element.id }, query: { tab: 'profile' } }"
          >
            <div class="text-black whitespace-nowrap flex items-center">
              <span
                class="rounded-full h-3 w-3 inline-block mr-2"
                :class="calculateOfficeEmployees(element?.status)"
              ></span>
              {{ element?.name || '-' }}
            </div>
          </at-table-item>
          <at-table-item
            class="max-w-md"
            :to="{ name: 'colleagues.detail', params: { id: element.id }, query: { tab: 'profile' } }"
          >
            <p class="text-gray-500 whitespace-wrap">
              {{ element.current_position?.name || '-' }}
            </p>
          </at-table-item>
          <at-table-item
            class="max-w-md"
            :to="{ name: 'colleagues.detail', params: { id: element.id }, query: { tab: 'profile' } }"
          >
            <div class="flex flex-wrap items-center">
              <p class="text-blue-500 whitespace-wrap">
                {{ element?.department_name || '-' }}
              </p>
            </div>
          </at-table-item>
          <at-table-item
            class="max-w-md"
            :to="{ name: 'colleagues.detail', params: { id: element.id }, query: { tab: 'profile' } }"
          >
            <div class="space-x-2">
              <div class="space-x-2" v-if="element.teams.length > 0">
                <at-badge color="green" v-for="team in element.teams" :key="team.id">{{ team }}</at-badge>
              </div>
              <div v-else>-</div>
            </div>
          </at-table-item>
          <at-table-item
            class="max-w-md"
            :to="{ name: 'colleagues.detail', params: { id: element.id }, query: { tab: 'profile' } }"
          >
            {{ formatDistanceDate(element?.wifi_activity) || '-' }}
          </at-table-item>
        </template>
        <template #footer>
          <div class="flex justify-between items-center">
            <p class="justify-start text-gray-400">
              Показано от <span>{{ colleagues.meta?.from }}</span> до <span> {{ colleagues.meta?.to }}</span> из
              <span>{{ colleagues.meta?.total }}</span>
            </p>
          </div>
          <div v-if="!colleagues.data?.length" class="text-center my-5">
            <p>Пусто</p>
          </div>
        </template>
      </at-table>
      <div class="flex justify-end">
        <at-pagination
          v-if="colleagues?.meta?.last_page > 1"
          class="py-4 md:col-span-1 justify-end"
          v-model="query.page"
          :total="colleagues?.meta?.last_page"
        >
        </at-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import AtBadge from '~/plugins/aliftech-ui/components/AtBadge/AtBadge';
  import AtTable from '~/plugins/aliftech-ui/components/AtTable/AtTable';
  import AtTableItem from '~/plugins/aliftech-ui/components/AtTableItem/AtTableItem';
  import AtSkeleton from '~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton';
  import AtSelect from '~/plugins/aliftech-ui/components/AtSelect/AtSelect';
  import AtPagination from '~/plugins/aliftech-ui/components/AtPagination/AtPagination';
  import AtInput from '~/plugins/aliftech-ui/components/AtInput/AtInput';
  import { formatDistanceDate } from '~/utils/filters/dateFilters';
  import { debounce } from '~/plugins/aliftech-ui/utils';
  import { useStore } from 'vuex';
  import { useRoute } from 'vue-router';
  import useRouterReplace from '~/utils/hooks/useRouterReplace';
  import { ref, watch, computed } from 'vue';
  import { getAllColleagues } from '~/services/core/colleagues.api';
  import { $toast } from '~/main';

  export default {
    name: 'ColleaguesList',
    components: {
      AtBadge,
      AtTable,
      AtTableItem,
      AtSkeleton,
      AtSelect,
      AtInput,
      AtPagination,
    },
    setup() {
      const messagesTableHead = [
        { title: '#' },
        { title: 'ИМЯ' },
        { title: 'ПОЗИЦИЯ' },
        { title: 'ДЕПАРТМЕНТ' },
        { title: 'КОМАНДЫ' },
        { title: 'АКТИВНОСТЬ' },
      ];
      const loading = ref(false);
      const colleagues = ref([]);
      const store = useStore();
      const route = useRoute();
      const loadingArray = ref(Array(15).fill(1));
      const routerReplace = useRouterReplace();
      const query = ref({
        page: route.query.page || 1,
        position_id: route.query.position_id || '',
        team_id: route.query.team_id || '',
        department_id: route.query.department_id || '',
        search: route.query.search || '',
      });

      const getColleagues = () => {
        loading.value = true;
        window.scrollTo(0, 0);
        getAllColleagues(query.value)
          .then(response => {
            colleagues.value = response?.data;
          })
          .catch(response => {
            $toast.show({ title: 'Error', subTitle: response?.response?.data?.message, type: 'error' });
          })
          .finally(() => (loading.value = false));
      };

      getColleagues();

      watch(
        query.value,
        debounce(() => {
          routerReplace.setRouter(query, {
            page: query.value.page,
          });
          getColleagues(query.value);
        }, 500),
        { deep: true }
      );

      const calculateOfficeEmployees = wifiStatus => {
        if (wifiStatus == 1) {
          return 'bg-green-600';
        } else {
          return 'bg-red-600';
        }
      };

      const selectOptions = (defaultTitle, options) => {
        return [{ title: defaultTitle, value: '' }, ...options];
      };

      return {
        route,
        calculateOfficeEmployees,
        routerReplace,
        loading,
        colleagues,
        query,
        messagesTableHead,
        formatDistanceDate,
        loadingArray,
        selectOptions,
        positions: computed(() => store.getters['core/positions']),
        departments: computed(() => store.getters['core/departments']),
        teams: computed(() => store.getters['core/teams']),
      };
    },
  };
</script>

<style scoped></style>
