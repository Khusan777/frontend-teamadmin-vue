import { apiClient } from '~/services/auth/apiClient';

/**
 * Get base data that used everywhere in app
 * @returns { Promise<AxiosResponse<any>> }
 */
const getApplication = () => apiClient.get('admin/admin/app');

export { getApplication };
