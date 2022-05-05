<script setup>
  import { computed, defineAsyncComponent, ref } from 'vue';
  import useVuelidate from '@vuelidate/core';
  import { minLength, required } from '@vuelidate/validators';
  import { formatDateToLocaleString } from '~/utils/parsers';
  import { $toast } from '~/main';
  import {
    createSurvey,
    createSurveyCategory,
    deleteSurveyById,
    getAnswersSurvey,
    getIndexSurveys,
  } from '~/services/core/survey.api';
  import { useStore } from 'vuex';
  const surveys = ref([]);
  const store = useStore();
  let createModalSurvey = ref(false);
  const btnLoading = ref(false);
  const nameSurvey = ref('');
  const descriptionSurvey = ref('');
  const nameCategorySurvey = ref('');
  const typeSurvey = ref([]);
  let createModalSurveyCategory = ref(false);
  const deleteModalSurvey = ref(false);
  const loading = ref(false);
  const loadingArray = ref(Array(15).fill(1));
  const surveyId = ref(Number);
  const surveyCategory = computed(() => store.getters['core/surveysCategory']);
  const AtButton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtButton/AtButton.js'));
  const AtModal = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtModal/AtModal.js'));
  const AtSelect = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSelect/AtSelect.js'));
  const AtInput = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtInput/AtInput.js'));
  const AtTable = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTable/AtTable'));
  const AtSkeleton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton'));
  const AtTableItem = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtTableItem/AtTableItem'));

  const rules = {
    descriptionSurvey: { required, minLength: minLength(4) },
    nameSurvey: { required, minLength: minLength(4) },
    typeSurvey: { required },
  };
  const surveyValidation = useVuelidate(rules, {
    nameSurvey,
    descriptionSurvey,
    typeSurvey,
  });

  const rulesSurveyCategory = {
    nameCategorySurvey: { required, minLength: minLength(4) },
  };
  const categorySurveyValidation = useVuelidate(rulesSurveyCategory, {
    nameCategorySurvey,
  });

  const messagesTableHead = [
    { title: '#' },
    { title: 'НАЗВАНИЕ' },
    { title: 'КОЛ-ВО УЧАСТНИКОВ' },
    { title: 'ДАТА СОЗДАНИЯ' },
    { title: '' },
  ];

  const getAllSurveys = () => {
    loading.value = true;
    getIndexSurveys()
      .then(response => {
        surveys.value = response?.data.data;
      })
      .catch(error => {
        if (error) {
          $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
        }
      })
      .finally(() => (loading.value = false));
  };

  getAllSurveys();

  const downloadSurveyAnswer = surveyId => {
    getAnswersSurvey(surveyId)
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response?.data]), {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Ответы.xlsx');
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => {
        $toast.show({ title: 'Error', subTitle: 'Ошибка загрузки файла', type: 'error' });
      });
  };

  const addSurvey = async () => {
    surveyValidation.value.$reset();
    if (surveyValidation.value.$invalid) {
      surveyValidation.value.$touch();
      return;
    } else {
      btnLoading.value = true;
      await createSurvey({
        'survey_category_id': typeSurvey.value,
        'title': nameSurvey.value,
        'description': descriptionSurvey.value,
        'answers_count': null,
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
          createModalSurvey.value = false;
          btnLoading.value = false;
        });
      getAllSurveys();
    }
  };

  const addSurveyCategory = async () => {
    categorySurveyValidation.value.$reset();
    if (categorySurveyValidation.value.$invalid) {
      categorySurveyValidation.value.$touch();
      return;
    } else {
      btnLoading.value = true;
      await createSurveyCategory({
        'title': nameCategorySurvey.value,
      })
        .then(() => {
          $toast.show({
            title: 'Успешно',
            subTitle: 'Успешно отправлено',
            type: 'success',
          });
          store.dispatch('core/getApp');
        })
        .catch(error => {
          $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
        })
        .finally(() => {
          createModalSurveyCategory.value = false;
          btnLoading.value = false;
        });
    }
  };

  const deleteSurvey = async surveyId => {
    btnLoading.value = true;
    await deleteSurveyById(surveyId)
      .then(() => {
        $toast.show({
          title: 'Успешно',
          subTitle: 'Успешно удалено',
          type: 'success',
        });
        getAllSurveys();
      })
      .catch(error => {
        $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
      })
      .finally(() => {
        deleteModalSurvey.value = false;
        btnLoading.value = false;
      });
  };
</script>

