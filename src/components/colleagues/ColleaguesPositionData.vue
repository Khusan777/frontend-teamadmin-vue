<template>
  <div class="mt-4 grid grid-cols-6 gap-4 py-4">
    <div class="sm:col-span-3 col-span-6">
      <AtPanel title="Позиция сотрудника" borderHeader>
        <div v-if="loading">
          <div class="py-2" v-for="i in 6" :key="i">
            <at-skeleton type="row"></at-skeleton>
          </div>
        </div>
        <div
          v-else-if="colleaguePosition?.length"
          class="divide-solid divide-gray-200 divide-y max-h-96 overflow-y-auto -mx-6"
        >
          <div class="py-2" v-for="position in colleaguePosition" :key="position?.id">
            <div class="flex justify-between items-center py-1 px-6">
              <p>{{ position?.position_name || '-' }}</p>
              <p class="text-green-400" v-if="position?.current">Текущая</p>
            </div>
            <div class="flex gap-x-1 text-gray-400 px-6">
              <p>{{ $filters.formatDateByDayMonthYear(position?.position_start_at) + ' - ' }}</p>
              <p class="text-black">{{ formatDistanceDate(position?.position_start_at) || '-' }}</p>
              <div class="flex flex-grow justify-end gap-y-2 items-end">
                <AtButton @click="(modalAddProbationPosition = true), (positionId = position?.id)" color="secondary"
                  >Добавить исп. срок</AtButton
                >
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <at-alert>Нет данных</at-alert>
        </div>
        <template #footer>
          <div class="flex justify-end gap-x-2 items-end">
            <AtButton color="primary" @click="modalAddPosition = true">Добавить</AtButton>
          </div>
        </template>
      </AtPanel>
    </div>
    <div class="sm:col-span-3 col-span-6">
      <AtPanel title="Испытательный срок" border-header>
        <div v-if="loading">
          <div class="py-2" v-for="i in 6" :key="i">
            <at-skeleton type="row"></at-skeleton>
          </div>
        </div>
        <div class="py-2 px-4" v-else-if="!colleaguePosition?.length">
          <at-alert>Нет данных</at-alert>
        </div>
        <div
          class="py-2 max-h-96 overflow-y-auto -mx-6"
          v-for="probationPosition in colleaguePosition"
          :key="probationPosition?.id"
        >
          <div class="px-4" v-if="probationPosition.probation_period">
            <div class="flex justify-between gap-x-4 items-center">
              <p>{{ probationPosition?.position_name || '-' }}</p>
              <p v-if="probationPosition?.probation_period?.completed" class="text-green-400">Пройдено</p>
              <div class="flex flex-grow justify-end gap-x-2">
                <div v-if="!probationPosition?.probation_period?.completed">
                  <at-button
                    @click="
                      (completeModalProbationPosition = true),
                        (probationId = probationPosition?.probation_period.id),
                        (positionName = probationPosition?.position_name)
                    "
                    color="success"
                    icon="checkCircle"
                  ></at-button>
                </div>
                <at-button
                  @click="(editModalProbationPosition = true), (probationId = probationPosition?.probation_period.id)"
                  color="primary"
                  icon="pencil"
                ></at-button>
                <at-button
                  @click="
                    (deleteModalProbationPosition = true),
                      (positionName = probationPosition?.position_name),
                      (probationId = probationPosition?.probation_period.id)
                  "
                  color="danger"
                  icon="trash"
                ></at-button>
              </div>
            </div>
            <div class="flex gap-x-1 gap-y-1 text-gray-400">
              <p>c {{ parseDate(probationPosition?.probation_period.from_date) }}</p>
              <div>
                <div class="flex gap-x-1 text-gray-400">
                  <p>по {{ parseDate(probationPosition?.probation_period.to_date) + ' - ' }}</p>
                  <p class="text-black">{{ formatDistanceDate(probationPosition?.probation_period.to_date) || '-' }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="py-2 px-4" v-else-if="!probationPosition?.probation_period">
            <at-alert>Нет данных</at-alert>
          </div>
        </div>
      </AtPanel>
    </div>
  </div>

  <AtModal v-model="modalAddPosition" :title="'Добавить позицию'">
    <at-select
      label="Позиция"
      :options="selectOptions('', positions)"
      v-model="positionId"
      placeholder="Выберите позиции"
    ></at-select>
    <p class="text-red-500" v-if="addPositionValidation.positionId.$error">Поле обязательно для заполнения</p>
    <at-select
      label="Позиция"
      :options="selectOptions('', gradations)"
      v-model="gradationId"
      placeholder="Выберите градации"
    ></at-select>
    <p class="text-red-500" v-if="addPositionValidation.gradationId.$error">Поле обязательно для заполнения</p>
    <AtDatepicker label="Дата начала исп. срока" v-model="startDatePosition"></AtDatepicker>
    <p class="text-red-500" v-if="addPositionValidation.startDatePosition.$error">Поле обязательно для заполнения</p>
    <div class="flex space-x-3 mt-3">
      <AtButton class="w-full p-4" @click="modalAddPosition = false">Закрыть</AtButton>
      <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="addPosition()">Отправить</AtButton>
    </div>
  </AtModal>

  <AtModal v-model="modalAddProbationPosition" :title="'Добавить испатательный срок'">
    <AtDatepicker label="Дата начала исп. срока" v-model="startDateProbationPosition"></AtDatepicker>
    <p class="text-red-500" v-if="addProbationPositionValidation.startDateProbationPosition.$error">
      Поле обязательно для заполнения
    </p>
    <AtDatepicker label="Дата завершения исп. срока" v-model="endDateProbationPosition"></AtDatepicker>
    <p class="text-red-500" v-if="addProbationPositionValidation.endDateProbationPosition.$error">
      Поле обязательно для заполнения
    </p>
    <div class="flex space-x-3 mt-3">
      <AtButton class="w-full p-4" @click="modalAddProbationPosition = false">Закрыть</AtButton>
      <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="addProbationPosition()"
        >Отправить</AtButton
      >
    </div>
  </AtModal>

  <AtModal v-model="editModalProbationPosition" :title="'Изменить испатательный срок'">
    <AtDatepicker label="Дата начала исп. срока" v-model="startDateProbationPosition"></AtDatepicker>
    <p class="text-red-500" v-if="editProbationPositionValidation.startDateProbationPosition.$error">
      Поле обязательно для заполнения
    </p>
    <AtDatepicker label="Дата завершения исп. срока" v-model="endDateProbationPosition"></AtDatepicker>
    <p class="text-red-500" v-if="editProbationPositionValidation.endDateProbationPosition.$error">
      Поле обязательно для заполнения
    </p>
    <div class="flex space-x-3 mt-3">
      <AtButton class="w-full p-4" @click="editModalProbationPosition = false">Закрыть</AtButton>
      <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="editProbationPosition()"
        >Отправить</AtButton
      >
    </div>
  </AtModal>

  <AtModal v-model="deleteModalProbationPosition" :title="'Удалить испатательный срок'">
    <div class="mt-2 flex justify-center items-center">
      <p class="text-yellow-500 text-center text-lg">
        Вы точно хотите удалить позицию <span class="text-black">{{ positionName }}?</span>
      </p>
    </div>
    <div class="flex space-x-3 mt-3">
      <AtButton class="w-full p-4" @click="deleteModalProbationPosition = false">Закрыть</AtButton>
      <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="deleteProbationPosition()"
        >Удалить</AtButton
      >
    </div>
  </AtModal>

  <AtModal v-model="completeModalProbationPosition" :title="'Завершить испытательный срок'">
    <div class="mt-2 flex justify-center items-center">
      <p class="text-yellow-500 text-center text-lg">
        Вы точно хотите перенести в актуальную позицию <span class="text-black"> {{ positionName }}?</span>
      </p>
    </div>
    <div class="flex space-x-3 mt-3">
      <AtButton class="w-full p-4" @click="completeModalProbationPosition = false">Закрыть</AtButton>
      <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="completeProbationPosition()"
        >Сохранить</AtButton
      >
    </div>
  </AtModal>
</template>

<script>
  import AtPanel from '~/plugins/aliftech-ui/components/AtPanel/AtPanel';
  import AtSkeleton from '~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton';
  import AtAlert from '~/plugins/aliftech-ui/components/AtAlert/AtAlert';
  import AtButton from '~/plugins/aliftech-ui/components/AtButton/AtButton';
  import AtSelect from '~/plugins/aliftech-ui/components/AtSelect/AtSelect';
  import AtModal from '~/plugins/aliftech-ui/components/AtModal/AtModal';
  import AtDatepicker from '~/plugins/aliftech-ui/components/AtDatepicker/AtDatepicker';
  import { parseDate, formatDistanceDate } from '~/utils/filters/dateFilters';
  import { computed, ref } from 'vue';
  import { $toast } from '~/main';
  import {
    addEmployeePosition,
    addEmployeeProbationPosition,
    completeEmployeeProbationPosition,
    deleteEmployeeProbationPosition,
    editEmployeeProbationPosition,
    getEmployeePosition,
  } from '~/services/core/employee.api';
  import store from '~/store';
  import useVuelidate from '@vuelidate/core';
  import { required } from '@vuelidate/validators';
  import { useRoute } from 'vue-router';
  import addMonths from 'date-fns/addMonths';
  export default {
    name: 'ColleaguesPositionData',
    components: {
      AtAlert,
      AtPanel,
      AtDatepicker,
      AtSkeleton,
      AtButton,
      AtModal,
      AtSelect,
    },
    props: {
      userId: [Number, String],
    },
    setup(props) {
      const loading = ref(false);
      const modalAddPosition = ref(false);
      const modalAddProbationPosition = ref(false);
      const editModalProbationPosition = ref(false);
      const deleteModalProbationPosition = ref(false);
      const positionName = ref('');
      const probationId = ref(Number);
      const colleaguePosition = ref([]);
      const completeModalProbationPosition = ref(false);
      const btnLoading = ref(false);
      const startDatePosition = ref(new Date());
      const startDateProbationPosition = ref(new Date());
      const endDateProbationPosition = ref(addMonths(new Date(), 3));
      const route = useRoute();
      const positionId = ref(null);
      const gradationId = ref(null);

      const rulesAddPosition = {
        positionId: { required },
        gradationId: { required },
        startDatePosition: { required },
      };
      const addPositionValidation = useVuelidate(rulesAddPosition, {
        positionId,
        gradationId,
        startDatePosition,
      });

      const rulesAddProbationPosition = {
        startDateProbationPosition: { required },
        endDateProbationPosition: { required },
      };
      const addProbationPositionValidation = useVuelidate(rulesAddProbationPosition, {
        startDateProbationPosition,
        endDateProbationPosition,
      });

      const rulesEditProbationPosition = {
        startDateProbationPosition: { required },
        endDateProbationPosition: { required },
      };
      const editProbationPositionValidation = useVuelidate(rulesEditProbationPosition, {
        startDateProbationPosition,
        endDateProbationPosition,
      });

      const addPosition = () => {
        addPositionValidation.value.$reset();
        if (addPositionValidation.value.$invalid) {
          addPositionValidation.value.$touch();
          return;
        } else {
          btnLoading.value = true;
          addEmployeePosition({
            'employee_id': Number(route.params.id),
            'position_id': positionId.value,
            'start_at': parseDate(startDatePosition.value),
            'gradation': gradationId.value,
          })
            .then(() => {
              $toast.show({
                title: 'Успешно',
                subTitle: 'Успешно добавлено',
                type: 'success',
              });
              colleaguePositionData();
            })
            .catch(error => {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            })
            .finally(() => {
              modalAddPosition.value = false;
              btnLoading.value = false;
            });
        }
      };

      const addProbationPosition = () => {
        addProbationPositionValidation.value.$reset();
        if (addProbationPositionValidation.value.$invalid) {
          addProbationPositionValidation.value.$touch();
          return;
        } else {
          btnLoading.value = true;
          addEmployeeProbationPosition(route.params.id, positionId.value, {
            'from': parseDate(startDateProbationPosition.value),
            'to': parseDate(endDateProbationPosition.value),
          })
            .then(() => {
              $toast.show({
                title: 'Успешно',
                subTitle: 'Успешно добавлено',
                type: 'success',
              });
              colleaguePositionData();
            })
            .catch(error => {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            })
            .finally(() => {
              modalAddProbationPosition.value = false;
              btnLoading.value = false;
            });
        }
      };

      const editProbationPosition = () => {
        editProbationPositionValidation.value.$reset();
        if (editProbationPositionValidation.value.$invalid) {
          editProbationPositionValidation.value.$touch();
          return;
        } else {
          btnLoading.value = true;
          editEmployeeProbationPosition(route.params.id, probationId.value, {
            'from': parseDate(startDateProbationPosition.value),
            'to': parseDate(endDateProbationPosition.value),
          })
            .then(() => {
              $toast.show({
                title: 'Успешно',
                subTitle: 'Успешно изменено',
                type: 'success',
              });
              colleaguePositionData();
            })
            .catch(error => {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            })
            .finally(() => {
              editModalProbationPosition.value = false;
              btnLoading.value = false;
            });
          colleaguePositionData();
        }
      };

      const colleaguePositionData = () => {
        loading.value = true;
        getEmployeePosition(props.userId)
          .then(response => {
            colleaguePosition.value = response?.data.data;
          })
          .catch(error => {
            if (error) {
              $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
            }
          })
          .finally(() => (loading.value = false));
      };

      colleaguePositionData();

      const deleteProbationPosition = () => {
        btnLoading.value = true;
        deleteEmployeeProbationPosition(props.userId, probationId.value)
          .then(response => {
            loading.value = true;
            $toast.show({ title: 'Success', subTitle: response?.data?.message, type: 'success' });
            colleaguePositionData();
          })
          .catch(error => {
            $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
          })
          .finally(
            () => ((loading.value = false), (deleteModalProbationPosition.value = false), (btnLoading.value = false))
          );
      };

      const completeProbationPosition = () => {
        btnLoading.value = true;
        completeEmployeeProbationPosition(props.userId, probationId.value)
          .then(response => {
            loading.value = true;
            $toast.show({ title: 'Success', subTitle: response?.data?.message, type: 'success' });
            colleaguePositionData();
          })
          .catch(error => {
            $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
          })
          .finally(
            () => ((loading.value = false), (completeModalProbationPosition.value = false), (btnLoading.value = false))
          );
      };

      const selectOptions = (defaultTitle, options) => {
        return [{ title: defaultTitle, value: '' }, ...options];
      };

      return {
        loading,
        positionId,
        gradationId,
        parseDate,
        props,
        colleaguePosition,
        addPositionValidation,
        rulesAddPosition,
        startDatePosition,
        formatDistanceDate,
        colleaguePositionData,
        positions: computed(() => store.getters['core/positions']),
        gradations: computed(() => store.getters['core/gradations']),
        selectOptions,
        modalAddPosition,
        btnLoading,
        modalAddProbationPosition,
        startDateProbationPosition,
        endDateProbationPosition,
        addPosition,
        addProbationPositionValidation,
        route,
        addProbationPosition,
        editModalProbationPosition,
        editProbationPositionValidation,
        editProbationPosition,
        deleteModalProbationPosition,
        deleteProbationPosition,
        positionName,
        probationId,
        completeProbationPosition,
        completeModalProbationPosition,
      };
    },
  };
</script>

<style scoped></style>
