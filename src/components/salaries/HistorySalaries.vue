<template>
  <div class="grid grid-cols-4 items-end gap-x-4 gap-y-6 mb-6">
    <div class="col-span-2">
      <at-input placeholder="Поиск по ФИО" iconAfter="search" v-model="queryHistorySalary.search" />
    </div>
    <div class="sm:col-span-1 col-span-4">
      <at-select
        :options="selectOptions('Все отделы', departments)"
        v-model="queryHistorySalary.department_id"
        placeholder="Выберите отдел"
      >
      </at-select>
    </div>
    <div class="col-span-1">
      <at-select
        :options="selectOptions('Все команды', teams)"
        v-model="queryHistorySalary.team_id"
        placeholder="Выберите команду"
      >
      </at-select>
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
        <at-table :head="messagesTableHead" :elements="colleagueIndex">
          <template #head="{ head }">
            <th>
              <div
                class="cursor-pointer px-4 py-2 flex gap-x-1 items-center hover:text-gray-500"
                @click="head.action()"
              >
                <filter-icon v-if="head.title == 'ЗП'" class="w-4 h-4 text-black"></filter-icon>
                <filter-icon v-if="head.title == 'Start Date'" class="w-4 h-4 text-black"></filter-icon>
                <span>{{ head.title }}</span>
              </div>
            </th>
          </template>
          <template #element="{ element, index }">
            <at-table-item>
              <p class="text-gray-500">{{ index + 1 }}</p>
            </at-table-item>
            <at-table-item :to="{ name: 'colleagues.detail', params: { id: element?.employee_id } }">
              <p class="text-black whitespace-nowrap">
                {{ element?.employee?.name || '-' }}
              </p>
              <p class="text-gray-400 whitespace-nowrap">
                {{ element?.employee?.current_position?.name }}
              </p>
            </at-table-item>
            <at-table-item :to="{ name: 'colleagues.detail', params: { id: element?.employee_id } }">
              <p class="whitespace-nowrap">
                {{ element?.previous_salary || '-' }}
                <span class="text-green-400">{{
                  element?.amount
                    ? element?.current_salary - element?.previous_salary > 0
                      ? '+$' + Math.abs(element?.current_salary - element?.previous_salary)
                      : '-$' + Math.abs(element?.current_salary - element?.previous_salary)
                    : '-'
                }}</span>
              </p>
            </at-table-item>
            <at-table-item :to="{ name: 'colleagues.detail', params: { id: element?.employee_id } }">
              <p class="text-blue-500 whitespace-nowrap flex">
                {{ element?.current_salary ? '$ ' + element?.current_salary : '-'
                }}<span class="ml-2" v-if="element?.current_salary"
                  ><check-circle-icon class="w-6 h-6 text-green-500"></check-circle-icon
                ></span>
              </p>
            </at-table-item>
            <at-table-item :to="{ name: 'colleagues.detail', params: { id: element?.employee_id } }">
              {{ element?.start_date || '-' }}
            </at-table-item>
          </template>
          <template #footer>
            <div class="flex justify-between items-center">
              <p class="justify-start text-gray-400">
                Показано от <span>{{ indexPagination.meta?.from || '0' }}</span> до
                <span> {{ indexPagination.meta?.to || '0' }}</span> из
                <span>{{ indexPagination.meta?.total || '0' }}</span>
              </p>
            </div>
            <div v-if="!colleagueIndex.length" class="text-center my-5">
              <p>Пусто</p>
            </div>
          </template>
        </at-table>
      </div>
    </div>
  </div>
  <div class="mt-2 flex justify-end">
    <at-pagination
      v-if="indexPagination?.meta?.last_page > 1"
      class="py-4 md:col-span-1 justify-end"
      v-model="queryHistorySalary.page"
      :total="indexPagination?.meta?.last_page"
    ></at-pagination>
  </div>
</template>

