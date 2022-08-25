import { defineStore } from 'pinia';
import { Cookies, SessionStorage } from 'quasar';
import useStrapi from '../api/useStrapi';
const $strapi = useStrapi();

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {},
  }),

  getters: {
    isAuthenticated(state) {
      return !!state.user.jwt;
    },
  },

  actions: {
    /**
     * Authentication with strapi api using axios and jwt token
     * @param {string} email - user email
     * @param {string} password - user password
     * @param {boolean} stayLoggedIn - stay logged in
     */
    async login(email, password, stayLoggedIn = false) {
      const { user, jwt } = await $strapi.login(email, password);
      this.user = { ...user, jwt };
      $strapi.setDefaultAuthHeader(jwt);
      this.getUser();

      if (stayLoggedIn) {
        Cookies.set('strapi_jwt', jwt);
      } else {
        SessionStorage.set('strapi_jwt', jwt);
      }

      return { user, jwt };
    },

    async getUser() {
      const user = await $strapi.getUser();
      this.user = { ...this.user, ...user };
      return this.user;
    },

    logout() {
      this.user = {};
      Cookies.remove('strapi_jwt');
      -SessionStorage.remove('strapi_jwt');
      this.router.replace('/login');
    },
  },
});
