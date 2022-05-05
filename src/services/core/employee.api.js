import { apiClient } from '~/services/auth/apiClient';

const END_POINT = '/admin/admin/employee';

/**
 * Get Employee Information by params id
 * @params {int}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getEmployeeData = id => apiClient.get(`${END_POINT}/${id}`);

/**
 * Add Employee Teams by params id
 * @params {int}
 * @returns { Promise<AxiosResponse<any>> }
 */
const addEmployeeTeams = (id, params) => apiClient.post(`${END_POINT}/${id}/bind-team`, params);

/**
 * Add new Employee
 * @params {object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const addEmployee = params => apiClient.post(`${END_POINT}`, params);

/**
 * Delete Employee
 * @params {int,object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const deleteEmployeeById = (employeeId, param) => apiClient.delete(`${END_POINT}/${employeeId}`, { data: param });

/**
 * Get Employee position
 * @params {int}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getEmployeePosition = employeeId => apiClient.get(`${END_POINT}/${employeeId}/positions`);

/**
 * Add Employee position
 * @params {object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const addEmployeePosition = params => apiClient.post(`${END_POINT}/positions`, params);

/**
 * Add Employee probation position
 * @params {int,int,object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const addEmployeeProbationPosition = (employeeId, employeePositionId, params) =>
  apiClient.post(`${END_POINT}/${employeeId}/employee-positions/${employeePositionId}`, params);

/**
 * Edit Employee probation position
 * @params {int,int,object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const editEmployeeProbationPosition = (employeeId, probationPeriodId, params) =>
  apiClient.put(`${END_POINT}/${employeeId}/probation-period/${probationPeriodId}`, params);

/**
 * Delete Employee probation position
 * @params {int,int}
 * @returns { Promise<AxiosResponse<any>> }
 */
const deleteEmployeeProbationPosition = (employeeId, probationPeriodId) =>
  apiClient.delete(`${END_POINT}/${employeeId}/probation-period/${probationPeriodId}`);

/**
 * Complete Employee probation position
 * @params {int,int}
 * @returns { Promise<AxiosResponse<any>> }
 */
const completeEmployeeProbationPosition = (employeeId, probationPeriodId) =>
  apiClient.post(`${END_POINT}/${employeeId}/probation-period/${probationPeriodId}/complete`);

export {
  getEmployeeData,
  addEmployeeTeams,
  addEmployee,
  deleteEmployeeById,
  getEmployeePosition,
  addEmployeePosition,
  addEmployeeProbationPosition,
  editEmployeeProbationPosition,
  deleteEmployeeProbationPosition,
  completeEmployeeProbationPosition,
};
