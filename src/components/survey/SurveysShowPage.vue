<script setup>
  import { defineAsyncComponent, ref } from 'vue';
  import { ChevronLeftIcon } from '@heroicons/vue/solid';
  import { useRoute } from 'vue-router';
  import { $toast } from '~/main';
  import {
    activateSurvey,
    createSurveyQuestion,
    deleteSurveyQuestion,
    editSurveyById,
    editSurveyQuestion,
    getShowSurvey,
  } from '~/services/core/survey.api';
  import { minLength, required } from '@vuelidate/validators';
  import useVuelidate from '@vuelidate/core';
  import store from '~/store';
  const AtInput = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtInput/AtInput'));
  const AtSkeleton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSkeleton/AtSkeleton'));
  const AtButton = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtButton/AtButton'));
  const AtModal = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtModal/AtModal'));
  const AtRadioGroup = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtRadioGroup/AtRadioGroup'));
  const AtPanel = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtPanel/AtPanel'));
  const AtSelect = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtSelect/AtSelect'));
  const AtAlert = defineAsyncComponent(() => import('~/plugins/aliftech-ui/components/AtAlert/AtAlert'));
  const loading = ref(false);
  const editNameSurvey = ref('');
  const nameSurvey = ref('');
  const descriptionSurvey = ref('');
  const editModalSurvey = ref(false);
  const addModalQuestionSurvey = ref(false);
  const questionTitle = ref('');
  const questionName = ref('');
  const btnLoading = ref(false);
  const typeSurvey = ref([]);
  const typeEditSurvey = ref([]);
  const questions = ref([]);
  const startModalSurvey = ref(false);
  const editNameQuestion = ref('');
  const endModalSurvey = ref(false);
  const deleteModalQuestionSurvey = ref(false);
  const editModalQuestionSurvey = ref(false);
  const startSurvey = ref(Number);
  const questionId = ref(Number);
  const route = useRoute();
  const surveyCategories = ref(store.getters['core/surveysCategory']);
  const surveyData = ref({});
  const items = [
    {
      title: 1,
      value: 1,
    },
    {
      title: 2,
      value: 2,
    },
    {
      title: 3,
      value: 3,
    },
    {
      title: 4,
      value: 4,
    },
    {
      title: 5,
      value: 5,
    },
    {
      title: 6,
      value: 6,
    },
  ];

  const rulesEditSurvey = {
    editNameSurvey: { required, minLength: minLength(4) },
    typeEditSurvey: { required },
  };

  const surveyEditValidation = useVuelidate(rulesEditSurvey, {
    editNameSurvey,
    typeEditSurvey,
  });

  const addQuestionRules = {
    questionTitle: { required, minLength: minLength(4) },
  };
  const addQuestionSurveyValidation = useVuelidate(addQuestionRules, {
    questionTitle,
  });

  const editQuestionRules = {
    editNameQuestion: { required, minLength: minLength(4) },
  };

  const questionEditValidation = useVuelidate(editQuestionRules, {
    editNameQuestion,
  });

  const getSurveyShowById = () => {
    loading.value = true;
    getShowSurvey(Number(route.params.id))
      .then(response => {
        surveyData.value = response?.data.data;
        nameSurvey.value = response?.data.data.title;
        descriptionSurvey.value = response?.data.data.description;
        typeSurvey.value = response?.data.data.category?.id;
        questions.value = response?.data;
      })
      .catch(error => {
        if (error) {
          $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
        }
      })
      .finally(() => (loading.value = false));
  };
  getSurveyShowById();

  const editSurvey = async () => {
    surveyEditValidation.value.$reset();
    if (surveyEditValidation.value.$invalid) {
      surveyEditValidation.value.$touch();
      return;
    } else {
      btnLoading.value = true;
      await editSurveyById(route.params.id, {
        'survey_category_id': typeEditSurvey.value,
        'title': editNameSurvey.value,
        'answers_count': null,
      })
        .then(() => {
          $toast.show({
            title: 'Успешно',
            subTitle: 'Успешно изменено',
            type: 'success',
          });
        })
        .catch(error => {
          $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
        })
        .finally(() => {
          editModalSurvey.value = false;
          btnLoading.value = false;
        });
      getSurveyShowById();
    }
  };

  const addQuestionSurvey = async () => {
    addQuestionSurveyValidation.value.$reset();
    if (addQuestionSurveyValidation.value.$invalid) {
      addQuestionSurveyValidation.value.$touch();
      return;
    } else {
      btnLoading.value = true;
      await createSurveyQuestion(route.params.id, {
        'survey_id': Number(route.params.id),
        'title': questionTitle.value,
        'reversed': false,
      })
        .then(() => {
          $toast.show({
            title: 'Успешно',
            subTitle: 'Успешно добавлено',
            type: 'success',
          });
        })
        .catch(error => {
          $toast.show({ title: 'Error', subTitle: error?.response?.data?.message, type: 'error' });
        })
        .finally(() => {
          addModalQuestionSurvey.value = false;
          btnLoading.value = false;
        });
      getSurveyShowById();
    }
  };

  const activationSurvey = () => {
    btnLoading.value = true;
    activateSurvey(route.params.id, {
      'is_active': startSurvey.value,
    })
      .then(() => {
        $toast.show({
          title: 'Успешно',
          subTitle: 'Успешно запущено',
          type: 'success',
        });
        getSurveyShowById();
      })
      .catch(error => {
        $toast.show({ title: 'Error', subTitle: error?.data?.message, type: 'error' });
      })
      .finally(() => {
        endModalSurvey.value = false;
        startModalSurvey.value = false;
        btnLoading.value = false;
      });
  };

  const deactivateSurvey = () => {
    btnLoading.value = true;
    activateSurvey(route.params.id, {
      'is_active': startSurvey.value,
    })
      .then(() => {
        $toast.show({
          title: 'Успешно',
          subTitle: 'Успешно остановлено',
          type: 'success',
        });
        getSurveyShowById();
      })
      .catch(error => {
        $toast.show({ title: 'Error', subTitle: error?.data?.message, type: 'error' });
      })
      .finally(() => {
        endModalSurvey.value = false;
        btnLoading.value = false;
      });
  };

  const deleteQuestion = () => {
    btnLoading.value = true;
    deleteSurveyQuestion(route.params.id, questionId.value)
      .then(() => {
        $toast.show({
          title: 'Успешно',
          subTitle: 'Успешно удалено',
          type: 'success',
        });
        getSurveyShowById();
      })
      .catch(error => {
        $toast.show({ title: 'Error', subTitle: error?.data?.message, type: 'error' });
      })
      .finally(() => {
        deleteModalQuestionSurvey.value = false;
        btnLoading.value = false;
      });
  };

  const editQuestion = () => {
    questionEditValidation.value.$reset();
    if (questionEditValidation.value.$invalid) {
      questionEditValidation.value.$touch();
      return;
    } else {
      btnLoading.value = true;
      editSurveyQuestion(route.params.id, questionId.value, {
        'survey_id': route.params.id,
        'title': editNameQuestion.value,
        'reversed': false,
      })
        .then(() => {
          $toast.show({
            title: 'Успешно',
            subTitle: 'Успешно изменён',
            type: 'success',
          });
          getSurveyShowById();
        })
        .catch(error => {
          $toast.show({ title: 'Error', subTitle: error?.data?.message, type: 'error' });
        })
        .finally(() => {
          editModalQuestionSurvey.value = false;
          btnLoading.value = false;
        });
    }
  };
