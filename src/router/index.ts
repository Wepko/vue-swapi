import { createRouter, createWebHistory } from 'vue-router';

import SwapiResourcesView from '../views/SwapiResourcesView.vue';

import SwapiLayout from '@/views/layouts/SwapiLayout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',

      name: 'home',

      component: SwapiResourcesView,
    },

    {
      path: '/swapi/:name',

      name: 'swapi',

      component: SwapiLayout,

      props: true,

      // children: [

      //   {

      //     path: 'films',

      //     name: 'swapiFilms',

      //     component: () => import('@/views/SwapiFilmsView.vue'),

      //   },

      //   {

      //     path: 'people',

      //     name: 'swapiPeople',

      //     component: () => import('@/views/SwapiPeopleView.vue'),

      //   },

      //   {

      //     path: 'planets',

      //     name: 'swapiPlanets',

      //     component: () => import('@/views/SwapiPlanetsView.vue'),

      //   },

      //   {

      //     path: 'species',

      //     name: 'swapiSpecies',

      //     component: () => import('@/views/SwapiSpeciesView.vue'),

      //   },

      //   {

      //     path: 'vehicles',

      //     name: 'swapiVehicles',

      //     component: () => import('@/views/SwapiVehiclesView.vue'),

      //   },

      //   {

      //     path: 'starships',

      //     name: 'swapiStarships',

      //     component: () => import('@/views/SwapiStarshipsView.vue'),

      //   },

      // ],
    },
  ],
});

export default router;
