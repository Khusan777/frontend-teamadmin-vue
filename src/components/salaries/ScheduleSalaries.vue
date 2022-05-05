<template>
  <div class="grid grid-cols-4 items-end gap-x-4 gap-y-6 mb-6">
    <div class="sm:col-span-2 col-span-4">
      <at-input placeholder="Поиск по ФИО" iconAfter="search" v-model="queryColleagues.search" />
    </div>
    <div class="sm:col-span-1 col-span-4">
      <at-select
        :options="selectOptions('Все отделы', departments)"
        v-model="queryColleagues.department_id"
        placeholder="Выберите отдел"
      >
      </at-select>
    </div>
    <div class="sm:col-span-1 col-span-4">
      <at-select
        :options="selectOptions('Все команды', teams)"
        v-model="queryColleagues.team_id"
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
                <filter-icon v-if="head.title == 'Запланированная'" class="w-4 h-4 text-black"></filter-icon>
                <filter-icon v-if="head.title == 'Planed At'" class="w-4 h-4 text-black"></filter-icon>
                <span>{{ head.title }}</span>
              </div>
            </th>
          </template>
          <template #element="{ element, index }">
            <at-table-item :to="{ name: 'colleagues.detail', params: { id: element?.employee_id } }">
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
                {{ element?.current_salary || '-' }}
                <span class="text-green-400">{{
                  element?.amount
                    ? element?.amount - element?.current_salary >= 0
                      ? '+$' + Math.abs(element?.amount - element?.current_salary)
                      : '-$' + Math.abs(element?.amount - element?.current_salary)
                    : '-'
                }}</span>
              </p>
            </at-table-item>
            <at-table-item :to="{ name: 'colleagues.detail', params: { id: element?.employee_id } }">
              <p class="text-blue-500 whitespace-nowrap flex">
                {{ element?.amount ? '$ ' + element?.amount : '-' }}
              </p>
            </at-table-item>
            <at-table-item :to="{ name: 'colleagues.detail', params: { id: element?.employee_id } }">
              <div class="flex flex-wrap">
                {{ element?.start_date || '-' }}
                <p
                  v-if="
                    differenceDaysScheduleSalary(element?.start_date) <= 0 &&
                    differenceDaysScheduleSalary(element?.start_date) <= 10
                  "
                  class="text-red-700 ml-2"
                >
                  {{ differenceDaysScheduleSalary(element?.start_date) }}
                </p>
                <p v-else class="text-green-400 ml-2">
                  {{ differenceDaysScheduleSalary(element?.start_date) }}
                </p>
              </div>
            </at-table-item>
          </template>
          <template #footer>
            <div class="flex justify-between items-center">
              <p class="justify-start text-gray-400">
                Показано от <span>{{ indexPagination?.meta?.from || '0' }}</span> до
                <span> {{ indexPagination?.meta?.to || '0' }}</span> из
                <span>{{ indexPagination?.meta?.total || '0' }}</span>
              </p>
            </div>
            <div v-if="!colleagueIndex?.length" class="text-center my-5">
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
      v-model="querySalaries.page"
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
  import differenceInDays from 'date-fns/differenceInDays';
  import { FilterIcon } from '@heroicons/vue/solid';
  import { parseDate } from '~/utils/filters/dateFilters';
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
    components: { AtTable, AtTableItem, AtSkeleton, AtPagination, AtInput, AtSelect, FilterIcon },
    setup() {
      const salariesSchedule = ref(null);
      const loading = ref(false);
      const colleagues = ref([]);
      const dataListValue = ref(null);
      const order = ref('desc');
      const colleagueIndex = ref([]);
      const indexPagination = ref({});
      const messagesTableHead = [
        { title: '#', action: () => '#' },
        { title: 'ФИО', action: () => 'ФИО' },
        { title: 'Текущая ЗП', action: () => 'Текущая ЗП' },
        { title: 'Запланированная', action: () => sortScheduleSalary() },
        { title: 'Planed At', action: () => sortScheduleSalaryDate() },
      ];
      const store = useStore();
      const route = useRoute();
      const routerReplace = useRouterReplace();
      const loadingArray = ref(Array(15).fill(1));
      const queryColleagues = ref({
        paginate: 0,
        department_id: route.query.department_id || '',
        team_id: route.query.team_id || '',
        search: route.query.search || '',
      });

      const querySalaries = ref({
        page: route.query.page || 1,
        order_by: 'start_date:' + order.value,
      });

      function getIndexScheduledSalaries(listId, orderBySalary, nameProperty) {
        loading.value = true;
        if (nameProperty == 'Planed At') {
          getAllSalariesByParams({
            employee_ids: listId,
            status: 'scheduled',
            page: querySalaries.value.page,
            order_by: 'start_date:' + orderBySalary,
          })
            .then(response => {
              salariesSchedule.value = response.data?.data;
              indexPagination.value = response?.data;
              colleagueIndex.value = salariesSchedule.value
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
        } else if (nameProperty == 'scheduleAmount') {
          getAllSalariesByParams({
            employee_ids: listId,
            status: 'scheduled',
            page: querySalaries.value.page,
            order_by: 'amount:' + orderBySalary,
          })
            .then(response => {
              salariesSchedule.value = response.data?.data;
              indexPagination.value = response?.data;
              colleagueIndex.value = salariesSchedule.value
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
          getAllSalariesByParams({
            employee_ids: listId,
            status: 'scheduled',
            page: querySalaries.value.page,
          })
            .then(response => {
              salariesSchedule.value = response.data?.data;
              indexPagination.value = response?.data;
              colleagueIndex.value = salariesSchedule.value
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

      const sortScheduleSalaryDate = query => {
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
            getIndexScheduledSalaries(dataListValue.value, order.value, 'Planed At');
          })
          .catch(error => {
            if (error) {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            }
          })
          .finally(() => (loading.value = false));
      };

      const sortScheduleSalary = query => {
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
            getIndexScheduledSalaries(dataListValue.value, order.value, 'scheduleAmount');
          })
          .catch(error => {
            if (error) {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            }
          })
          .finally(() => (loading.value = false));
      };

      const getColleagues = query => {
        loading.value = true;
        window.scrollTo(0, 0);
        getAllColleagues(query)
          .then(response => {
            colleagues.value = response?.data?.data;
            dataListValue.value = response?.data?.data?.map(item => item.id).join(',');
            getIndexScheduledSalaries(dataListValue.value, order.value);
          })
          .catch(error => {
            if (error) {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            }
          })
          .finally(() => (loading.value = false));
      };

      getColleagues(queryColleagues.value);

      const differenceDaysScheduleSalary = scheduleDateSalary =>
        differenceInDays(new Date(scheduleDateSalary), new Date());

      const selectOptions = (defaultTitle, options) => {
        return [{ title: defaultTitle, value: '' }, ...options];
      };

      watch(
        [queryColleagues.value, querySalaries.value],
        debounce(() => {
          routerReplace.setRouter([queryColleagues.value, querySalaries.value], {
            page: querySalaries.value.page,
          });
          getColleagues(queryColleagues.value);
        }, 500),
        { immediate: true }
      );

      return {
        route,
        routerReplace,
        queryColleagues,
        messagesTableHead,
        colleagueIndex,
        getIndexScheduledSalaries,
        getColleagues,
        getAllSalariesByParams,
        getAllColleagues,
        parseDate,
        loading,
        sortScheduleSalary,
        colleagues,
        indexPagination,
        dataListValue,
        salariesSchedule,
        differenceDaysScheduleSalary,
        loadingArray,
        selectOptions,
        querySalaries,
        order,
        positions: computed(() => store.getters['core/positions']),
        departments: computed(() => store.getters['core/departments']),
        teams: computed(() => store.getters['core/teams']),
      };
    },
  };
</script>

<style scoped></style>
