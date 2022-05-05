import { apiClient } from '~/services/auth/apiClient';

const END_POINT1 = 'admin/admin/employees';
const END_POINT3 = 'admin/admin/activities';
const END_POINT4 = 'admin/admin/employee';
const END_POINT5 = 'admin/admin/activities/index';

/**
 * Get AllColleagues data with pagination
 * @params {Object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getAllColleagues = params => apiClient.get(`${END_POINT1}`, { params });

/**
 * Get All colleagues activity data
 * @params {Object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const activityColleagues = params => apiClient.get(`${END_POINT3}`, { params });

/**
 * Add colleague by id extra-day-offs
 * @params {Object}
 * @params {int}
 * @returns { Promise<AxiosResponse<any>> }
 */
const addEmployeeExtraDayOff = (id, params) => apiClient.post(`${END_POINT4}/${id}/extra-day-off`, params);

/**
 * Add vacation colleague
 * @params {Object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const addEmployeeVacations = params => apiClient.post(`${END_POINT4}/vacation`, params);

/**
 * Get All colleagues activity data
 * @params {Object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const newActivityColleagues = params => apiClient.get(`${END_POINT5}`, { params });

export { getAllColleagues, activityColleagues, newActivityColleagues, addEmployeeExtraDayOff, addEmployeeVacations };