</script>

<template>
  <div>
    <div class="-m-6 mb-4">
      <div class="flex items-center p-3 border-b md:flex-row flex-grow flex-col whitespace-nowrap">
        <chevron-left-icon
          class="w-10 h-18 text-gray-300 mr-2 ml-2 cursor-pointer"
          @click="$router.go(-1)"
        ></chevron-left-icon>
        <h1 @click="$router.go(-1)" class="text-2xl font-bold cursor-pointer">{{ nameSurvey || '-' }}</h1>
        <div class="flex items-center justify-end md:flex-row flex-grow flex-col mt-1 whitespace-nowrap">
          <div class="px-2" v-if="surveyData?.is_active == 0">
            <at-button color="primary" @click="(startModalSurvey = true), (startSurvey = 1)" icon="play"
              >Запустить опрос</at-button
            >
          </div>
          <div v-else>
            <at-button color="primary" @click="(endModalSurvey = true), (startSurvey = 0)" icon="stop"
              >Остановить опрос</at-button
            >
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3">
      <div class="col-span-3 mb-4">
        <at-panel>
          <template #header>
            <div class="flex justify-between gap-x-4 items-center">
              <p class="text-lg text-md">Информация</p>
              <at-button @click="editModalSurvey = true" color="secondary">Изменить</at-button>
            </div>
          </template>
          <div v-if="loading">
            <div class="mb-1 p-2" v-for="i in 5" :key="i">
              <at-skeleton type="row"></at-skeleton>
            </div>
          </div>
          <div v-else>
            <div class="mb-4">
              <AtInput disabled label="Название" placeholder="Введите название опросника" v-model="nameSurvey" />
            </div>
            <div class="mb-4">
              <AtSelect
                disabled
                label="Категория опросника"
                :options="surveyCategories"
                placeholder="Выберите категорию опросника"
                v-model="typeSurvey"
              />
            </div>
          </div>
        </at-panel>
      </div>
      <div class="mt-4 col-span-3">
        <div class="flex items-center justify-between mb-4">
          <p class="text-black font-bold text-xl">{{ nameSurvey }}</p>
          <at-button @click="addModalQuestionSurvey = true" color="primary" icon="plusSm"></at-button>
        </div>
        <p class="text-md text-gray-400 mb-6">{{ descriptionSurvey }}</p>
        <AtPanel borderHeader>
          <div v-for="questionData in questions" :key="questionData?.id">
            <div class="divide-solid divide-gray-200 divide-y -mx-6" v-if="questionData?.questions?.length">
              <div class="mb-4" v-for="(questionsItem, index) in questionData?.questions" :key="index">
                <div class="flex items-center px-6 gap-x-2 gap-y-2 mt-2">
                  <p class="text-gray-400">{{ index + 1 }}</p>
                  <p class="text-md">{{ questionsItem?.title }}</p>
                  <div class="flex flex-grow items-center justify-end gap-x-2">
                    <at-button
                      @click="(editModalQuestionSurvey = true), (questionId = questionsItem?.id)"
                      color="primary"
                      icon="pencil"
                    ></at-button>
                    <at-button
                      @click="
                        (deleteModalQuestionSurvey = true),
                          (questionId = questionsItem?.id),
                          (questionName = questionsItem?.title)
                      "
                      color="danger"
                      icon="trash"
                    ></at-button>
                  </div>
                </div>
                <div class="px-6 mt-1">
                  <AtRadioGroup :items="items" valueType="title" noBorder inline></AtRadioGroup>
                </div>
              </div>
            </div>
            <div v-else>
              <at-alert type="warning">Нет данных</at-alert>
            </div>
          </div>
        </AtPanel>
      </div>
    </div>

    <AtModal v-model="editModalSurvey" :title="'Редактировать опрос'">
      <div class="mt-2">
        <AtInput
          label="Название"
          placeholder="Введите название опросника"
          :error="surveyEditValidation.editNameSurvey.$error"
          v-model="editNameSurvey"
        />
        <AtSelect
          label="Категория"
          :options="surveyCategories"
          placeholder="Выберите категорию опросника"
          :error="surveyEditValidation.typeEditSurvey.$error"
          v-model="typeEditSurvey"
        />
        <div class="flex space-x-3 mt-3">
          <AtButton class="w-full p-4" @click="editModalSurvey = false">Закрыть</AtButton>
          <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="editSurvey()">
            Сохранить
          </AtButton>
        </div>
      </div>
    </AtModal>

    <AtModal v-model="startModalSurvey" :title="'Запустить опрос'">
      <p class="text-center text-lg text-yellow-400">
        Вы действительно хотите запустить опрос<br />
        <span class="text-black text-center"> {{ nameSurvey }}!!!</span>
      </p>
      <div class="flex space-x-3 mt-3">
        <AtButton class="w-full p-4" @click="startModalSurvey = false">Отмена</AtButton>
        <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="activationSurvey()">
          Запустить
        </AtButton>
      </div>
    </AtModal>

    <AtModal v-model="endModalSurvey" :title="'Остановить опрос'">
      <p class="text-center text-lg text-yellow-400">
        Вы действительно хотите остановить опрос<br />
        <span class="text-black text-center"> {{ nameSurvey }}!!!</span>
      </p>
      <div class="flex space-x-3 mt-3">
        <AtButton class="w-full p-4" @click="endModalSurvey = false">Отмена</AtButton>
        <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="deactivateSurvey()">
          Остановить
        </AtButton>
      </div>
    </AtModal>

    <AtModal v-model="addModalQuestionSurvey" :title="'Добавления вопроса к опроснику'">
      <div class="mt-2">
        <AtInput
          label="Название"
          placeholder="Введите название вопроса"
          :error="addQuestionSurveyValidation.questionTitle.$error"
          v-model="questionTitle"
        />
      </div>
      <div class="flex space-x-3 mt-3">
        <AtButton class="w-full p-4" @click="addModalQuestionSurvey = false">Закрыть</AtButton>
        <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="addQuestionSurvey()">
          Сохранить
        </AtButton>
      </div>
    </AtModal>

    <AtModal v-model="deleteModalQuestionSurvey" :title="'Удаление вопроса'">
      <div class="mt-2">
        <p class="text-center text-lg text-yellow-400">
          Вы действительно хотите удалить вопрос<br />
          <span class="text-black text-center"> {{ questionName }}!!!</span>
        </p>
      </div>
      <div class="flex space-x-3 mt-3">
        <AtButton class="w-full p-4" @click="deleteModalQuestionSurvey = false">Отмена</AtButton>
        <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="deleteQuestion()">
          Удалить
        </AtButton>
      </div>
    </AtModal>

    <AtModal v-model="editModalQuestionSurvey" :title="'Изменить вопрос'">
      <div class="mt-2">
        <AtInput
          label="Название"
          placeholder="Введите название вопроса"
          :error="questionEditValidation.editNameQuestion.$error"
          v-model="editNameQuestion"
        />
      </div>
      <div class="flex space-x-3 mt-3">
        <AtButton class="w-full p-4" @click="editModalQuestionSurvey = false">Отмена</AtButton>
        <AtButton class="w-full p-4" color="primary" :loading="btnLoading" @click="editQuestion()"> Изменить </AtButton>
      </div>
    </AtModal>
  </div>
</template>

<style scoped></style>
