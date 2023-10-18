<script lang="ts" setup>
import SwapiTable from '@/components/SwapiTable.vue';
import SwapiLoader from '@/components/SwapiLoader.vue';
import SwapiModal from '@/components/SwapiModal.vue';

import useSwapiStore from '@/stores/api';
import { reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { type ISpecieData, ResourcesTypeSpecies } from '@/types';
import { TableColumnsType } from 'ant-design-vue';

interface ISwapiData {
  results: ISpecieData[];
}

const swapiStore = useSwapiStore();
const { swapiSpecies, loading, loadingModal } = storeToRefs(swapiStore);
import moment from 'moment';

const columns = ref<TableColumnsType>([
  {
    title: '№',
    dataIndex: 'number',
    key: 'number',
    fixed: 'left',
    width: 50,
  },
  {
    title: 'Название вида',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Классификация вида',
    dataIndex: 'classification',
    key: 'classification',
  },
  {
    title: 'Дизайн',
    dataIndex: 'designation',
    key: 'designation',
  },
  {
    title: 'Средний рост',
    dataIndex: 'average_height',
    key: 'average_height',
  },
  {
    title: 'Средняя продолжительность жизни',
    dataIndex: 'average_lifespan',
    key: 'average_lifespan',
  },
  {
    title: 'Цвет глаз',
    dataIndex: 'eye_colors',
    key: 'eye_colors',
  },
  {
    title: 'Цвет волос',
    dataIndex: 'hair_colors',
    key: 'hair_colors',
  },
  {
    title: 'Цвет кожи',
    dataIndex: 'skin_colors',
    key: 'skin_colors',
  },
  {
    title: 'Язык',
    dataIndex: 'language',
    key: 'language',
  },
  {
    title: 'Родная пданета',
    dataIndex: 'homeworld',
    key: 'homeworld',
  },
  {
    title: 'Люди',
    dataIndex: 'people',
    key: 'people',
  },
  {
    title: 'Фильмы',
    dataIndex: 'films',
    key: 'films',
  },
  {
    title: 'Ссылка',
    dataIndex: 'url',
    key: 'url',
  },
  {
    title: 'Дата создания',
    dataIndex: 'created',
    key: 'created',
  },
  {
    title: 'Дата редактирования',
    dataIndex: 'edited',
    key: 'edited',
    fixed: 'right',
  },
]);

const queryData = (params: { page?: number }) => {
  return swapiStore.querySawpiPagination('https://swapi.dev/api/species/', params);
};

const putDataInStore = (data: IPlanetData[]) => {
  (swapiSpecies.value as ISwapiData).results = data;
};

const getModalNames = (record: { [x: string]: any }) => {
  return Object.keys(record).filter((key) => Array.isArray(record[key]));
};

type ModalData = Record<ResourcesTypeSpecies, any[]>;
type ModalOpen = Record<ResourcesTypeSpecies, boolean>;

const modalData: ModalData = reactive({
  [ResourcesTypeSpecies.Films]: [],
  [ResourcesTypeSpecies.People]: [],
});

const modalOpen: ModalOpen = reactive({
  [ResourcesTypeSpecies.Films]: false,
  [ResourcesTypeSpecies.People]: false,
});

const showModal = async (recordData: string[], modalName: ResourcesTypeSpecies) => {
  modalOpen[modalName] = true;

  const isArrayOfStrings =
    Array.isArray(recordData) && recordData.every((item) => typeof item === 'string');

  if (!isArrayOfStrings) {
    swapiStore.changeLoadModal(false);
    return true;
  }

  swapiStore.changeLoadModal(true);

  const data = await Promise.all(
    recordData.map(async (url: string) => {
      const response = await swapiStore.getSwapiByUrl(url);
      return response;
    }),
  );

  Object.assign(modalData[modalName], data);

  swapiStore.changeLoadModal(false);
};

const closeModal = (modalName: ResourcesTypeSpecies) => {
  modalOpen[modalName] = false;
};

const dateForamte = (data: string) => moment(data).format('DD.MM.YYYY');
</script>

<template>
  <template v-if="loading">
    <div class="loading">
      <swapi-loader></swapi-loader>
    </div>
  </template>
  <template v-else>
    <swapi-table
      :columns="columns"
      :queryOnData="queryData"
      :onReturnData="putDataInStore"
    >
      <template #content="{ column, record }">
        <template v-if="column.key === 'created'">
          {{ dateForamte(record) }}
        </template>
        <template v-if="column.key === 'edited'">
          {{ dateForamte(record) }}
        </template>
        <template
          v-for="modalName in getModalNames(record)"
          :key="modalName"
        >
          <template v-if="column.key === modalName">
            <a-button
              v-if="record[modalName].length"
              @click="showModal(record[modalName], modalName as ResourcesTypeSpecies)"
              >Посмотреть {{ modalName }}</a-button
            >
            <p v-else>нет данных</p>
          </template>
        </template>
      </template>
    </swapi-table>

    <swapi-modal
      :isOpen="modalOpen.people"
      :loading="loadingModal"
      :content="modalData.people"
      :modulName="ResourcesTypeSpecies.People"
      @close="closeModal"
    >
      <template #content="{ item }">
        <a-list-item>
          <a-card :title="item.name">
            <div>
              <b>{{ item.birth_year }} </b> Год рождения человека по стандарту ДБЯ или ПБЯ во
              вселенной — до битвы при Явине или после битвы при Явине. Битва при Явине — битва,
              происходящая в конце эпизода IV сериала «Звёздные войны: Новая надежда»
            </div>
            <div>
              <b>{{ item.eye_color }} </b> Цвет глаз этого человека. Будет «неизвестно», если
              неизвестно, или «н/д», если у человека нет глаза.
            </div>
            <div>
              <b>{{ item.gender }} </b> Пол этого человека. Либо «Мужчина», «Женщина», либо
              «Неизвестно», «Н/Д», если у человека нет пола.
            </div>
            <div>
              <b>{{ item.mass }} </b> Масса человека в килограммах.
            </div>
          </a-card>
        </a-list-item>
      </template>
    </swapi-modal>

    <swapi-modal
      :isOpen="modalOpen.films"
      :loading="loadingModal"
      :content="modalData.films"
      :modulName="ResourcesTypeSpecies.Films"
      @close="closeModal"
    >
      <template #content="{ item }">
        <a-list-item>
          <a-card :title="item.title">
            <div>
              <b>{{ item.episode_id }} </b> Номер серии этого фильма.".
            </div>
            <div>
              <b>{{ item.opening_crawl }} </b> - Первые абзацы в начале фильма.
            </div>
            <div>
              <b>{{ item.director }} </b> - "имя режиссера этого фильма.
            </div>
            <div>
              <b>{{ item.producer }} </b> - Имя(имена) продюсера(ов) этого фильма. Разделенные
              запятой.
            </div>
          </a-card>
        </a-list-item>
      </template>
    </swapi-modal>
  </template>
</template>

<style>
.full-modal .ant-modal {
  max-width: 100%;
  top: 0;
  padding-bottom: 0;
  margin: 0;
}

.full-modal .ant-modal-content {
  display: flex;
  flex-direction: column;
  height: calc(100vh);
  overflow: hidden;
}

.full-modal .ant-modal-body {
  flex: 1;
  overflow-y: scroll;
}
</style>