<script>
  import AtTable from '~/plugins/aliftech-ui/components/AtTable/AtTable';
  import AtTableItem from '~/plugins/aliftech-ui/components/AtTableItem/AtTableItem';
  import AtSkeleton from '~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton';
  import AtPagination from '~/plugins/aliftech-ui/components/AtPagination/AtPagination';
  import AtInput from '~/plugins/aliftech-ui/components/AtInput/AtInput';
  import AtSelect from '~/plugins/aliftech-ui/components/AtSelect/AtSelect';
  import { formatDistanceDate } from '~/utils/filters/dateFilters';
  import { CheckCircleIcon, FilterIcon } from '@heroicons/vue/solid';
  import { useStore } from 'vuex';
  import { useRoute } from 'vue-router';
  import useRouterReplace from '~/utils/hooks/useRouterReplace';
  import { computed, ref, watch } from 'vue';
  import { getAllColleagues } from '~/services/core/colleagues.api';
  import { $toast } from '~/main';
  import { getAllSalariesByParams } from '~/services/core/salaries.api';
  import { debounce } from '~/plugins/aliftech-ui/utils';

  export default {
    name: 'ColleaguesList',
    components: {
      AtTable,
      AtTableItem,
      AtSkeleton,
      CheckCircleIcon,
      AtPagination,
      AtInput,
      AtSelect,
      FilterIcon,
    },
    setup() {
      const salariesHistory = ref(null);
      const loading = ref(false);
      const colleagues = ref([]);
      const dataListValue = ref(null);
      const indexPagination = ref({});
      const colleaguesFilter = ref(null);
      const store = useStore();
      const route = useRoute();
      const order = ref('desc');
      const routerReplace = useRouterReplace();
      const colleagueIndex = ref([]);
      const loadingArray = ref(Array(15).fill(1));
      const queryHistorySalary = ref({
        paginate: 1,
        search: route.query.search || '',
        department_id: route.query.department_id || '',
        team_id: route.query.team_id || '',
        page: route.query.page || 1,
        per_page: 15,
      });

      const messagesTableHead = [
        { title: '#', action: () => '#' },
        { title: 'ФИО', action: () => 'ФИО' },
        { title: 'Предыдущая ЗП', action: () => 'Предыдущая ЗП' },
        { title: 'ЗП', action: () => sortActualSalary() },
        { title: 'Start Date', action: () => sortActualSalaryDate() },
      ];

      function getIndexHistorySalaries(listId, orderBySalary, nameProperty) {
        loading.value = true;
        if (nameProperty == 'ЗП') {
          getAllSalariesByParams({
            employee_ids: listId,
            status: 'actual',
            order_by: 'amount:' + orderBySalary,
          })
            .then(response => {
              salariesHistory.value = response.data?.data;
              colleagueIndex.value = salariesHistory.value
                .map(salary => ({
                  ...salary,
                  employee: colleagues.value.find(collegue => collegue.id == salary.employee_id),
                }))
                .filter(colleagueFind => {
                  return !!colleagueFind.employee;
                });
            })
            .catch(error => {
              if (error) {
                $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
              }
            })
            .finally(() => (loading.value = false));
        } else if (nameProperty == 'Start Date') {
          getAllSalariesByParams({
            employee_ids: listId,
            status: 'actual',
            order_by: 'start_date:' + orderBySalary,
          })
            .then(response => {
              salariesHistory.value = response.data?.data;
              colleagueIndex.value = salariesHistory.value
                .map(salary => ({
                  ...salary,
                  employee: colleagues.value.find(collegue => collegue.id == salary.employee_id),
                }))
                .filter(colleagueFind => {
                  return !!colleagueFind.employee;
                });
            })
            .catch(error => {
              if (error) {
                $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
              }
            })
            .finally(() => (loading.value = false));
        } else {
          getAllSalariesByParams({ employee_ids: listId, status: 'actual', order_by: 'start_date:' + orderBySalary })
            .then(response => {
              salariesHistory.value = response.data?.data;
              colleagueIndex.value = salariesHistory.value
                .map(salary => ({
                  ...salary,
                  employee: colleagues.value.find(collegue => collegue.id == salary.employee_id),
                }))
                .filter(colleagueFind => {
                  return !!colleagueFind.employee;
                });
            })
            .catch(error => {
              if (error) {
                $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
              }
            })
            .finally(() => (loading.value = false));
        }
      }

      const sortActualSalaryDate = query => {
        if (order.value == 'desc') {
          order.value = 'asc';
        } else {
          order.value = 'desc';
        }
        loading.value = true;
        window.scrollTo(0, 0);
        getAllColleagues(query)
          .then(response => {
            colleagues.value = response?.data?.data;
            dataListValue.value = response?.data?.data?.map(item => item.id).join(',');
            getIndexHistorySalaries(dataListValue.value, order.value, 'Start Date');
          })
          .catch(error => {
            if (error) {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            }
          })
          .finally(() => (loading.value = false));
      };

      const sortActualSalary = queryHistorySalary => {
        if (order.value == 'desc') {
          order.value = 'asc';
        } else {
          order.value = 'desc';
        }
        loading.value = true;
        window.scrollTo(0, 0);
        getAllColleagues(queryHistorySalary)
          .then(response => {
            colleagues.value = response?.data?.data;
            dataListValue.value = response?.data?.data?.map(item => item.id).join(',');
            getIndexHistorySalaries(dataListValue.value, order.value, 'ЗП');
          })
          .catch(error => {
            if (error) {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            }
          })
          .finally(() => (loading.value = false));
      };

      const getColleagues = queryHistorySalary => {
        loading.value = true;
        window.scrollTo(0, 0);
        getAllColleagues(queryHistorySalary)
          .then(response => {
            colleagues.value = response?.data?.data;
            indexPagination.value = response?.data;
            dataListValue.value = response?.data?.data?.map(item => item.id).join(',');
            getIndexHistorySalaries(dataListValue.value, order.value);
          })
          .catch(error => {
            if (error) {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            }
          })
          .finally(() => (loading.value = false));
      };

      getColleagues(queryHistorySalary.value);

      watch(
        queryHistorySalary.value,
        debounce(() => {
          routerReplace.setRouter(queryHistorySalary, {
            page: queryHistorySalary.value.page,
          });
          getColleagues(queryHistorySalary.value);
        }, 500),
        { immediate: true }
      );

      const selectOptions = (defaultTitle, options) => {
        return [{ title: defaultTitle, value: '' }, ...options];
      };

      return {
        route,
        routerReplace,
        colleagues,
        indexPagination,
        loading,
        queryHistorySalary,
        CheckCircleIcon,
        salariesHistory,
        messagesTableHead,
        colleagueIndex,
        getIndexHistorySalaries,
        colleaguesFilter,
        getColleagues,
        getAllSalariesByParams,
        getAllColleagues,
        formatDistanceDate,
        loadingArray,
        // sortScheduleSalary,
        order,
        selectOptions,
        positions: computed(() => store.getters['core/positions']),
        departments: computed(() => store.getters['core/departments']),
        teams: computed(() => store.getters['core/teams']),
      };
    },
  };
</script>

<style scoped></style>
