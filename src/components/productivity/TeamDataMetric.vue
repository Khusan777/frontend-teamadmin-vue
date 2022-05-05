<template>
  <div class="grid grid-cols-9 items-end gap-x-4 gap-y-6 mb-6">
    <div class="sm:col-span-3 col-span-9">
      <at-input placeholder="Поиск по ФИО" iconAfter="search" v-model="query.search" />
    </div>
    <div class="sm:col-span-2 col-span-9">
      <at-select
        :options="selectOptions('Все отделы', departments)"
        v-model="query.department_id"
        placeholder="Выберите отдел"
      >
      </at-select>
    </div>
    <div class="sm:col-span-2 col-span-9">
      <at-select :options="selectOptions('Все команды', teams)" v-model="query.team_id" placeholder="Выберите команду">
      </at-select>
    </div>
    <div class="sm:col-span-2 col-span-9">
      <AtSelect
        :options="[
          { title: 'weekly', value: 'weekly' },
          { title: 'monthly', value: 'monthly' },
        ]"
        :model-value="period"
        @update:model-value="changePeriodMetrics"
      ></AtSelect>
    </div>
    <div class="col-span-9">
      <div v-if="loading">
        <at-skeleton type="row" class="mb-2 p-5"></at-skeleton>
        <AtTable class="max-h-96 overflow-y-auto" :elements="loadingArray">
          <template #element>
            <at-table-item>
              <at-skeleton type="row"></at-skeleton>
            </at-table-item>
          </template>
        </AtTable>
      </div>
      <div v-else>
        <div v-if="indexMetric?.length" class="col-span-9 mb-6">
          <at-alert type="info">
            <span class="text-blue-400 text-sm">Результаты с</span>
            <span class="text-blue-800 text-md">{{ ' ' + formatDateByDayMonthYear(showFilterFromDate()) || '-' }}</span>
            <span class="text-blue-400 text-sm"> по</span>
            <span class="text-blue-800 text-md">{{ ' ' + formatDateByDayMonthYear(showFilterToDate()) || '-' }}</span>
          </at-alert>
        </div>
        <at-table :head="messagesTableHead" :elements="indexMetric">
          <template #element="{ element }">
            <at-table-item>
              <p class="-mt-3 mb-2 text-yellow-800">В рабочее время</p>
              <p class="text-black whitespace-nowrap mb-2">
                {{ element?.name || '-' }}
              </p>
              <p class="text-yellow-800">В не рабочее время</p>
            </at-table-item>
            <at-table-item>
              <gitlab-metric
                :current_gitlab_events_count="element?.current?.working_days?.gitlab?.events_count"
                :previous_gitlab_events_count="element?.previous?.working_days?.gitlab?.events_count"
              ></gitlab-metric>
              <div class="mt-3">
                <gitlab-metric-non-working
                  :current_gitlab_events_count="element?.current?.non_working_days?.gitlab?.events_count"
                  :previous_gitlab_events_count="element?.previous?.non_working_days?.gitlab?.events_count"
                ></gitlab-metric-non-working>
              </div>
            </at-table-item>
            <at-table-item>
              <linear-solved
                :current_linear_issues_solved_count="element?.current?.working_days?.linear?.issues_solved_count"
                :previous_linear_issues_solved_count="element?.previous?.working_days?.linear?.issues_solved_count"
              ></linear-solved>
              <div class="mt-3">
                <linear-solved-non-working
                  :current_linear_issues_solved_count="element?.current?.non_working_days?.linear?.issues_solved_count"
                  :previous_linear_issues_solved_count="
                    element?.previous?.non_working_days?.linear?.issues_solved_count
                  "
                ></linear-solved-non-working>
              </div>
            </at-table-item>
            <at-table-item>
              <linear-created
                :current_linear_issues_created_count="element?.current?.working_days?.linear?.issues_created_count"
                :previous_linear_issues_created_count="element?.previous?.working_days?.linear?.issues_created_count"
              ></linear-created>
              <div class="mt-3">
                <linear-created-non-working
                  :current_linear_issues_created_count="
                    element?.current?.non_working_days?.linear?.issues_created_count
                  "
                  :previous_linear_issues_created_count="
                    element?.previous?.non_working_days?.linear?.issues_created_count
                  "
                ></linear-created-non-working>
              </div>
            </at-table-item>
            <at-table-item>
              <linear-bug
                :current_linear_bug_created_count="element?.current?.working_days?.linear?.bug_created_count"
                :previous_linear_bug_created_count="element?.previous?.working_days?.linear?.bug_created_count"
              ></linear-bug>
              <div class="mt-3">
                <linear-bug-non-working
                  :current_linear_bug_created_count="element?.current?.non_working_days?.linear?.bug_created_count"
                  :previous_linear_bug_created_count="element?.previous?.non_working_days?.linear?.bug_created_count"
                ></linear-bug-non-working>
              </div>
            </at-table-item>
            <at-table-item>
              <linear-backend
                :current_backend_created_count="element?.current?.working_days?.linear?.backend_created_count"
                :previous_backend_created_count="element?.previous?.working_days?.linear?.backend_created_count"
              ></linear-backend>
              <div class="mt-3">
                <linear-backend-non-working
                  :current_backend_created_count="element?.current?.non_working_days?.linear?.backend_created_count"
                  :previous_backend_created_count="element?.previous?.non_working_days?.linear?.backend_created_count"
                ></linear-backend-non-working>
              </div>
            </at-table-item>
            <at-table-item>
              <linear-frontend
                :current_fontend_created_count="element?.current?.working_days?.linear?.frontend_created_count"
                :previous_fontend_created_count="element?.previous?.working_days?.linear?.frontend_created_count"
              ></linear-frontend>
              <div class="mt-3">
                <linear-frontend-non-working
                  :current_fontend_created_count="element?.current?.non_working_days?.linear?.frontend_created_count"
                  :previous_fontend_created_count="element?.previous?.non_working_days?.linear?.frontend_created_count"
                ></linear-frontend-non-working>
              </div>
            </at-table-item>
            <at-table-item>
              <linear-mobile
                :current_mobile_created_count="element?.current?.working_days?.linear?.mobile_created_count"
                :previous_mobile_created_count="element?.previous?.working_days?.linear?.mobile_created_count"
              ></linear-mobile>
              <div class="mt-3">
                <linear-mobile-non-working
                  :current_mobile_created_count="element?.current?.non_working_days?.linear?.mobile_created_count"
                  :previous_mobile_created_count="element?.previous?.non_working_days?.linear?.mobile_created_count"
                ></linear-mobile-non-working>
              </div>
            </at-table-item>
            <at-table-item>
              <wifi-metric
                :current_wifi_late_minutes="element?.current?.working_days?.wifi?.late_minutes"
                :previous_wifi_late_minute="element?.previous?.working_days?.wifi?.late_minutes"
              ></wifi-metric>
              <div class="mt-3">
                <wifi-metric-non-working
                  :current_wifi_late_minutes="element?.current?.non_working_days?.wifi?.late_minutes"
                  :previous_wifi_late_minute="element?.previous?.non_working_days?.wifi?.late_minutes"
                ></wifi-metric-non-working>
              </div>
            </at-table-item>
            <at-table-item>
              <office-metric
                :current_office_activity_minutes="element?.current?.working_days?.wifi?.office_activity_minutes"
                :previous_office_activity_minutes="element?.previous?.working_days?.wifi?.office_activity_minutes"
              ></office-metric>
              <div class="mt-3">
                <office-metric-non-working
                  :current_office_activity_minutes="element?.current?.non_working_days?.wifi?.office_activity_minutes"
                  :previous_office_activity_minutes="element?.previous?.non_working_days?.wifi?.office_activity_minutes"
                ></office-metric-non-working>
              </div>
            </at-table-item>
          </template>
          <template #footer>
            <div v-if="!indexMetric.length" class="text-center my-5">
              <p>Пусто</p>
            </div>
          </template>
        </at-table>
      </div>
    </div>
  </div>
