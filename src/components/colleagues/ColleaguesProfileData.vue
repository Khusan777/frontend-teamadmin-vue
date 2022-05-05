<template>
  <div class="mt-4 grid grid-cols-12 gap-4 py-6">
    <div class="lg:col-span-4 col-span-12 gap-4">
      <img
        v-img-loader
        :src="getUserImage(userId)"
        @error="getUserImage(userId, $event)"
        class="object-cover h-80 w-full"
        :alt="colleagueData?.name"
      />
    </div>
    <div class="lg:col-span-8 col-span-12 gap-4">
      <AtPanel title="Информация">
        <div v-if="loading">
          <div class="py-2" v-for="i in 6" :key="i">
            <at-skeleton type="row"></at-skeleton>
          </div>
        </div>
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-2" v-else>
          <div>
            <p class="text-gray-400">Номер</p>
            <p>{{ phoneTransformation(colleagueData?.phone) || '-' }}</p>
          </div>
          <div>
            <p class="text-gray-400">Почта</p>
            <p>{{ colleagueData?.email || '-' }}</p>
          </div>
          <div>
            <p class="text-gray-400">День рождения</p>
            <p>
              {{ formatDateToLocaleString(colleagueData?.birth_date) || '-' }} -
              {{ formatDistanceBirthDay(colleagueData?.birth_date) }}
            </p>
          </div>
          <div>
            <p class="text-gray-400">Адрес</p>
            <p>{{ colleagueData?.address || '-' }}</p>
          </div>
        </div>
      </AtPanel>
    </div>
    <div class="lg:col-span-4 col-span-12 gap-4">
      <AtPanel title="Отпуски" border-header>
        <div class="lg:col-span-2 col-span-5 gap-4" v-if="loading">
          <div class="py-2" v-for="i in 7" :key="i">
            <at-skeleton type="row"></at-skeleton>
          </div>
        </div>
        <div class="divide-solid divide-gray-200 divide-y max-h-96 overflow-y-auto -mx-6" v-else-if="vacation?.length">
          <div class="max-h-80 overflow-y-auto">
            <div class="py-1" v-for="vacations in vacation" :key="vacations?.id">
              <div class="flex justify-between px-4">
                <p class="text-gray-400 pb-1">{{ vacations?.type }}</p>
                <p
                  v-if="
                    parseDateFormat(vacations?.date_from) < parseDateFormat(new Date()) &&
                    parseDateFormat(vacations?.date_to) > parseDateFormat(new Date())
                  "
                  class="text-green-500"
                >
                  Актуальный
                </p>
              </div>
              <p class="pb-4 px-4 text-sm">
                {{ parseDateFormat(vacations?.date_from) }} -
                {{ parseDateFormat(vacations?.date_to) }}
              </p>
              <hr />
            </div>
          </div>
        </div>
        <div v-else>
          <at-alert>Нет данных</at-alert>
        </div>
        <template #footer>
          <div class="flex justify-end">
            <AtButton @click="modalAddVacation = true" color="primary">Добавить</AtButton>
          </div>
        </template>
      </AtPanel>
    </div>
    <div class="lg:col-span-8 col-span-12 gap-4">
      <AtPanel title="График работы">
        <div v-if="loading">
          <AtTable class="max-h-96 -mt-5 overflow-y-auto -mx-6" :head="messagesTableHead" :elements="loadingArray">
            <template #element>
              <div v-for="i in 10" :key="i">
                <at-table-item>
                  <at-skeleton type="row"></at-skeleton>
                </at-table-item>
              </div>
            </template>
          </AtTable>
        </div>
        <div v-else-if="loading == false">
          <AtTable
            class="-mt-5 max-h-96 -mx-6 overflow-y-auto"
            :head="messagesTableHead"
            :elements="employeeScheduleWork"
          >
            <template #element="{ element, index }">
              <at-table-item class="max-w-md">
                <p class="text-black whitespace-nowrap">
                  {{ weekDays[index] }}
                </p>
              </at-table-item>
              <at-table-item class="max-w-md">
                <p class="whitespace-nowrap">
                  {{ element?.from || '-' }}
                </p>
              </at-table-item>
              <at-table-item class="max-w-md">
                {{ element?.to || '-' }}
              </at-table-item>
              <at-table-item>
                <pencil-icon
                  @click="(editModalWork = true), (weekDayScheduleWork = weekDays[index])"
                  class="w-8 h-8 text-white bg-blue-600 mt-1 p-2 cursor-pointer hover:bg-opacity-70"
                ></pencil-icon>
              </at-table-item>
            </template>
            <template #footer>
              <div v-if="!employeeScheduleWork?.length" class="text-center my-5">
                <p>Нет данных</p>
              </div>
            </template>
          </AtTable>
        </div>
      </AtPanel>
    </div>
    <div class="lg:col-span-4 col-span-12 gap-4">
      <AtPanel title="Доп. выходние дни">
        <div v-if="loading">
          <div class="py-2" v-for="i in 6" :key="i">
            <at-skeleton type="row"></at-skeleton>
          </div>
        </div>
        <div v-else-if="!additionalDayOffs.length">
          <at-alert>Нет данных</at-alert>
        </div>
        <div class="divide-solid divide-gray-200 divide-y max-h-96 overflow-y-auto -mx-6" v-else>
          <div class="max-h-80 overflow-y-auto">
            <div class="py-1" v-for="dayOffs in additionalDayOffs" :key="dayOffs?.id">
              <div class="flex justify-between px-4 pt-2">
                <p>{{ dayOffs?.reason || '-' }}</p>
              </div>
              <p class="text-gray-400 text-sm px-4 pb-4">{{ parseDateFormat(dayOffs?.date) }}</p>
              <hr />
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end">
            <AtButton @click="modalExtraDayoffs = true" color="primary">Назначить</AtButton>
          </div>
        </template>
      </AtPanel>
    </div>
    <div class="lg:col-span-8 col-span-12 gap-4">
      <AtPanel title="Команды">
        <div v-if="loading">
          <div class="py-2" v-for="i in 6" :key="i">
            <at-skeleton type="row"></at-skeleton>
          </div>
        </div>
        <div v-else-if="!team.length">
          <at-alert>Нет данных</at-alert>
        </div>
        <div class="divide-solid divide-gray-200 divide-y max-h-96 overflow-y-auto -mx-6" v-else>
          <div class="max-h-80 overflow-y-auto">
            <div v-for="teamName in team" :key="teamName?.id">
              <div class="flex items-center justify-between px-5 pt-3">
                <at-badge :color="statuses[teamName?.id]?.color">{{ teamName?.name || '-' }}</at-badge>
                <p class="items-center">{{ teamName?.manager?.manager_name || '-' }}</p>
              </div>
              <p class="px-5 pb-3">{{ formatDateToLocaleString(teamName?.created_at || '-') }}</p>
              <hr />
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end">
            <AtButton @click="modalAddTeam = true" color="primary">Добавить</AtButton>
          </div>
        </template>
      </AtPanel>
    </div>
  </div>

  <AtModal v-model="modalExtraDayoffs" :title="'Назначить Доп. Выходние дни'">
    <div class="mt-2">
      <AtDatepicker label="Дата" :error="extraDayOffsValidation.dateExtraDayOffs.$error" v-model="dateExtraDayOffs" />
      <p class="text-red-500" v-if="extraDayOffsValidation.dateExtraDayOffs.$error">Поле обязательно для заполнения</p>
      <AtInput label="Причина" v-model="reason" :error="extraDayOffsValidation.reason.$error" />
      <p class="text-red-500" v-if="extraDayOffsValidation.reason.$error">Поле обязательно для заполнения</p>
      <AtCheckbox class="pt-2" label="Used" v-model="usedExtraDayOffs" />
      <div class="flex space-x-3 mt-3">
        <AtButton class="w-full p-4" @click="modalExtraDayoffs = false">Закрыть</AtButton>
        <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="addExtraDayOffs()">
          Добавить
        </AtButton>
      </div>
    </div>
  </AtModal>

  <AtModal v-model="modalAddTeam" :title="'Добавить к Команде'">
    <div class="mt-2">
      <AtSelect
        label="Команды"
        placeholder="Выберите команду"
        :options="teams"
        :error="teamAddEmployeeValidation.teamsList.$error"
        v-model="teamsList"
      />
      <p class="text-red-500" v-if="teamAddEmployeeValidation.teamsList.$error">Поле обязательно для заполнения</p>
      <div class="flex space-x-3 mt-3">
        <AtButton class="w-full p-4" @click="modalAddTeam = false">Закрыть</AtButton>
        <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="addTeamColleague()">
          Добавить
        </AtButton>
      </div>
    </div>
  </AtModal>

  <AtModal v-model="modalAddVacation" :title="'Назначить отпуск'">
    <div class="mt-2">
      <AtSelect
        placeholder="Выберите значение"
        :options="selectOptions('Выберите значение', vacationTypes)"
        v-model="vacationTypeValue"
      ></AtSelect>
      <p class="text-red-500" v-if="vacationAddEmployeeValidation.vacationTypeValue.$error">
        Поле обязательно для заполнения
      </p>
      <AtDatepicker
        label="Дата от"
        :error="vacationAddEmployeeValidation.dateToVacation.$error"
        v-model="dateFromVacation"
      />
      <p class="text-red-500" v-if="vacationAddEmployeeValidation.dateFromVacation.$error">
        Поле обязательно для заполнения
      </p>
      <AtDatepicker
        label="Дата до"
        :error="vacationAddEmployeeValidation.dateToVacation.$error"
        v-model="dateToVacation"
      />
      <p class="text-red-500" v-if="vacationAddEmployeeValidation.dateToVacation.$error">
        Поле обязательно для заполнения
      </p>
      <div class="flex space-x-3 mt-3">
        <AtButton class="w-full p-4" @click="modalAddVacation = false">Закрыть</AtButton>
        <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="addVacationColleague()">
          Добавить
        </AtButton>
      </div>
    </div>
  </AtModal>

  <AtModal v-model="editModalWork" :title="'Обновить график работы сотрудника'">
    <div class="mt-2">
      <AtInput
        placeholder="hh:mm"
        mask="##:##"
        label="Время начало рабочего дня"
        :error="editTimeWorkValidation.timeWorkStart.$error"
        :masked="true"
        v-model="timeWorkStart"
      />
      <p class="text-red-500" v-if="editTimeWorkValidation.timeWorkStart.$error">Поле обязательно для заполнения</p>
      <AtDatepicker
        label="Дата "
        :allowedDates="[new Date(), addWeeks(new Date(), 1)]"
        :error="editTimeWorkValidation.timeWorkStartDate.$error"
        v-model="timeWorkStartDate"
      />
      <p class="text-red-500" v-if="editTimeWorkValidation.timeWorkStartDate.$error">Поле обязательно для заполнения</p>
      <AtInput
        placeholder="hh:mm"
        mask="##:##"
        :masked="true"
        label="Время завершение рабочего дня"
        :error="editTimeWorkValidation.timeWorkEnd.$error"
        v-model="timeWorkEnd"
      />
      <p class="text-red-500" v-if="editTimeWorkValidation.timeWorkEnd.$error">Поле обязательно для заполнения</p>
      <div class="flex space-x-3 mt-3">
        <AtButton class="w-full p-4" @click="editModalWork = false">Закрыть</AtButton>
        <AtButton
          class="w-full p-4"
          color="primary"
          :loading="btnLoading"
          @click="editScheduleWork(weekDayScheduleWork)"
        >
          Добавить
        </AtButton>
      </div>
    </div>
  </AtModal>
