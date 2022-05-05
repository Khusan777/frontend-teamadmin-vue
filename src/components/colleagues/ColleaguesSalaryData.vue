<script setup>
  import { defineAsyncComponent, defineProps, ref } from 'vue';
  import useVuelidate from '@vuelidate/core';
  import { required } from '@vuelidate/validators';
  import { parseDate } from '~/utils/filters/dateFilters';
  import { $toast } from '~/main';
  import {
    showEmployeeIdSalary,
    storeScheduledSalary,
    editScheduledSalary,
    updateScheduledSalaryToActual,
    storeOfferSalary,
  } from '~/services/core/salaries.api';
  import { addOptions, getOptionsChartData, getOptionsData, getOptionsIndex } from '~/services/core/profile.api';
  import Chart from '~/components/chart/Chart';
  import { EyeOffIcon, XCircleIcon, CheckCircleIcon, PencilIcon } from '@heroicons/vue/solid';
  const props = defineProps({
    userId: [Number, String],
  });

  const AtModal = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtModal/AtModal'));
  const AtInput = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtInput/AtInput'));
  const AtPanel = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPanel/AtPanel'));
  const AtStats = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtStats/AtStats'));
  const AtButton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtButton/AtButton'));
  const AtAlert = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtAlert/AtAlert'));
  const AtTable = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTable/AtTable'));
  const AtPanelTitle = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPanelTitle/AtPanelTitle'));
  const AtDatepicker = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtDatepicker/AtDatepicker'));
  const AtPanelSubtitle = defineAsyncComponent(() =>
    import('~/plugins/aliftech-ui/components/AtPanelSubTitle/AtPanelSubTitle')
  );
  const AtTableItem = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTableItem/AtTableItem'));
  const AtSkeleton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton'));
  const StatsSkeleton = defineAsyncComponent(() => import('~/components/skeleton/StatsSkeleton'));
  const AtCheckbox = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtCheckbox/AtCheckbox'));
  const optionsCount = ref(null);
  const btnLoading = ref(false);
  const dateFromCrystallization = ref(new Date());
  const colleagueSalaries = ref({});
  const editDateScheduledSalaryToActual = ref(new Date());
  const ScheduleSalaryToActualModal = ref(false);
  const dateToCrystallization = ref(null);
  let modal = ref(false);
  let modalOfferSalary = ref(false);
  let modalScheduledSalary = ref(false);
  let editModalScheduledSalary = ref(false);
  const chartData = ref({});
  const stocks = ref({});
  const options = ref({});
  const hiddenScheduleSalary = ref(true);
  const sumScheduledSalary = ref(null);
  const dateScheduledSalary = ref(new Date());
  const sumOfferSalary = ref(null);
  const dateOfferSalary = ref(new Date());
  const checkScheduleSalaryToActual = ref(null);
  const noteOfferSalary = ref('');
  const scheduleSalary = ref(null);
  const labels = ref([]);
  const loading = ref(false);
  const salaryLoading = ref(false);

  const optionsFormRules = {
    optionsCount: { required },
    dateFromCrystallization: { required },
    dateToCrystallization: { required },
  };

  const v$ = useVuelidate(optionsFormRules, {
    optionsCount,
    dateFromCrystallization,
    dateToCrystallization,
  });

  const rulesScheduleSalaryForm = {
    sumScheduledSalary: { required },
    dateScheduledSalary: { required },
  };

  const scheduledSalaryValidation = useVuelidate(rulesScheduleSalaryForm, {
    sumScheduledSalary,
    dateScheduledSalary,
  });

  const rulesOfferSalaryForm = {
    sumOfferSalary: { required },
    dateOfferSalary: { required },
  };

  const offerSalaryValidation = useVuelidate(rulesOfferSalaryForm, {
    sumOfferSalary,
    dateOfferSalary,
  });

  const optionsHead = [
    { title: 'КОЛ-ВО' },
    { title: 'ЦЕНА ПО ИЗНАЧАЛЬНОЙ ЦЕНЕ' },
    { title: 'ЦЕНА ПО АКТУАЛЬНОЙ ЦЕНЕ' },
    { title: 'ДАТА НАЧИСЛЕНИЯ' },
    { title: 'ДАТА КРИСТАЛИЗАЦИИ' },
    { title: 'АКЦИЯ' },
  ];

  const fillData = () => {
    chartData.value = {
      lineData: {
        labels: labels.value,
        datasets: [
          {
            label: 'Опционы',
            borderColor: '#01BA59',
            pointBackgroundColor: 'white',
            lineTension: 0,
            backgroundColor: 'rgb(1, 186, 89, 0.2)',
            data: options.value,
          },
          {
            label: 'Акции',
            borderColor: '#00B8FF',
            pointBackgroundColor: 'white',
            backgroundColor: 'rgb(0, 184, 255, 0.2)',
            data: stocks.value,
            lineTension: 0,
          },
        ],
      },
    };
  };

  const optionsDataIndex = ref([]);
  const optionsData = ref([]);
  const actual = ref([]);
  const scheduled = ref([]);
  const archived = ref([]);
  const offerSalary = ref([]);
  const optionsTotalData = ref({});

  const getOptionIndex = () => {
    loading.value = true;
    getOptionsIndex(props.userId)
      .then(res => (optionsDataIndex.value = res.data?.options))
      .finally(() => {
        loading.value = false;
      });
  };
  getOptionIndex();

  const addOptionEmployee = () => {
    v$.value.$reset();
    if (v$.value.$invalid) {
      v$.value.$touch();
      return;
    } else {
      btnLoading.value = true;
      addOptions(props.userId, {
        'amount': Number(optionsCount.value),
        'accrual_date': parseDate(dateToCrystallization.value),
        'crystallization_date': parseDate(dateFromCrystallization.value),
      })
        .then(() => {
          $toast.show({
            title: 'Успешно',
            subTitle: 'Успешно начислено',
            type: 'success',
          });
        })
        .catch(error => {
          $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
        })
        .finally(() => {
          dateFromCrystallization.value = null;
          btnLoading.value = false;
          modal.value = false;
          getOptionIndex();
        });
    }
  };

  const addScheduledSalary = () => {
    scheduledSalaryValidation.value.$reset();
    if (scheduledSalaryValidation.value.$invalid) {
      scheduledSalaryValidation.value.$touch();
      return;
    } else {
      btnLoading.value = true;
      storeScheduledSalary(props.userId, {
        'amount': Number(sumScheduledSalary.value),
        'start_date': parseDate(dateScheduledSalary.value),
        'note': noteOfferSalary.value,
        'hidden': hiddenScheduleSalary.value,
      })
        .then(() => {
          $toast.show({
            title: 'Успешно',
            subTitle: 'Успешно отправлено',
            type: 'success',
          });
        })
        .catch(error => {
          $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
        })
        .finally(() => {
          btnLoading.value = false;
          modalScheduledSalary.value = false;
          getSalaries();
        });
    }
  };

  const addOfferSalary = () => {
    offerSalaryValidation.value.$reset();
    if (offerSalaryValidation.value.$invalid) {
      offerSalaryValidation.value.$touch();
      return;
    } else {
      btnLoading.value = true;
      storeOfferSalary(props.userId, {
        'amount': Number(sumOfferSalary.value),
        'start_date': parseDate(dateOfferSalary.value),
        'note': noteOfferSalary.value,
        'hidden': hiddenScheduleSalary.value,
      })
        .then(() => {
          $toast.show({
            title: 'Успешно',
            subTitle: 'Успешно отправлено',
            type: 'success',
          });
        })
        .catch(error => {
          $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
        })
        .finally(() => {
          btnLoading.value = false;
          sumOfferSalary.value = null;
          modalOfferSalary.value = false;
          getSalaries();
        });
    }
  };

  const sendScheduleSalaries = (sumScheduleSalary, dateScheduleSalary, noteOfferSalary, salaryId) => {
    btnLoading.value = true;
    editScheduledSalary(props.userId, salaryId, {
      'amount': Number(sumScheduleSalary),
      'start_date': parseDate(dateScheduleSalary),
      'note': noteOfferSalary.value,
      'hidden': hiddenScheduleSalary.value,
    })
      .then(() => {
        $toast.show({
          title: 'Успешно',
          subTitle: 'Успешно отправлено',
          type: 'success',
        });
        getSalaries();
      })
      .catch(error => {
        $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
      })
      .finally(() => {
        btnLoading.value = false;
        editModalScheduledSalary.value = false;
      });
  };

  const editScheduleSalaries = (sumScheduleSalary, dateScheduleSalary, noteScheduleSalary, salaryId) => {
    scheduleSalary.value = salaryId;
    sumScheduledSalary.value = sumScheduleSalary;
    dateScheduledSalary.value = dateScheduleSalary;
    noteOfferSalary.value = noteScheduleSalary;
    editModalScheduledSalary.value = true;
  };

  const getSalaries = () => {
    salaryLoading.value = true;
    showEmployeeIdSalary(props.userId)
      .then(
        res => (
          (scheduled.value = res?.data.salaries.scheduled),
          (actual.value = res?.data.salaries?.actual),
          (archived.value = res?.data.salaries?.archived),
          (offerSalary.value = res?.data.employee_offer_salaries),
          (colleagueSalaries.value = res?.data.salaries)
        )
      )
      .finally(() => {
        salaryLoading.value = false;
      });
  };

  getSalaries();

  const getOptions = () => {
    loading.value = true;
    getOptionsData(props.userId)
      .then(res => ((optionsData.value = res.data?.options), (optionsTotalData.value = res.data?.total_data)))
      .finally(() => {
        loading.value = false;
      });
  };

  getOptions();

  const getChartData = () => {
    getOptionsChartData(props.userId)
      .then(res => {
        stocks.value = res.data.stocks;
        options.value = res.data.options;
      })
      .finally(() => fillData());
  };

  getChartData();

  const sendScheduleSalaryToActual = salaries => {
    ScheduleSalaryToActualModal.value = true;
    checkScheduleSalaryToActual.value = salaries;
  };

  const ScheduleSalaryToActual = salaries => {
    btnLoading.value = true;
    updateScheduledSalaryToActual(props.userId, salaries.id, {
      'amount': Number(salaries.amount),
      'start_date': parseDate(editDateScheduledSalaryToActual.value),
    })
      .then(() => {
        $toast.show({
          title: 'Успешно',
          subTitle: 'Успешно отправлено',
          type: 'success',
        });
      })
      .catch(error => {
        $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
      })
      .finally(() => {
        ScheduleSalaryToActualModal.value = false;
        btnLoading.value = false;
        getSalaries();
      });
  };
