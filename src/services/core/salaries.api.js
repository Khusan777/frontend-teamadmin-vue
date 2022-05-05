import { apiClient } from '~/services/auth/apiClient';

const END_POINT = 'admin/admin/salaries';
const END_POINT2 = 'admin/admin/offer_salaries';

/**
 * Get all employees salaries
 * @params {object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getAllSalariesByParams = params => apiClient.get(`${END_POINT}`, { params });

/**
 * Get employee salary
 * @params {int}
 * @returns { Promise<AxiosResponse<any>> }
 */
const showEmployeeIdSalary = employeeId => apiClient.get(`${END_POINT}/employee/${employeeId}`);

/**
 * Add schedule salary employee
 * @params {int,int,object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const storeScheduledSalary = (employeeId, params) =>
  apiClient.post(`${END_POINT}/employee/${employeeId}/store_scheduled_salary`, params);

/**
 * Update employee schedule salary to actual
 * @params {int,int,object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const updateScheduledSalaryToActual = (employeeId, salaryId, params) =>
  apiClient.post(`${END_POINT}/employee/${employeeId}/update_salary_status/${salaryId}`, params);

/**
 * Edit employee schedule salary
 * @params {int,int,object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const editScheduledSalary = (employeeId, salaryId, params) =>
  apiClient.post(`${END_POINT}/employee/${employeeId}/edit_scheduled_salary/${salaryId}`, params);

/**
 * Add employee offer salary
 * @params {int,object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const storeOfferSalary = (employeeId, params) => apiClient.post(`${END_POINT2}/employee/${employeeId}`, params);

export {
  getAllSalariesByParams,
  showEmployeeIdSalary,
  storeScheduledSalary,
  updateScheduledSalaryToActual,
  editScheduledSalary,
  storeOfferSalary,
};
