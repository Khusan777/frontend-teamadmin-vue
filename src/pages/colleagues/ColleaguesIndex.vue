<template>
  <div class="-m-6 mb-4">
    <div class="w-full bg-alpha">
      <div class="flex items-center justify-between p-4 border-b md:flex-row flex-grow flex-col whitespace-nowrap">
        <h1 class="text-2xl font-bold px-3">Сотрудники</h1>
        <AtButton @click="modalAddEmployee = true" color="primary">Добавить сотрудника</AtButton>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-4 items-end gap-x-4 gap-y-6 mb-6">
    <colleagues-list></colleagues-list>
  </div>

  <AtModal size="lg" v-model="modalAddEmployee" :title="'Создать нового сотрудника'">
    <div class="grid grid-cols-2 gap-x-8 xl:grid-cols-2 mt-2">
      <div>
        <AtInput
          placeholder="FIO"
          label="ФИО сотрудника"
          :error="addEmployeeValidation.fioEmployee.$error"
          v-model="fioEmployee"
        />
        <p class="text-red-500" v-if="addEmployeeValidation.fioEmployee.$error">Поле обязательно для заполнения</p>
      </div>
      <div>
        <AtInput
          placeholder="Почта"
          label="Email"
          :error="addEmployeeValidation.emailEmployee.$error"
          v-model="emailEmployee"
        />
        <p class="text-red-500" v-if="addEmployeeValidation.emailEmployee.$error">Поле обязательно для заполнения</p>
      </div>
      <div>
        <AtInput
          placeholder="998902348568"
          label="Номер телефона"
          :error="addEmployeeValidation.phoneEmployee.$error"
          v-model="phoneEmployee"
        />
        <p class="text-red-500" v-if="addEmployeeValidation.phoneEmployee.$error">Поле обязательно для заполнения</p>
      </div>
      <div>
        <AtDatepicker
          label="Дата рождения"
          v-model="dateOfBirthEmployee"
          :allowed-dates="{ from: new Date(+0), to: new Date() }"
        />
        <p class="text-red-500" v-if="addEmployeeValidation.dateOfBirthEmployee.$error">
          Поле обязательно для заполнения
        </p>
      </div>
      <div>
        <at-select
          label="Позиция"
          :options="selectOptions('', positions)"
          v-model="position_id"
          placeholder="Выберите позиции"
        ></at-select>
        <p class="text-red-500" v-if="addEmployeeValidation.position_id.$error">Поле обязательно для заполнения</p>
      </div>
      <div>
        <at-select
          label="Отдел"
          :options="selectOptions('', departments)"
          v-model="department_id"
          placeholder="Выберите отдел"
        ></at-select>
        <p class="text-red-500" v-if="addEmployeeValidation.department_id.$error">Поле обязательно для заполнения</p>
      </div>
      <div>
        <at-select
          label="Градация"
          :options="selectOptions('', gradations)"
          v-model="gradation_id"
          placeholder="Выберите градацию"
        ></at-select>
        <p class="text-red-500" v-if="addEmployeeValidation.gradation_id.$error">Поле обязательно для заполнения</p>
      </div>
      <div>
        <at-select
          label="Города"
          :options="selectOptions('', cities)"
          v-model="city_id"
          placeholder="Выберите город"
        ></at-select>
        <p class="text-red-500" v-if="addEmployeeValidation.city_id.$error">Поле обязательно для заполнения</p>
      </div>
      <div>
        <at-select
          label="Команда"
          :options="selectOptions('', teams)"
          v-model="team_id"
          placeholder="Выберите команду"
        ></at-select>
        <p class="text-red-500" v-if="addEmployeeValidation.team_id.$error">Поле обязательно для заполнения</p>
      </div>
      <div>
        <AtDatepicker label="С какого числа на этой позиции" v-model="startDatePosition"></AtDatepicker>
        <p class="text-red-500" v-if="addEmployeeValidation.startDatePosition.$error">
          Поле обязательно для заполнения
        </p>
      </div>
      <div>
        <AtDatepicker label="Дата начала исп. срока" v-model="startDateProbation"></AtDatepicker>
        <p class="text-red-500" v-if="addEmployeeValidation.startDateProbation.$error">
          Поле обязательно для заполнения
        </p>
      </div>
      <div>
        <AtDatepicker label="Дата окончания исп. срока" v-model="endDateProbation"></AtDatepicker>
        <p class="text-red-500" v-if="addEmployeeValidation.endDateProbation.$error">Поле обязательно для заполнения</p>
      </div>
      <div class="mt-4">
        <AtCheckbox label="Full Time" v-model="timeWork" />
        <p class="text-red-500" v-if="addEmployeeValidation.timeWork.$error">Поле обязательно для заполнения</p>
      </div>
    </div>
    <div class="flex space-x-3 mt-3">
      <AtButton class="w-full p-4" @click="modalAddEmployee = false">Закрыть</AtButton>
      <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="addNewEmployee"> Добавить </AtButton>
    </div>
  </AtModal>
