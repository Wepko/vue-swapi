<script lang="ts" setup>
import SwapiTable from '@/components/SwapiTable.vue';
import SwapiLoader from '@/components/SwapiLoader.vue';
import SwapiModal from '@/components/SwapiModal.vue';

import useSwapiStore from '@/stores/api';
import { reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { type IFilmData, ResourcesTypeFilm } from '@/types';
import { type TableColumnsType } from 'ant-design-vue';

interface ISwapiData {
  results: IFilmData[];
}

const swapiStore = useSwapiStore();
const { swapiFilms, loading, loadingModal } = storeToRefs(swapiStore);
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
    title: 'Название фильма',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Открывающий скролл',
    dataIndex: 'opening_crawl',
    key: 'opening_crawl',
    width: 500,
  },
  {
    title: 'Режиссер',
    dataIndex: 'director',
    key: 'director',
  },
  {
    title: 'Продюсеры',
    dataIndex: 'producer',
    key: 'producer',
  },
  {
    title: 'Дата выхода',
    dataIndex: 'release_date',
    key: 'release_date',
  },
  {
    title: 'Список видов',
    dataIndex: 'species',
    key: 'species',
  },
  {
    title: 'Список звездолетов',
    dataIndex: 'starships',
    key: 'starships',
  },
  {
    title: 'Список транспортных средств',
    dataIndex: 'vehicles',
    key: 'vehicles',
  },
  {
    title: 'Список персонажей',
    dataIndex: 'characters',
    key: 'characters',
    width: 220,
  },
  {
    title: 'Список планет',
    dataIndex: 'planets',
    key: 'planets',
  },
  {
    title: 'URL',
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
  return swapiStore.querySawpiPagination('https://swapi.dev/api/films', params);
};

const putDataInStore = (data: IFilmData[]) => {
  (swapiFilms.value as ISwapiData).results = data;
};

const getModalNames = (record: { [x: string]: any }) => {
  return Object.keys(record).filter((key) => Array.isArray(record[key]));
};

type ModalData = Record<ResourcesTypeFilm, any[]>;
type ModalOpen = Record<ResourcesTypeFilm, boolean>;

const modalData: ModalData = reactive({
  [ResourcesTypeFilm.Planets]: [],
  [ResourcesTypeFilm.Species]: [],
  [ResourcesTypeFilm.Starships]: [],
  [ResourcesTypeFilm.Vehicles]: [],
  [ResourcesTypeFilm.Characters]: [],
});

const modalOpen: ModalOpen = reactive({
  [ResourcesTypeFilm.Planets]: false,
  [ResourcesTypeFilm.Species]: false,
  [ResourcesTypeFilm.Starships]: false,
  [ResourcesTypeFilm.Vehicles]: false,
  [ResourcesTypeFilm.Characters]: false,
});

const showModal = async (recordData: string[], modalName: ResourcesTypeFilm) => {
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

const closeModal = (modalName: ResourcesTypeFilm) => {
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
              @click="showModal(record[modalName], modalName as ResourcesTypeFilm)"
              >Посмотреть {{ modalName }}</a-button
            >
            <p v-else>нет данных</p>
          </template>
        </template>
      </template>
    </swapi-table>

    <swapi-modal
      :isOpen="modalOpen.species"
      :loading="loadingModal"
      :content="modalData.species"
      :modulName="ResourcesTypeFilm.Species"
      @close="closeModal"
    >
      <template #content="{ item }">
        <a-list-item>
          <a-card :title="item.name">
            <div>
              <b>{{ item.classification }} </b> Классификация этого вида, например, «млекопитающее»
              или «рептилия».".
            </div>
            <div>
              <b>{{ item.designation }} </b> Обозначение этого вида, например, «чувствительный».".
            </div>
            <div>
              <b>{{ item.average_lifespan }} </b> Средний рост этого вида в сантиметрах.".
            </div>
            <div>
              <b>{{ item.homeworld }} </b> URL-адрес ресурса планеты, планеты, с которой произошел
              этот вид.".
            </div>
            <div>
              <b>{{ item.language }} </b> Язык этого вида.".
            </div>
          </a-card>
        </a-list-item>
      </template>
    </swapi-modal>

    <swapi-modal
      :isOpen="modalOpen.planets"
      :loading="loadingModal"
      :content="modalData.planets"
      :modulName="ResourcesTypeFilm.Planets"
      @close="closeModal"
    >
      <template #content="{ item }">
        <a-list-item>
          <a-card :title="item.title">
            <div>
              <b>{{ item.diameter }} </b> Диаметр этой планеты в километрах.".
            </div>
            <div>
              <b>{{ item.rotation_period }} </b> Число стандартных часов, за которое планета
              совершает один оборот вокруг своей оси..
            </div>
            <div>
              <b>{{ item.orbital_period }} </b> Число стандартных дней, необходимое этой планете,
              чтобы совершить один оборот вокруг своей местной звезды.
            </div>
            <div>
              <b>{{ item.population }} </b> The average population of sentient beings inhabiting
              this planet
            </div>
          </a-card>
        </a-list-item>
      </template>
    </swapi-modal>

    <swapi-modal
      :isOpen="modalOpen.planets"
      :loading="loadingModal"
      :content="modalData.planets"
      :modulName="ResourcesTypeFilm.Planets"
      @close="closeModal"
    >
      <template #content="{ item }">
        <a-list-item>
          <a-card :title="item.title">
            <div>
              <b>{{ item.diameter }} </b> Диаметр этой планеты в километрах.".
            </div>
            <div>
              <b>{{ item.rotation_period }} </b> Число стандартных часов, за которое планета
              совершает один оборот вокруг своей оси..
            </div>
            <div>
              <b>{{ item.orbital_period }} </b> Число стандартных дней, необходимое этой планете,
              чтобы совершить один оборот вокруг своей местной звезды.
            </div>
            <div>
              <b>{{ item.population }} </b> The average population of sentient beings inhabiting
              this planet
            </div>
          </a-card>
        </a-list-item>
      </template>
    </swapi-modal>

    <swapi-modal
      :isOpen="modalOpen.characters"
      :loading="loadingModal"
      :content="modalData.characters"
      :modulName="ResourcesTypeFilm.Characters"
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
      :isOpen="modalOpen.vehicles"
      :loading="loadingModal"
      :content="modalData.vehicles"
      :modulName="ResourcesTypeFilm.Vehicles"
      @close="closeModal"
    >
      <template #content="{ item }">
        <a-list-item>
          <a-card :title="item.name">
            <div>
              <b>{{ item.model }} </b> Модель или официальное название этого автомобиля. Такие как
              «Вездеходный ударный транспорт».
            </div>
            <div>
              <b>{{ item.vehicle_class }} </b> Класс этой машины, например «Колесный» или
              «Репульсор».
            </div>
            <div>
              <b>{{ item.manufacturer }} </b> Производитель данного автомобиля. Через запятую, если
              их больше одного.
            </div>
            <div>
              <b>{{ item.cost_in_credits }} </b> Стоимость данной машины новая, в Галактических
              кредитах.
            </div>
          </a-card>
        </a-list-item>
      </template>
    </swapi-modal>
  </template>
</template>
