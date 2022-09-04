import { boot } from 'quasar/wrappers';
import { Cookies, SessionStorage, LocalStorage } from 'quasar';
import { useUserStore } from 'src/stores/user-store';
import { useBuildingStore } from 'src/stores/building-store';
import useStrapi from 'src/api/useStrapi';

// import axios from 'axios';

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
// const api = axios.create({ baseURL: process.env.STRAPI_URL });

export default boot(({ store }) => {
  const userStore = useUserStore(store);
  const $buildingStore = useBuildingStore(store);
  const $strapi = useStrapi();

  // Set Axios default Authorization header with jwt token and fetch user data
  function initializeUser() {
    $strapi.setDefaultAuthHeader(userStore.user.jwt);
    userStore.getUser();
  }

  // Check if User has Cookies and if so, set the token in the store
  if (Cookies.has('strapi_jwt')) {
    userStore.user.jwt = Cookies.get('strapi_jwt');
    initializeUser();
  } else if (SessionStorage.has('strapi_jwt')) {
    userStore.user.jwt = SessionStorage.getItem('strapi_jwt');
    initializeUser();
  }

  if (LocalStorage.has('buildings')) {
    $buildingStore.storedBuildings = LocalStorage.getItem('buildings');
  }
});

// export { api };