</template>
<script>
  import AtTable from '~/plugins/aliftech-ui/components/AtTable/AtTable';
  import AtTableItem from '~/plugins/aliftech-ui/components/AtTableItem/AtTableItem';
  import AtSkeleton from '~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton';
  import AtSelect from '~/plugins/aliftech-ui/components/AtSelect/AtSelect';
  import AtAlert from '~/plugins/aliftech-ui/components/AtAlert/AtAlert';
  import AtInput from '~/plugins/aliftech-ui/components/AtInput/AtInput';
  import { formatDateByDayMonthYear } from '~/utils/filters/dateFilters';
  import { debounce } from '~/plugins/aliftech-ui/utils';
  import { useStore } from 'vuex';
  import { useRoute } from 'vue-router';
  import useRouterReplace from '~/utils/hooks/useRouterReplace';
  import { computed, ref, watch } from 'vue';
  import LinearSolved from '~/components/productivity/working-days/LinearSolvedMetric';
  import LinearSolvedNonWorking from '~/components/productivity/non-working-days/LinearSolvedMetric';
  import LinearCreated from '~/components/productivity/working-days/LinearCreatedMetric';
  import LinearCreatedNonWorking from '~/components/productivity/non-working-days/LinearCreatedMetric';
  import GitlabMetric from '~/components/productivity/working-days/GitlabMetric';
  import GitlabMetricNonWorking from '~/components/productivity/non-working-days/GitlabMetric';
  import WifiMetric from '~/components/productivity/working-days/WifiMetric';
  import WifiMetricNonWorking from '~/components/productivity/non-working-days/WifiMetric';
  import OfficeMetric from '~/components/productivity/working-days/OfficeMetric';
  import OfficeMetricNonWorking from '~/components/productivity/non-working-days/OfficeMetric';
  import LinearBug from '~/components/productivity/working-days/LinearBugCount';
  import LinearBugNonWorking from '~/components/productivity/non-working-days/LinearBugCount';
  import LinearBackend from '~/components/productivity/working-days/LinearBackend';
  import LinearBackendNonWorking from '~/components/productivity/non-working-days/LinearBackend';
  import LinearFrontend from '~/components/productivity/working-days/LinearBackend';
  import LinearFrontendNonWorking from '~/components/productivity/working-days/LinearFrontend';
  import LinearMobile from '~/components/productivity/working-days/LinearMobile';
  import LinearMobileNonWorking from '~/components/productivity/working-days/LinearMobile';
  import { $toast } from '~/main';
  import { allTeamsMonthlyProductivity, allTeamsWeeklyProductivity } from '~/services/core/productivity.api';

  export default {
    name: 'TeamDataMetric',
    components: {
      LinearSolvedNonWorking,
      LinearCreatedNonWorking,
      GitlabMetricNonWorking,
      WifiMetricNonWorking,
      OfficeMetricNonWorking,
      LinearBugNonWorking,
      LinearBackendNonWorking,
      LinearMobileNonWorking,
      LinearFrontendNonWorking,
      OfficeMetric,
      WifiMetric,
      GitlabMetric,
      LinearSolved,
      LinearCreated,
      LinearBug,
      LinearBackend,
      AtAlert,
      LinearFrontend,
      LinearMobile,
      AtTable,
      AtTableItem,
      AtSkeleton,
      AtSelect,
      AtInput,
    },
    setup() {
      const messagesTableHead = [
        { title: 'ФИО' },
        { title: 'GITLAB' },
        { title: 'LINEAR ЗАДАЧ СОЗДАНО' },
        { title: 'LINEAR ЗАДАЧ РЕШЕНО' },
        { title: 'BUG' },
        { title: 'BACKEND' },
        { title: 'FRONTEND' },
        { title: 'MOBILE' },
        { title: 'WiFi подключение' },
        { title: 'Активность в офисе' },
      ];

      const store = useStore();
      const route = useRoute();
      const loading = ref(true);
      const indexMetric = ref([]);
      const routerReplace = useRouterReplace();
      const loadingArray = ref(Array(15).fill(1));
      const period = ref('monthly');
      const query = ref({
        search: route.query.search || '',
        department_id: route.query.department_id || '',
        team_id: route.query.team_id || '',
      });

      const getTeamsMonthlyMetric = () => {
        loading.value = true;
        allTeamsMonthlyProductivity(query.value)
          .then(response => {
            indexMetric.value = response?.data.data;
          })
          .catch(error => {
            if (error) {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            }
          })
          .finally(() => (loading.value = false));
      };

      const getTeamsWeeklyMetric = () => {
        loading.value = true;
        allTeamsWeeklyProductivity(query.value)
          .then(response => {
            indexMetric.value = response?.data.data;
          })
          .catch(error => {
            if (error) {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            }
          })
          .finally(() => (loading.value = false));
      };

      getTeamsMonthlyMetric();

      watch(
        query.value,
        debounce(() => {
          routerReplace.setRouter(query, {
            page: 1,
          });
          getTeamsMonthlyMetric(query.value);
        }, 500),
        { immediate: true }
      );

      const changePeriodMetrics = value => {
        period.value = value;
        if (period.value == 'weekly') {
          getTeamsWeeklyMetric(query.value);
        } else {
          getTeamsMonthlyMetric(query.value);
        }
      };

      const selectOptions = (defaultTitle, options) => {
        return [{ title: defaultTitle, value: '' }, ...options];
      };

      const showFilterFromDate = () => {
        for (let dateFromFilter of indexMetric.value) {
          return dateFromFilter?.from;
        }
      };

      const showFilterToDate = () => {
        for (let dateFromFilter of indexMetric.value) {
          return dateFromFilter?.to;
        }
      };

      return {
        changePeriodMetrics,
        store,
        route,
        indexMetric,
        routerReplace,
        query,
        messagesTableHead,
        getTeamsMonthlyMetric,
        getTeamsWeeklyMetric,
        formatDateByDayMonthYear,
        loadingArray,
        showFilterFromDate,
        showFilterToDate,
        selectOptions,
        loading,
        period,
        positions: computed(() => store.getters['core/positions']),
        departments: computed(() => store.getters['core/departments']),
        teams: computed(() => store.getters['core/teams']),
      };
    },
  };
</script>

<style scoped></style>
