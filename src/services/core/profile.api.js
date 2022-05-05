import { apiClient } from '~/services/auth/apiClient';

const END_POINT = '/admin/admin/options';
const END_POINT2 = '/admin/admin/employee';

/**
 * Get options colleague total data
 * @params {int}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getOptionsData = employeeId => apiClient.get(`${END_POINT}/employee/${employeeId}/total`);

/**
 * Get options chart data colleague
 * @params {int}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getOptionsChartData = employeeId => apiClient.get(`${END_POINT}/employee/${employeeId}/option_chart_data`);

/**
 * Get options data colleague
 * @params {int}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getOptionsIndex = employeeId => apiClient.get(`${END_POINT}/employee/${employeeId}/index`);

/**
 * Add options colleague
 * @params {int}
 * @params {object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const addOptions = (employeeId, params) => apiClient.post(`${END_POINT}/employee/${employeeId}/store`, params);

/**
 * Show schedule work profile colleague
 * @params {int}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getScheduleWork = employeeId => apiClient.get(`${END_POINT2}/${employeeId}/schedules`);

/**
 * Edit colleague schedule work time
 * @params {Object}
 * @params {int}
 * @returns { Promise<AxiosResponse<any>> }
 */
const editEmployeeScheduleTimeWork = params => apiClient.post(`${END_POINT2}/schedules`, params);

export {
  getOptionsData,
  getOptionsChartData,
  getOptionsIndex,
  addOptions,
  getScheduleWork,
  editEmployeeScheduleTimeWork,
};
