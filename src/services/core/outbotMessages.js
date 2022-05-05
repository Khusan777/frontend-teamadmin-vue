import { apiClient } from '~/services/auth/apiClient';

const END_POINT = '/admin/admin/outbot';

/**
 * Get Colleagues OutBotMessages
 * @params {object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getOutBotIndex = params => apiClient.get(`${END_POINT}/history`, { params });

/**
 * Get Colleagues Day_Offs_Messages in OutBot
 * @params {object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getDayOffsMessages = params => apiClient.get(`${END_POINT}/day-off-case`, { params });

/**
 * Get Colleagues Late_Cases_Messages in OutBot
 * @params {object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getLateCasesMessages = params => apiClient.get(`${END_POINT}/late-case`, { params });

/**
 * Get Colleagues Remote_Work_Cases_Messages in OutBot
 * @params {object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getRemoteWorkCasesMessages = params => apiClient.get(`${END_POINT}/remote-work-case`, { params });

/**
 * Get Colleagues Self_Reason_Cases_Messages in OutBot
 * @params {object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getSelfReasonCasesMessages = params => apiClient.get(`${END_POINT}/self-reason-case`, { params });

export {
  getOutBotIndex,
  getDayOffsMessages,
  getLateCasesMessages,
  getRemoteWorkCasesMessages,
  getSelfReasonCasesMessages,
};