</script>

<template>
  <div class="grid grid-cols-4 gap-4 mt-4 pb-8">
    <div class="md:col-span-2 grid-cols-2 col-span-4 sm:w-full">
      <AtPanel title="Оффер" border-header>
        <div v-if="salaryLoading">
          <div class="py-2" v-for="i in 5" :key="i">
            <at-skeleton type="row"></at-skeleton>
          </div>
        </div>
        <div v-else-if="offerSalary?.length">
          <div class="max-h-80 overflow-y-auto -mx-6">
            <div class="py-2" v-for="salaries in offerSalary" :key="salaries.id">
              <div class="flex py-1 justify-between px-4">
                <p class="mr-2">${{ salaries?.amount }}</p>
              </div>
              <p class="pb-4 text-gray-400 px-4 text-sm">
                {{ $filters.formatDateByDayMonthYear(salaries?.start_date) }} -
                {{ $filters.formatDistanceDate(salaries?.start_date) }}
              </p>
              <hr />
            </div>
          </div>
        </div>
        <div v-else>
          <at-alert>Нет данных</at-alert>
        </div>
        <template #footer>
          <div class="flex justify-end items-end">
            <AtButton color="primary" @click="modalOfferSalary = true">Добавить</AtButton>
          </div>
        </template>
      </AtPanel>
    </div>
    <div class="md:col-span-2 grid-cols-2 col-span-4 sm:w-full">
      <AtPanel title="Заработная плата" border-header>
        <div v-if="salaryLoading">
          <div class="py-2" v-for="i in 5" :key="i">
            <at-skeleton type="row"></at-skeleton>
          </div>
        </div>
        <div
          v-else-if="
            colleagueSalaries.actual?.length ||
            colleagueSalaries.archived?.length ||
            colleagueSalaries.scheduled?.length
          "
        >
          <div class="max-h-80 overflow-y-auto -mx-6">
            <div class="py-2" v-for="salaries in scheduled" :key="salaries.id">
              <div class="flex justify-between px-4">
                <div class="flex items-center">
                  <p class="mr-2">${{ salaries?.amount }}</p>
                  <p v-if="salaries.hidden == 1">
                    <eye-off-icon class="w-6 h-8 text-yellow-400"></eye-off-icon>
                  </p>
                </div>
                <div class="flex justify-end gap-x-2">
                  <check-circle-icon
                    @click="sendScheduleSalaryToActual(salaries)"
                    class="w-8 h-8 text-white bg-green-600 -mt-1 p-2 cursor-pointer hover:bg-opacity-70"
                  >
                  </check-circle-icon>
                  <pencil-icon
                    @click="editScheduleSalaries(salaries.amount, salaries.start_date, noteOfferSalary, salaries.id)"
                    class="w-8 h-8 text-white bg-blue-600 -mt-1 p-2 cursor-pointer hover:bg-opacity-70"
                  ></pencil-icon>
                </div>
              </div>
              <p class="pb-4 text-gray-400 px-4 pt-1 text-sm">
                {{ $filters.formatDateByDayMonthYear(salaries?.start_date) }} -
                {{ $filters.formatDistanceDate(salaries?.start_date) }}
              </p>
              <hr />
            </div>
            <div class="py-2" v-for="salaries in actual" :key="salaries.id">
              <div class="flex py-1 justify-between px-4">
                <p class="mr-2">${{ salaries?.amount }}</p>
                <p v-if="salaries.status == 'actual'" class="text-green-500">Текущая</p>
              </div>
              <p class="pb-4 text-gray-400 px-4 text-sm">
                {{ $filters.formatDateByDayMonthYear(salaries?.start_date) }} -
                {{ $filters.formatDistanceDate(salaries?.start_date) }}
              </p>
              <hr />
            </div>
            <div class="py-2" v-for="salaries in archived" :key="salaries.id">
              <div class="flex py-1 justify-between px-4">
                <p>${{ salaries?.amount }}</p>
              </div>
              <p class="pb-4 text-gray-400 px-4 text-sm">
                {{ $filters.formatDateByDayMonthYear(salaries?.start_date) }} -
                {{ $filters.formatDistanceDate(salaries?.start_date) }}
              </p>
              <hr />
            </div>
          </div>
        </div>
        <div v-else>
          <at-alert>Нет данных</at-alert>
        </div>
        <template #footer>
          <div class="flex justify-end items-end">
            <AtButton color="primary" @click="modalScheduledSalary = true">Добавить</AtButton>
          </div>
        </template>
      </AtPanel>
    </div>
  </div>
  <div class="flex justify-between items-end">
    <h1 class="text-xl font-bold">Опционы</h1>
    <AtButton color="primary" @click="modal = true">Начислить опцион</AtButton>
  </div>
  <div class="grid grid-cols-5 gap-4 pb-4 mt-6">
    <div class="md:col-span-3 col-span-5">
      <AtPanel title="Статистика опционов и акции" border-header>
        <Chart :styles="{ height: '19rem' }" :chart-data="chartData.lineData"></Chart>
      </AtPanel>
    </div>
    <div class="md:col-span-2 col-span-5 mb-2 mt-6 md:mt-0">
      <div v-if="loading">
        <div v-for="i in 4" :key="i">
          <stats-skeleton class="mb-1"></stats-skeleton>
        </div>
      </div>
      <div v-else class="rounded-none">
        <AtPanel>
          <div class="divide-y divide-solid -mx-6">
            <div class="px-4 py-1">
              <AtPanelTitle>{{ optionsTotalData.share_price_accrued + '$' }}</AtPanelTitle>
              <AtPanelSubtitle class="text-gray-500 pb-4">Изначальная цена опциона</AtPanelSubtitle>
            </div>
            <div class="px-4 py-2">
              <AtPanelTitle>{{ parseFloat(optionsTotalData.share_price_current).toFixed(2) + '$' }}</AtPanelTitle>
              <AtPanelSubtitle class="text-gray-500 pb-4">Актуальная цена опциона</AtPanelSubtitle>
            </div>
            <div class="px-4 py-2">
              <AtPanelTitle>{{ parseFloat(optionsTotalData.total_amount_of_options).toFixed(2) }}</AtPanelTitle>
              <AtPanelSubtitle class="text-gray-500 pb-4">Общее количество опциона</AtPanelSubtitle>
            </div>
            <div class="px-4 py-2">
              <AtPanelTitle>{{ parseFloat(optionsTotalData.total_amount_of_stocks).toFixed(2) }}</AtPanelTitle>
              <AtPanelSubtitle class="text-gray-500 pb-4">Общее количество акций</AtPanelSubtitle>
            </div>
          </div>
        </AtPanel>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-4 gap-4" v-if="loading">
    <div v-for="i in 4" :key="i" class="md:col-span-2 col-span-4">
      <stats-skeleton class="mb-1"></stats-skeleton>
    </div>
  </div>
  <div v-else class="grid grid-cols-4 gap-4 pb-4 font-medium text-black">
    <AtStats
      title="Сумма опционов по изначальной цене"
      class="md:col-span-2 col-span-4 font-medium text-black"
      :value="parseFloat(optionsTotalData.total_summa_of_options_at_accrued_price).toFixed(2) + '$'"
    >
    </AtStats>
    <AtStats
      title="Сумма опционов по актуальной цене"
      class="md:col-span-2 col-span-4 font-medium text-black"
      :value="parseFloat(optionsTotalData.total_summa_of_options_at_current_price).toFixed(2) + '$'"
    >
    </AtStats>
    <AtStats
      title="Сумма акций по изначальной цене"
      class="md:col-span-2 col-span-4 font-medium text-black"
      :value="parseFloat(optionsTotalData.total_summa_of_stocks_at_accrued_price).toFixed(2) + '$'"
    >
    </AtStats>
    <AtStats
      title="Сумма акций по актуальной цене"
      class="md:col-span-2 col-span-4 font-medium text-black"
      :value="parseFloat(optionsTotalData.total_summa_of_stocks_at_current_price).toFixed(2) + '$'"
    >
    </AtStats>
  </div>
  <div class="pb-4 mt-4">
    <at-panel>
      <at-panel-title class="mb-4">
        Опционы и акции <span class="text-gray-400 text-base">(Все цены указаны приблизительно)</span>
      </at-panel-title>
      <div class="-mb-2" v-if="loading">
        <div v-for="i in 10" :key="i">
          <at-skeleton class="mb-2"></at-skeleton>
        </div>
      </div>
      <div v-else-if="!optionsDataIndex?.length">
        <at-alert>Нет данных</at-alert>
      </div>
      <div v-else>
        <at-table style="max-height: 26rem" :head="optionsHead" :elements="optionsDataIndex">
          <template #element="{ element }">
            <at-table-item>{{ element.amount }}</at-table-item>
            <at-table-item> {{ parseFloat(element?.summa_at_accrued_price).toFixed(2) }}$ </at-table-item>
            <at-table-item> {{ parseFloat(element?.summa_at_current_price).toFixed(2) }}$ </at-table-item>
            <at-table-item>{{ element.accrual_date }}</at-table-item>
            <at-table-item>{{ element.crystallization_date }}</at-table-item>
            <div v-if="element.status === 'crystallized'">
              <at-table-item>
                <check-circle-icon class="w-6 h-6 text-green-500"></check-circle-icon>
              </at-table-item>
            </div>
            <div v-else>
              <at-table-item><x-circle-icon class="w-6 h-6 text-gray-400"></x-circle-icon></at-table-item>
            </div>
          </template>
        </at-table>
      </div>
    </at-panel>
  </div>

  <AtModal v-model="modal" :title="'Начислить опцион сотруднику'">
    <div class="mt-2">
      <AtInput label="Количество" :error="v$.optionsCount.$error" v-model="optionsCount" />
      <p class="text-red-500" v-if="v$.optionsCount.$error">Поле обязательно для заполнения</p>
      <AtDatepicker
        label="Дата начисления опциона"
        :error="v$.dateToCrystallization.$error"
        v-model="dateToCrystallization"
      />
      <p class="text-red-500" v-if="v$.dateToCrystallization.$error">Поле обязательно для заполнения</p>
      <AtDatepicker
        label="Дата кристализации опциона"
        v-model="dateFromCrystallization"
        :error="v$.dateFromCrystallization.$error"
      />
      <p class="text-red-500" v-if="v$.dateFromCrystallization.$error">Поле обязательно для заполнения</p>
      <div class="flex space-x-3 mt-3">
        <AtButton class="w-full p-4" @click="modal = false">Закрыть</AtButton>
        <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="addOptionEmployee">
          Добавить
        </AtButton>
      </div>
    </div>
  </AtModal>

  <AtModal v-model="modalScheduledSalary" :title="'Создать запланированную зарплату'">
    <div class="mt-2">
      <AtInput
        label="Сумма"
        :error="scheduledSalaryValidation.sumScheduledSalary.$error"
        v-model="sumScheduledSalary"
      />
      <p class="text-red-500" v-if="scheduledSalaryValidation.sumScheduledSalary.$error">
        Поле обязательно для заполнения
      </p>
      <AtDatepicker
        label="Дата назначения ЗП"
        :error="scheduledSalaryValidation.dateScheduledSalary.$error"
        v-model="dateScheduledSalary"
      />
      <p class="text-red-500" v-if="scheduledSalaryValidation.dateScheduledSalary.$error">
        Поле обязательно для заполнения
      </p>
      <AtInput label="Note" v-model="noteOfferSalary" />
      <div class="mt-2">
        <AtCheckbox label="Скрыть" v-model="hiddenScheduleSalary" />
      </div>
      <div class="flex space-x-3 mt-3">
        <AtButton class="w-full p-4" @click="modalScheduledSalary = false">Закрыть</AtButton>
        <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="addScheduledSalary">
          Добавить
        </AtButton>
      </div>
    </div>
  </AtModal>

  <AtModal v-model="editModalScheduledSalary" :title="'Редактировать'">
    <div class="mt-2">
      <AtInput
        label="Сумма"
        :error="scheduledSalaryValidation.sumScheduledSalary.$error"
        v-model="sumScheduledSalary"
      />
      <p class="text-red-500" v-if="scheduledSalaryValidation.sumScheduledSalary.$error">
        Поле обязательно для заполнения
      </p>
      <AtDatepicker
        label="Дата назначения ЗП"
        :error="scheduledSalaryValidation.dateScheduledSalary.$error"
        v-model="dateScheduledSalary"
      />
      <p class="text-red-500" v-if="scheduledSalaryValidation.dateScheduledSalary.$error">
        Поле обязательно для заполнения
      </p>
      <AtInput label="Note" v-model="noteOfferSalary" />
      <div class="mt-2">
        <AtCheckbox label="Скрыть" v-model="hiddenScheduleSalary" />
      </div>
      <div class="flex space-x-3 mt-3">
        <AtButton class="w-full p-4" @click="editModalScheduledSalary = false">Отмена</AtButton>
        <AtButton
          class="w-full p-4"
          color="primary"
          :loading="btnLoading"
          @click="sendScheduleSalaries(sumScheduledSalary, dateScheduledSalary, noteOfferSalary, scheduleSalary)"
        >
          Сохранить
        </AtButton>
      </div>
    </div>
  </AtModal>

  <AtModal v-model="modalOfferSalary" :title="'Создать оффер сотруднику'">
    <div class="mt-2">
      <AtInput label="Сумма" :error="offerSalaryValidation.sumOfferSalary.$error" v-model="sumOfferSalary" />
      <p class="text-red-500" v-if="offerSalaryValidation.sumOfferSalary.$error">Поле обязательно для заполнения</p>
      <AtDatepicker
        label="Дата назначения оффера"
        :error="offerSalaryValidation.dateOfferSalary.$error"
        v-model="dateOfferSalary"
      />
      <p class="text-red-500" v-if="offerSalaryValidation.dateOfferSalary.$error">Поле обязательно для заполнения</p>
      <AtInput label="Note" v-model="noteOfferSalary" />
      <div class="flex space-x-3 mt-3">
        <AtButton class="w-full p-4" @click="modalOfferSalary = false">Отмена</AtButton>
        <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="addOfferSalary">Сохранить</AtButton>
      </div>
    </div>
  </AtModal>

  <AtModal v-model="ScheduleSalaryToActualModal" :title="'Перевод зарплаты'">
    <div class="mt-2 flex justify-center items-center">
      <p class="text-yellow-500 text-center text-lg">
        Вы точно хотите перевести запланированную зарплату в актуальную?
      </p>
    </div>
    <div class="flex space-x-3 mt-3">
      <AtButton class="w-full p-4" @click="ScheduleSalaryToActualModal = false">Закрыть</AtButton>
      <AtButton
        class="w-full p-4"
        color="primary"
        :loading="btnLoading"
        @click="ScheduleSalaryToActual(checkScheduleSalaryToActual)"
        >Отправить</AtButton
      >
    </div>
  </AtModal>
</template>