</template>

<script>
  import { computed, defineAsyncComponent, ref } from 'vue';
  import store from '~/store';
  import { email, required } from '@vuelidate/validators';
  import useVuelidate from '@vuelidate/core';
  import addMonths from 'date-fns/addMonths';
  import { parseDate } from '~/utils/filters/dateFilters';
  import { $toast } from '~/main';
  import { addEmployee } from '~/services/core/employee.api';

  export default {
    name: 'ColleaguesIndex',
    components: {
      AtDatepicker: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtDatepicker/AtDatepicker')),
      AtButton: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtButton/AtButton')),
      AtSelect: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSelect/AtSelect')),
      AtModal: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtModal/AtModal')),
      AtInput: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtInput/AtInput')),
      AtCheckbox: defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtCheckbox/AtCheckbox')),
      ColleaguesList: defineAsyncComponent(() => import('~/components/colleagues/ColleaguesList')),
    },
    setup() {
      const fioEmployee = ref('');
      const emailEmployee = ref('');
      const phoneEmployee = ref('');
      const dateOfBirthEmployee = ref(null);
      const position_id = ref(null);
      const gradation_id = ref(null);
      const department_id = ref(null);
      const city_id = ref(null);
      const team_id = ref(null);
      const startDatePosition = ref(new Date());
      const endDateProbation = ref(addMonths(new Date(), 3));
      const startDateProbation = ref(new Date());
      const timeWork = ref(false);
      const btnLoading = ref(false);
      const addNewEmployee = () => {
        addEmployeeValidation.value.$reset();
        if (addEmployeeValidation.value.$invalid) {
          addEmployeeValidation.value.$touch();
          return;
        } else {
          btnLoading.value = true;
          addEmployee({
            'name': fioEmployee.value,
            'birth_date': parseDate(dateOfBirthEmployee.value),
            'email': emailEmployee.value,
            'phone': phoneEmployee.value,
            'position_id': position_id.value,
            'department_id': department_id.value,
            'career_start_date': parseDate(startDatePosition.value),
            'team_id': team_id.value,
            'city_id': city_id.value,
            'probation_period_from': parseDate(startDateProbation.value),
            'probation_period_to': parseDate(endDateProbation.value),
            'gradation_id': gradation_id.value,
          })
            .then(() => {
              $toast.show({
                title: 'Успешно',
                subTitle: 'Успешно сохранено',
                type: 'success',
              });
            })
            .catch(error => {
              $toast.show({ title: 'Error', subTitle: error?.data?.message, type: 'error' });
            })
            .finally(() => {
              btnLoading.value = false;
              modalAddEmployee.value = false;
            });
        }
      };

      const rules = {
        fioEmployee: { required },
        emailEmployee: { required, email },
        phoneEmployee: { required },
        department_id: { required },
        dateOfBirthEmployee: { required },
        position_id: { required },
        gradation_id: { required },
        city_id: { required },
        team_id: { required },
        startDatePosition: { required },
        endDateProbation: { required },
        timeWork: { required },
        startDateProbation: { required },
      };

      const addEmployeeValidation = useVuelidate(rules, {
        fioEmployee,
        department_id,
        emailEmployee,
        phoneEmployee,
        dateOfBirthEmployee,
        position_id,
        gradation_id,
        city_id,
        team_id,
        startDatePosition,
        endDateProbation,
        timeWork,
        startDateProbation,
      });
      const modalAddEmployee = ref(false);

      const selectOptions = (defaultTitle, options) => {
        return [{ title: defaultTitle, value: '' }, ...options];
      };
      return {
        addMonths,
        fioEmployee,
        emailEmployee,
        phoneEmployee,
        dateOfBirthEmployee,
        position_id,
        gradation_id,
        department_id,
        city_id,
        team_id,
        startDateProbation,
        timeWork,
        endDateProbation,
        startDatePosition,
        rules,
        addEmployeeValidation,
        modalAddEmployee,
        btnLoading,
        addNewEmployee,
        positions: computed(() => store.getters['core/positions']),
        departments: computed(() => store.getters['core/departments']),
        teams: computed(() => store.getters['core/teams']),
        cities: computed(() => store.getters['core/cities']),
        gradations: computed(() => store.getters['core/gradations']),
        selectOptions,
      };
    },
  };
</script>

<style scoped></style>
