import { apiClient } from '~/services/auth/apiClient';

const END_POINT = 'admin/admin/metrics';

/**
 * Get AllMetrics data colleagues
 * @params {Object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const allProductivityMonthly = params => apiClient.get(`${END_POINT}/monthly`, { params });

/**
 * Get AllMetrics data colleagues
 * @params {Object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const allProductivityWeekly = params => apiClient.get(`${END_POINT}/weekly`, { params });

/**
 * Get AllMetrics data colleagues
 * @params {Object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const allManagerMonthlyProductivity = params => apiClient.get(`${END_POINT}/monthly/manager`, { params });

/**
 * Get AllMetrics data colleagues
 * @params {Object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const allManagerWeeklyProductivity = params => apiClient.get(`${END_POINT}/weekly/manager`, { params });

/**
 * Get AllMetrics data colleagues
 * @params {Object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const allTeamsMonthlyProductivity = params => apiClient.get(`${END_POINT}/monthly/team`, { params });

/**
 * Get AllMetrics data colleagues
 * @params {Object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const allTeamsWeeklyProductivity = params => apiClient.get(`${END_POINT}/weekly/team`, { params });

export {
  allProductivityMonthly,
  allProductivityWeekly,
  allManagerMonthlyProductivity,
  allManagerWeeklyProductivity,
  allTeamsMonthlyProductivity,
  allTeamsWeeklyProductivity,
};
