
<template>
  <div>
    <component :is="componentType" />
  </div>
</template>
  
<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import { ResourcesType } from '@/types';

import SwapiFilmView from '@/views/SwapiFilmsView.vue';
import SwapiSpeciesView from '@/views/SwapiSpeciesView.vue';
import SwapiPlanetView from '@/views/SwapiPlanetsView.vue';
import SwapiStarshipsView from '@/views/SwapiStarshipsView.vue';
import SwapiVehiclesView from '@/views/SwapiVehiclesView.vue';
import SwapiPeopleView from '@/views/SwapiPeopleView.vue';

const props = defineProps({
  name: String,
});

const componentType = computed(() => {
  switch (props.name) {
    case ResourcesType.Films:
      return SwapiFilmView;
    case ResourcesType.Species:
      return SwapiSpeciesView;
    case ResourcesType.Planets:
      return SwapiPlanetView;
    case ResourcesType.Starships:
      return SwapiStarshipsView;
    case ResourcesType.Vehicles:
      return SwapiVehiclesView;
    case ResourcesType.People:
      return SwapiPeopleView;
    default:
      return null;
  }
});
</script>

  
<style scoped></style>