<template>
  <div class="-m-6 mb-4">
    <div class="w-full bg-alpha">
      <div class="flex items-center justify-between p-4 border-b md:flex-row flex-grow flex-col whitespace-nowrap">
        <h1 class="text-2xl font-bold px-3">Опросы</h1>
        <div class="space-x-4 mt-2">
          <AtButton @click="createModalSurvey = true" icon="plus" color="primary">Создать опрос</AtButton>
          <AtButton @click="createModalSurveyCategory = true" icon="plus" color="secondary">Создать категорию</AtButton>
        </div>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-7">
    <div class="col-span-7">
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
        <at-table :head="messagesTableHead" :elements="surveys">
          <template #element="{ element, index }">
            <at-table-item>
              <p class="text-gray-500">{{ index + 1 }}</p>
            </at-table-item>
            <at-table-item class="max-w-md" :to="{ name: 'survey.detail', params: { id: element?.id } }">
              <p class="text-black whitespace-nowrap">
                {{ element?.title || '-' }}
              </p>
            </at-table-item>
            <at-table-item class="max-w-md" :to="{ name: 'survey.detail', params: { id: element?.id } }">
              <p class="text-gray-500 whitespace-nowrap">134</p>
            </at-table-item>
            <at-table-item class="max-w-md" :to="{ name: 'survey.detail', params: { id: element?.id } }">
              <p class="whitespace-nowrap">
                {{ formatDateToLocaleString(element?.category?.created_at) || '-' }}
              </p>
              <p class="text-gray-500 text-sm ml-6">
                {{ $filters.readableTime(element?.category?.created_at) || '-' }}
              </p>
            </at-table-item>
            <at-table-item>
              <AtButton
                color="danger"
                icon="trash"
                @click="(deleteModalSurvey = true), ((surveyId = element?.id), (nameSurvey = element?.title))"
              ></AtButton>
              <AtButton
                class="ml-4"
                color="secondary"
                icon="cloudDownload"
                @click="downloadSurveyAnswer((surveyId = element?.id))"
              ></AtButton>
            </at-table-item>
          </template>
          <template #footer>
            <div v-if="!surveys?.length" class="text-center my-5">
              <p>Пусто</p>
            </div>
          </template>
        </at-table>
      </div>
    </div>

    <AtModal v-model="deleteModalSurvey" :title="'Удалить текущий опрос'">
      <div class="mt-2 flex justify-center items-center">
        <p class="text-yellow-500 text-center text-lg">
          Вы точно хотите удалить этот опрос:<br />
          <span class="text-black"> {{ nameSurvey }}!!!</span>
        </p>
      </div>
      <div class="flex space-x-3 mt-3">
        <AtButton class="w-full p-4" @click="deleteModalSurvey = false">Закрыть</AtButton>
        <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="deleteSurvey(surveyId)"
          >Удалить</AtButton
        >
      </div>
    </AtModal>

    <AtModal v-model="createModalSurveyCategory" :title="'Создать новую категорию опросника'">
      <div class="mt-2">
        <AtInput
          label="Название"
          placeholder="Введите название категории"
          :error="categorySurveyValidation.nameCategorySurvey.$error"
          v-model="nameCategorySurvey"
        />
        <div class="flex space-x-3 mt-3">
          <AtButton class="w-full p-4" @click="createModalSurveyCategory = false">Закрыть</AtButton>
          <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="addSurveyCategory()">
            Добавить
          </AtButton>
        </div>
      </div>
    </AtModal>

    <AtModal v-model="createModalSurvey" :title="'Создать новый опрос'">
      <div class="mt-2">
        <AtInput
          label="Название"
          placeholder="Введите название опросника"
          :error="surveyValidation.nameSurvey.$error"
          v-model="nameSurvey"
        />
        <AtInput
          label="Описание"
          placeholder="Введите описание к опроснику"
          :error="surveyValidation.descriptionSurvey.$error"
          v-model="descriptionSurvey"
        />
        <AtSelect
          label="Категория"
          :options="surveyCategory"
          placeholder="Выберите категорию опросника"
          :error="surveyValidation.typeSurvey.$error"
          v-model="typeSurvey"
        />
        <div class="flex space-x-3 mt-3">
          <AtButton class="w-full p-4" @click="createModalSurvey = false">Закрыть</AtButton>
          <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="addSurvey()"> Добавить </AtButton>
        </div>
      </div>
    </AtModal>
  </div>
</template>

<style scoped></style>
