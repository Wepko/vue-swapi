import { defineStore } from 'pinia';
import axios, { type AxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';
import type { IFilm } from '@/types';

const API_BASE_URL = 'https://swapi.dev';

const axiosClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

export const useSwapiStore = defineStore('SwapiStore', {
  state: () => {
    return {
      swapiResources: {},
      loading: false,
      loadingModal: false,
      swapiFilms: {},
      swapiPeople: {},
      swapiPlanets: {},
      swapiSpecies: {},
      swapiVehicles: {},
      swapiStarships: {},
    };
  },
  persist: true,
  getters: {},
  actions: {
    async getSwapiResources() {
      if (Object.keys(this.swapiResources).length > 0) return true;
      this.loading = true;
      const response = await axiosClient.get('/');
      this.swapiResources = await response.data;
      this.loading = false;
    },

    async getSwapiFilms() {
      if (Object.keys(this.swapiFilms).length > 0) return true;
      this.loading = true;
      const response = await axiosClient.get('/films');
      this.swapiFilms = await response.data;
      this.loading = false;
    },

    async getSwapiPeople(params?: AxiosRequestConfig<any> | undefined) {
      if (Object.keys(this.swapiPeople).length > 0) return true;
      this.loading = true;
      const response = await axiosClient.get('/people', params);
      this.swapiPeople = await response.data;
      this.loading = false;
    },

    async getSwapiByUrl(url: string) {
      const response = await axiosClient.get(url);
      return await response.data;
    },

    async querySawpiPagination(
      url: string,
      params: { params?: { page?: number }; page?: number | undefined },
    ) {
      const response = axios.get(url, { params });
      return await response;
    },

    async changeLoadModal(load: boolean) {
      this.loadingModal = load;
    },

    async getSwapiPlanets() {
      if (Object.keys(this.swapiPlanets).length > 0) return true;
      this.loading = true;
      const response = await axiosClient.get('/planets');
      this.swapiPlanets = await response.data;
      this.loading = false;
    },

    async getSwapiSpecies() {
      if (Object.keys(this.swapiSpecies).length > 0) return true;
      this.loading = true;
      const response = await axiosClient.get('/species');
      this.swapiSpecies = await response.data;
      this.loading = false;
    },

    async getSwapiVehicles() {
      if (Object.keys(this.swapiVehicles).length > 0) return true;
      this.loading = true;
      const response = await axiosClient.get('/vehicles');
      this.swapiVehicles = await response.data;
      this.loading = false;
    },

    async getSwapiStarships() {
      if (Object.keys(this.swapiStarships).length > 0) return true;
      this.loading = true;
      const response = await axiosClient.get('/starships');
      this.swapiStarships = await response.data;
      this.loading = false;
    },
  },
});

//https://swapi.dev/api/?format=json
export default useSwapiStore;
