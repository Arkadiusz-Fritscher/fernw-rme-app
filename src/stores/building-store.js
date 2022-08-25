import { defineStore } from 'pinia';
import { Loading } from 'quasar';
import useStrapi from 'src/api/useStrapi';
import { Cookies, SessionStorage, LocalStorage } from 'quasar';
const $strapi = useStrapi();

export const useBuildingStore = defineStore('building', {
  state: () => ({
    buildings: [],
    groups: [],
    fetchMeta: {},
    paginationPage: 1,
    loadedAllBuildings: false,
    isFetching: false,
  }),

  getters: {
    sortedBuildings(state) {
      // return state.buildings.sort((a, b) => a.attributes.barcode.localeCompare(b.attributes.barcode));
      return state.buildings;
    },
  },

  actions: {
    async getAllBuildings(
      options = {
        pagination: {
          pageSize: 40,
          page: 1,
        },
        populate: ['thumbnail', 'gps'],
      }
    ) {
      try {
        if (this.loadedAllBuildings) return this.buildings;

        Loading.show({
          message: 'Neuste Bauwerksdaten werden vom Server geladen. Bitte warte einen Moment.',
        });
        this.isFetching = true;
        const { data, meta } = await $strapi.getBuildings(options);

        if (meta.pagination.total === this.buildings.length) {
          this.fetchMeta = { pagination: { total: this.buildings.length } };
          Loading.hide();
          return this.buildings;
        }

        this.buildings.push(...data);

        if (meta.pagination.page < meta.pagination.pageCount) {
          this.getAllBuildings(
            (options = { ...options, pagination: { ...options.pagination, page: meta.pagination.page + 1 } })
          );
        } else {
          this.isFetching = false;
          this.loadedAllBuildings = true;
          Loading.hide();
          LocalStorage.set('buildings', this.buildings);
          return this.buildings;
        }
      } catch (err) {
        console.error(err);
      }
    },

    async getBuilding(id, options = { populate: '*' }) {
      try {
        const { data } = await $strapi.getBuilding(id, options);
        return data;
      } catch (err) {
        console.error(err.message);
      }
    },

    async getBuildings(
      options = {
        pagination: {
          pageSize: 20,
          page: 1,
        },
        populate: ['thumbnail', 'gps'],
      }
    ) {
      if (this.loadedAllBuildings) return this.buildings;
      try {
        this.isFetching = true;
        const { data, meta } = await $strapi.getBuildings(options);
        // this.buildings.push(...data);

        this.isFetching = false;
        return { data, meta };
      } catch (err) {
        console.error(err);
      }
    },

    async getMoreBuildings() {
      if (this.loadedAllBuildings || this.fetchMeta.pagination?.total === this.buildings.length) return this.buildings;

      const options = !!this.fetchMeta.pagination
        ? {
            pagination: {
              pageSize: this.fetchMeta.pagination.pageSize,
              page: this.fetchMeta.pagination.page + 1,
            },
            populate: ['thumbnail'],
          }
        : null;

      if (options) {
        const { data, meta } = await this.getBuildings(options);
        this.fetchMeta = meta;
        return { data, meta };
      } else {
        const { data, meta } = await this.getBuildings();
        this.fetchMeta = meta;
        return { data, meta };
      }
    },
  },

  async uploadImages(files) {
    const response = await $strapi.upload(createFormData(files, name, caption, refId, ref, field));
    console.log(response);
    return response;
  },

  /**
   * Fetch Building data from strapi api
   * @param {FormData} file - The file(s) to upload. The value(s) can be a Buffer or Stream.
   * @param {string} name - Name of the File.
   * @param {string} refId - The ID of the entry which the file(s) will be linked to.
   * @param {string} ref - The unique ID (uid) of the model which the file(s) will be linked to (default: api::object.object )
   * @param {string} field - The field of the entry which the file(s) will be precisely linked to. (default: images)
   * * @param {string} caption - Caption of the file.
   */
  async createFormData(file, name, caption, refId, ref = 'api::object.object', field = 'images') {
    const formData = new FormData();
    formData.append('files', file, name);
    formData.append('refId', refId);
    formData.append('ref', ref);
    formData.append('field', field);
    formData.append('fileInfo', `{"caption":${caption},"alternativeText":"${caption}"}`);

    return formData;
  },
});
