import { apiClient } from '~/services/auth/apiClient';

const STORE_END_POINT = 'admin/admin/survey/store';
const MAIN_END_POINT = 'admin/admin/survey';

/**
 * Create survey
 * @params {object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const createSurvey = params => apiClient.post(`${STORE_END_POINT}`, params);

/**
 * Get all surveys
 * @returns { Promise<AxiosResponse<any>> }
 */
const getIndexSurveys = () => apiClient.get(`${MAIN_END_POINT}`);

/**
 * Get show survey detail by id
 * @params {int}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getShowSurvey = param => apiClient.get(`${MAIN_END_POINT}/${param}`);

/**
 * Edit survey by id
 * @params {int,object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const editSurveyById = (surveyId, param) => apiClient.put(`${MAIN_END_POINT}/${surveyId}`, param);

/**
 * Delete survey by id
 * @params {int}
 * @returns { Promise<AxiosResponse<any>> }
 */
const deleteSurveyById = param => apiClient.delete(`${MAIN_END_POINT}/${param}`);

/**
 * Create Survey Category
 * @params {object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const createSurveyCategory = param => apiClient.post(`${MAIN_END_POINT}/category/store`, param);

/**
 * Create Survey Category
 * @params {int,object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const activateSurvey = (survey_id, param) => apiClient.post(`${MAIN_END_POINT}/${survey_id}/activate`, param);

/**
 * Create Question to Survey
 * @params {int,object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const createSurveyQuestion = (survey_id, param) => apiClient.post(`${MAIN_END_POINT}/${survey_id}/question`, param);

/**
 * Delete Question in Survey
 * @params {int,int}
 * @returns { Promise<AxiosResponse<any>> }
 */
const deleteSurveyQuestion = (survey_id, question_id) =>
  apiClient.delete(`${MAIN_END_POINT}/${survey_id}/question/${question_id}`);

/**
 * Edit Question in Survey
 * @params {int,int,object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const editSurveyQuestion = (survey_id, question_id, param) =>
  apiClient.put(`${MAIN_END_POINT}/${survey_id}/question/${question_id}`, param);

/**
 * Get AllMetrics data colleagues
 * @params {Object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getAnswersSurvey = (surveyId, params = null) =>
  apiClient.get(`${MAIN_END_POINT}/${surveyId}/export/excel`, { params, responseType: 'blob' });

export {
  createSurvey,
  getIndexSurveys,
  getShowSurvey,
  editSurveyById,
  deleteSurveyById,
  createSurveyCategory,
  activateSurvey,
  createSurveyQuestion,
  deleteSurveyQuestion,
  editSurveyQuestion,
  getAnswersSurvey,
};
