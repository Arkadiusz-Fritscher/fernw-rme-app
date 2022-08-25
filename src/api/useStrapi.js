import { api } from 'boot/axios';
import qs from 'qs';

export default function useStrapi() {
  /**
   * Authentication with strapi api using axios and jwt token
   * @param {string} email - user email
   * @param {string} password - user password
   */
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/local', {
        identifier: email,
        password,
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Set Axios default Authorization header with jwt token
   * @param {string} token - User JWT token
   */
  const setDefaultAuthHeader = (token) => {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  /**
   * Fetch Building data from strapi api
   * @param {object} options - Strapi query options object (optional)
   */
  const getBuildings = async (options = {}) => {
    try {
      const query = qs.stringify(options, { encodeValuesOnly: true });
      const { data } = await api.get(`/api/objects?${query}`);
      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Fetch single Building data from strapi api
   * @param {string} id - Object id to fetch (required)
   * @param {object} options - Strapi query options object (optional)
   */
  const getBuilding = async (id, options) => {
    try {
      const query = qs.stringify(options, { encodeValuesOnly: true });
      const { data } = await api.get(`/api/objects/${id}?${query}`);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      const { data } = await api.post('/auth/local/register', {
        identifier: email,
        password,
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  const getUser = async () => {
    try {
      const { data } = await api.get('/api/users/me', {
        params: { populate: '*' },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Fetch Building data from strapi api
   * @param {FormData} data - The form data to upload
   */
  const upload = async (data) => {
    try {
      // const query = qs.stringify(options, { encodeValuesOnly: true });
      const response = await api.post('/api/upload', data);
      return response;
    } catch (error) {
      throw error;
    }
  };

  return { login, register, getUser, setDefaultAuthHeader, getBuildings, getBuilding, upload };
}