</template>

<script>
  import AtPanel from '~/plugins/aliftech-ui/components/AtPanel/AtPanel';
  import AtInput from '~/plugins/aliftech-ui/components/AtInput/AtInput';
  import AtTable from '~/plugins/aliftech-ui/components/AtTable/AtTable';
  import AtTableItem from '~/plugins/aliftech-ui/components/AtTableItem/AtTableItem';
  import { formatDateToLocaleString } from '~/utils/parsers';
  import AtModal from '~/plugins/aliftech-ui/components/AtModal/AtModal';
  import AtDatepicker from '~/plugins/aliftech-ui/components/AtDatepicker/AtDatepicker';
  import AtButton from '~/plugins/aliftech-ui/components/AtButton/AtButton';
  import AtSkeleton from '~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton';
  import AtAlert from '~/plugins/aliftech-ui/components/AtAlert/AtAlert';
  import AtCheckbox from '~/plugins/aliftech-ui/components/AtCheckbox/AtCheckbox';
  import AtBadge from '~/plugins/aliftech-ui/components/AtBadge/AtBadge';
  import AtSelect from '~/plugins/aliftech-ui/components/AtSelect/AtSelect';
  import useUserAvatar from '~/utils/hooks/useUserAvatar';
  import { $toast } from '~/main';
  import { addEmployeeTeams, getEmployeeData } from '~/services/core/employee.api';
  import { parseDate, parseDateFormat } from '~/utils/filters/dateFilters';
  import { computed, ref } from 'vue';
  import { addDays, formatDistanceStrict } from 'date-fns';
  import { ru } from 'date-fns/locale';
  import { required } from '@vuelidate/validators';
  import addWeeks from 'date-fns/addWeeks';
  import useVuelidate from '@vuelidate/core';
  import { addEmployeeExtraDayOff, addEmployeeVacations } from '~/services/core/colleagues.api';
  import { PencilIcon } from '@heroicons/vue/solid';
  import store from '~/store';
  import { getScheduleWork, editEmployeeScheduleTimeWork } from '~/services/core/profile.api';

  export default {
    name: 'ColleaguesDetail',
    components: {
      AtDatepicker,
      AtInput,
      AtAlert,
      AtTable,
      AtBadge,
      AtTableItem,
      AtPanel,
      AtButton,
      AtSkeleton,
      AtModal,
      AtCheckbox,
      PencilIcon,
      AtSelect,
    },
    props: {
      userId: [Number, String],
    },
    setup(props) {
      const userAvatar = useUserAvatar();
      const loading = ref(false);
      const colleagueData = ref(null);
      const vacation = ref(null);
      const team = ref([]);
      const employeeSchedules = ref(null);
      const additionalDayOffs = ref(null);
      const btnLoading = ref(false);
      const teamsList = ref([]);
      const modalExtraDayoffs = ref(false);
      const modalAddTeam = ref(false);
      const dateExtraDayOffs = ref(new Date());
      const reason = ref(null);
      const usedExtraDayOffs = ref(true);
      const modalAddVacation = ref(false);
      const employeeScheduleWork = ref([]);
      const loadingArray = ref(Array(10).fill(1));
      const teams = store.getters['core/teams'];
      const statuses = store.getters['core/status'];
      const vacationTypeValue = ref('');
      const dateFromVacation = ref(new Date());
      const dateToVacation = ref(addDays(new Date(), 10));
      const editModalWork = ref(false);
      const timeWorkStart = ref('');
      const timeWorkEnd = ref('');
      const timeWorkStartDate = ref(new Date());
      const weekDayScheduleWork = ref('');
      const weekDays = ref([]);

      const rules = {
        dateExtraDayOffs: { required },
        reason: { required },
      };

      const rules1 = {
        teamsList: { required },
      };

      const rules2 = {
        dateFromVacation: { required },
        dateToVacation: { required },
        vacationTypeValue: { required },
      };

      const rules3 = {
        timeWorkStart: { required },
        timeWorkEnd: { required },
        timeWorkStartDate: { required },
      };

      const extraDayOffsValidation = useVuelidate(rules, {
        dateExtraDayOffs,
        reason,
      });

      const teamAddEmployeeValidation = useVuelidate(rules1, {
        teamsList,
      });

      const vacationAddEmployeeValidation = useVuelidate(rules2, {
        vacationTypeValue,
        dateFromVacation,
        dateToVacation,
      });

      const editTimeWorkValidation = useVuelidate(rules3, {
        timeWorkStart,
        timeWorkEnd,
        timeWorkStartDate,
      });

      const messagesTableHead = [
        { title: 'ДЕНЬ НЕДЕЛИ' },
        { title: 'НАЧАЛО РАБОТЫ' },
        { title: 'КОНЕЦ РАБОТЫ' },
        { title: '' },
      ];

      const getColleagueProfileData = async () => {
        loading.value = true;
        await getEmployeeData(props.userId)
          .then(response => {
            colleagueData.value = response?.data.data;
            team.value = response?.data.data?.teams;
            vacation.value = response?.data.data?.vacations;
            additionalDayOffs.value = response?.data.data?.additional_day_offs;
          })
          .catch(error => {
            if (error) {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            }
          })
          .finally(() => (loading.value = false));
      };

      const formatDistanceBirthDay = colleague => {
        const date_now = new Date();
        const birth_date = new Date(colleague);
        birth_date.setFullYear(date_now.getFullYear());
        if (birth_date.getTime() < date_now.getTime()) {
          birth_date.setFullYear(date_now.getFullYear() + 1);
        }
        return formatDistanceStrict(birth_date, date_now, {
          locale: ru,
          addSuffix: true,
          roundingMethod: 'floor',
          unit: 'day',
        });
      };

      const addExtraDayOffs = () => {
        extraDayOffsValidation.value.$reset();
        if (extraDayOffsValidation.value.$invalid) {
          extraDayOffsValidation.value.$touch();
          return;
        } else {
          btnLoading.value = true;
          addEmployeeExtraDayOff(props.userId, {
            'date': parseDate(dateExtraDayOffs.value),
            'reason': reason.value,
            'used': usedExtraDayOffs.value,
          })
            .then(() => {
              $toast.show({
                title: 'Успешно',
                subTitle: 'Успешно отправлено',
                type: 'success',
              });
              getColleagueProfileData();
            })
            .catch(error => {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            })
            .finally(() => {
              btnLoading.value = false;
              modalExtraDayoffs.value = false;
            });
        }
      };

      const addVacationColleague = () => {
        vacationAddEmployeeValidation.value.$reset();
        if (vacationAddEmployeeValidation.value.$invalid) {
          vacationAddEmployeeValidation.value.$touch();
          return;
        } else {
          btnLoading.value = true;
          addEmployeeVacations({
            'employee_id': props.userId,
            'date_from': parseDate(dateFromVacation.value),
            'date_to': parseDate(dateToVacation.value),
            'type_id': vacationTypeValue.value,
          })
            .then(() => {
              $toast.show({
                title: 'Успешно',
                subTitle: 'Успешно отправлено',
                type: 'success',
              });
              getColleagueProfileData();
            })
            .catch(error => {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            })
            .finally(() => {
              btnLoading.value = false;
              modalAddVacation.value = false;
            });
        }
      };

      const colleagueScheduleWork = async () => {
        await getScheduleWork(props.userId)
          .then(response => {
            weekDays.value = Object.keys(response?.data);
            employeeScheduleWork.value = Object.values(response?.data);
          })
          .catch(error => {
            $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
          })
          .finally(() => {
            btnLoading.value = false;
          });
      };

      colleagueScheduleWork();

      const editScheduleWork = async weekDay => {
        editTimeWorkValidation.value.$reset();
        if (editTimeWorkValidation.value.$invalid) {
          editTimeWorkValidation.value.$touch();
          return;
        } else {
          btnLoading.value = true;
          await editEmployeeScheduleTimeWork({
            'employee_id': props.userId,
            'week_day': String(weekDay),
            'start_date': parseDate(timeWorkStartDate.value),
            'from': String(timeWorkStart.value),
            'to': String(timeWorkEnd.value),
          })
            .then(() => {
              $toast.show({
                title: 'Успешно',
                subTitle: 'Успешно отправлено',
                type: 'success',
              });
              colleagueScheduleWork();
            })
            .catch(error => {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            })
            .finally(() => {
              btnLoading.value = false;
              editModalWork.value = false;
            });
        }
      };

      const addTeamColleague = () => {
        teamAddEmployeeValidation.value.$reset();
        if (teamAddEmployeeValidation.value.$invalid) {
          teamAddEmployeeValidation.value.$touch();
          return;
        } else {
          btnLoading.value = true;
          addEmployeeTeams(props.userId, {
            'team_id': teamsList.value,
          })
            .then(() => {
              $toast.show({
                title: 'Успешно',
                subTitle: 'Успешно отправлено',
                type: 'success',
              });
              getColleagueProfileData();
            })
            .catch(error => {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            })
            .finally(() => {
              btnLoading.value = false;
              modalAddTeam.value = false;
            });
        }
      };

      const phoneTransformation = phone => {
        if (!phone) {
          return '-';
        } else {
          const countryCode = phone.substring(0, 3);
          const code = phone.substring(3, 5);
          const number1 = phone.substring(5, 8);
          const number2 = phone.substring(8, 10);
          const number3 = phone.substring(10, 12);
          return `+${countryCode} ${code} ${number1} ${number2} ${number3}`;
        }
      };

      getColleagueProfileData();

      const selectOptions = (defaultTitle, options) => {
        return [{ title: defaultTitle, value: '' }, ...options];
      };

      return {
        loading,
        props,
        modalExtraDayoffs,
        btnLoading,
        additionalDayOffs,
        employeeScheduleWork,
        formatDateToLocaleString,
        addExtraDayOffs,
        dateExtraDayOffs,
        usedExtraDayOffs,
        colleagueData,
        messagesTableHead,
        employeeSchedules,
        reason,
        parseDateFormat,
        vacation,
        formatDistanceBirthDay,
        userAvatar,
        modalAddTeam,
        loadingArray,
        team,
        addTeamColleague,
        teams,
        extraDayOffsValidation,
        getUserImage: userAvatar.getUserImage,
        phoneTransformation,
        addVacationColleague,
        colleagueScheduleWork,
        vacationTypeValue,
        editScheduleWork,
        editTimeWorkValidation,
        timeWorkStart,
        timeWorkEnd,
        timeWorkStartDate,
        teamsList,
        teamAddEmployeeValidation,
        statuses,
        modalAddVacation,
        dateFromVacation,
        editModalWork,
        addWeeks,
        dateToVacation,
        weekDays,
        weekDayScheduleWork,
        vacationAddEmployeeValidation,
        vacationTypes: computed(() => store.getters['core/vacation_types']),
        selectOptions,
      };
    },
  };
</script>

<style scoped></style>
