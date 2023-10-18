<script setup lang="ts">
import useSwapiStore from '@/stores/api';
import { reactive } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import SwapiLoader from '@/components/SwapiLoader.vue';
//import {type ResourcesType} from "@/types";

const swapi = useSwapiStore();

const { swapiResources, loading } = storeToRefs(swapi);

const columns = [
  {
    title: 'Номер',
    dataIndex: 'number',
    key: 'number'
  },
  {
    title: 'Название',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Ссылка',
    dataIndex: 'url',
    key: 'url',
  },
  {
    title: 'Кнопка',
    key: 'button',
  },
];

const data: any[] = reactive([]);

swapi.getSwapiResources()
  .then(() => {
    const swapiEntries = Object.entries(swapiResources.value);
    const mappedData = swapiEntries.map(([swapiKey, swapiItem], index) => ({
      number: index + 1,
      name: swapiKey,
      url: swapiItem
    }));
    Object.assign(data, mappedData);
  });

</script>

<template>
  <div v-if="loading" class="loading">
    <swapi-loader></swapi-loader>
  </div>
  <main v-else>
    <a-table :columns="columns" :data-source="data">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'button'">
          <a>
            <a-button>
              <router-link :to="{ name: 'swapi', params: { name: record.name } }">
                Перейти на {{ record.name }}
              </router-link>
            </a-button>

          </a>
        </template>
      </template>
    </a-table>
  </main>
</template>

<style scoped></style>