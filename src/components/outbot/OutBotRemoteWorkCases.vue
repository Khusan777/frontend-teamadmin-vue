<template>
  <div class="grid grid-cols-9 items-end gap-x-4 gap-y-6 mb-6">
    <div class="col-span-9">
      <div class="mt-6" v-if="loading">
        <div class="mt-2">
          <at-skeleton type="row" class="mb-2 p-5"></at-skeleton>
        </div>
        <AtTable class="max-h-96 overflow-y-auto" :elements="loadingArray">
          <template #element>
            <at-table-item>
              <at-skeleton type="row"></at-skeleton>
            </at-table-item>
          </template>
        </AtTable>
      </div>
      <div v-else>
        <div class="mt-2 mb-8 flex gap-x-8">
          <AtDatepicker label="Дата от" v-model="dateFrom" />
          <AtDatepicker label="Дата до" v-model="dateTo" />
        </div>
        <at-table :head="messagesTableHead" :elements="outBotData">
          <template #element="{ element, index }">
            <at-table-item>
              <p>{{ index + 1 }}</p>
            </at-table-item>
            <at-table-item
              :to="{
                name: 'colleagues.detail',
                params: { id: element?.employee_id },
                query: { tab: 'profile' },
              }"
            >
              <p class="text-black whitespace-nowrap">
                {{ element?.employee_name || '-' }}
              </p>
            </at-table-item>
            <at-table-item
              :to="{
                name: 'colleagues.detail',
                params: { id: element?.employee_id },
                query: { tab: 'profile' },
              }"
            >
              <at-badge color="yellow" rounded>Удалённо работает</at-badge>
            </at-table-item>
            <at-table-item
              :to="{
                name: 'colleagues.detail',
                params: { id: element?.employee_id },
                query: { tab: 'profile' },
              }"
            >
              {{ element?.note || '-' }}
            </at-table-item>
            <at-table-item
              :to="{
                name: 'colleagues.detail',
                params: { id: element?.employee_id },
                query: { tab: 'profile' },
              }"
            >
              <p class="text-gray-500 whitespace-nowrap">
                {{ formatDateByDayMonthYear(element?.created_at) || '-' }}
              </p>
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
            <div v-if="!outBotData.length" class="text-center my-5">
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
      v-model="query.page"
      :total="indexPagination?.meta?.last_page"
    ></at-pagination>
  </div>
</template>

<script>
  import AtPagination from '~/plugins/aliftech-ui/components/AtPagination/AtPagination';
  import AtDatepicker from '~/plugins/aliftech-ui/components/AtDatepicker/AtDatepicker';
  import AtTable from '~/plugins/aliftech-ui/components/AtTable/AtTable';
  import AtTableItem from '~/plugins/aliftech-ui/components/AtTableItem/AtTableItem';
  import AtSkeleton from '~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton';
  import AtBadge from '~/plugins/aliftech-ui/components/AtBadge/AtBadge';
  import { formatDateByDayMonthYear, parseDate } from '~/utils/filters/dateFilters';
  import { debounce } from '~/plugins/aliftech-ui/utils';
  import { useRoute } from 'vue-router';
  import useRouterReplace from '~/utils/hooks/useRouterReplace';
  import { ref, watch } from 'vue';
  import { $toast } from '~/main';
  import { getRemoteWorkCasesMessages } from "~/services/core/outbotMessages";

  export default {
    name: 'OutBotRemoteWorkCases',
    components: {
      AtBadge,
      AtPagination,
      AtTable,
      AtTableItem,
      AtSkeleton,
      AtDatepicker,
    },
    setup() {
      const messagesTableHead = [{ title: '#' }, { title: 'ИМЯ' }, { title: '' }, { title: 'СООБЩЕНИЕ' }];

      const indexPagination = ref({});
      const dateFrom = ref(new Date());
      const dateTo = ref(new Date());
      const outBotData = ref([]);
      const loading = ref(false);
      const route = useRoute();
      const routerReplace = useRouterReplace();
      const loadingArray = ref(Array(15).fill(1));
      const query = ref({
        page: route.query.page || 1,
        per_page: 15,
      });
      const colleagueRemoteWorkCasesMessage = () => {
        if (dateTo.value < dateFrom.value) {
          $toast.show({ title: 'Ошибка', subTitle: 'Date From должен быть меньше от Date To', type: 'error' });
          return;
        } else {
          loading.value = true;
          getRemoteWorkCasesMessages({
            ...query.value,
            date_from: parseDate(dateFrom.value) || '',
            date_to: parseDate(dateTo.value) || '',
          })
            .then(response => {
              outBotData.value = response?.data.data;
              indexPagination.value = response?.data;
            })
            .catch(error => {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            })
            .finally(() => (loading.value = false));
        }
      };

      colleagueRemoteWorkCasesMessage();

      watch(
        [query.value, dateFrom, dateTo],
        debounce(() => {
          routerReplace.setRouter([query.value], {
            page: query.value.page,
          });
          colleagueRemoteWorkCasesMessage(query.value);
        }, 500),
        { immediate: true }
      );

      return {
        route,
        indexPagination,
        colleagueRemoteWorkCasesMessage,
        outBotData,
        loading,
        routerReplace,
        query,
        messagesTableHead,
        loadingArray,
        formatDateByDayMonthYear,
        dateFrom,
        dateTo,
      };
    },
  };
</script>

<style scoped></style>
