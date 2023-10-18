<script lang="ts" setup>
import SwapiTable from '@/components/SwapiTable.vue';
import SwapiLoader from '@/components/SwapiLoader.vue';
import SwapiModal from '@/components/SwapiModal.vue';

import { ManOutlined, WomanOutlined } from '@ant-design/icons-vue';

import useSwapiStore from '@/stores/api';
import { reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { type IPeopleData, ResourcesTypePeople } from '@/types';
import { TableColumnsType } from 'ant-design-vue';

interface ISwapiData {
  results: IPeopleData[];
}

const swapiStore = useSwapiStore();
const { swapiPeople, loading, loadingModal } = storeToRefs(swapiStore);
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
    title: 'Имя персонажа',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Дата рожденгия',
    dataIndex: 'birth_year',
    key: 'birth_year',
  },
  {
    title: 'Цвет глаз',
    dataIndex: 'eye_color',
    key: 'eye_color',
  },
  {
    title: 'Пол',
    dataIndex: 'gender',
    key: 'gender',
  },
  {
    title: 'Цвет волос',
    dataIndex: 'hair_color',
    key: 'hair_color',
  },
  {
    title: 'Рост (см)',
    dataIndex: 'height',
    key: 'height',
  },
  {
    title: 'Вес (кг)',
    dataIndex: 'mass',
    key: 'mass',
  },
  {
    title: 'Цвет кожи',
    dataIndex: 'skin_color',
    key: 'skin_color',
  },
  {
    title: 'Родная планета',
    dataIndex: 'homeworld',
    key: 'homeworld',
  },
  {
    title: 'Фильмы',
    dataIndex: 'films',
    key: 'films',
  },
  {
    title: 'Расса',
    dataIndex: 'species',
    key: 'species',
  },
  {
    title: 'Зведный корабль',
    dataIndex: 'starships',
    key: 'starships',
  },
  {
    title: 'Зведный траспортные средства',
    dataIndex: 'vehicles',
    key: 'vehicles',
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
  return swapiStore.querySawpiPagination('https://swapi.dev/api/people/', params);
};

const putDataInStore = (data: IPeopleData[]) => {
  (swapiPeople.value as ISwapiData).results = data;
};

const getModalNames = (record: { [x: string]: any }) => {
  return Object.keys(record).filter((key) => Array.isArray(record[key]));
};

type ModalData = Record<ResourcesTypePeople, any[]>;
type ModalOpen = Record<ResourcesTypePeople, boolean>;

const modalData: ModalData = reactive({
  [ResourcesTypePeople.Films]: [],
  [ResourcesTypePeople.Species]: [],
  [ResourcesTypePeople.Starships]: [],
  [ResourcesTypePeople.Vehicles]: [],
});

const modalOpen: ModalOpen = reactive({
  [ResourcesTypePeople.Films]: false,
  [ResourcesTypePeople.Species]: false,
  [ResourcesTypePeople.Starships]: false,
  [ResourcesTypePeople.Vehicles]: false,
});

const showModal = async (recordData: string[], modalName: ResourcesTypePeople) => {
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

const closeModal = (modalName: ResourcesTypePeople) => {
  modalOpen[modalName] = false;
};

const dateForamte = (data: string) => moment(data).format('DD.MM.YYYY');

const colorForamt = (color) => {
  const colorsExeption = ['white', 'blue-gray'];
  if (colorsExeption.includes(color)) return 'default';
  return color;
};
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
        <template v-if="column.key === 'eye_color'">
          <a-tag :color="colorForamt(record.eye_color)">{{ record.eye_color }}</a-tag>
        </template>
        <template v-if="column.key == 'gender'">
          <div v-if="record.gender === 'male'">
            <ManOutlined />
          </div>
          <div v-else-if="record.gender === 'female'">
            <WomanOutlined />
          </div>
          <div v-else>
            {{ record.gender }}
          </div>
        </template>
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
              @click="showModal(record[modalName], modalName as ResourcesTypePeople)"
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
      :modulName="ResourcesTypePeople.Species"
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
      :isOpen="modalOpen.films"
      :loading="loadingModal"
      :content="modalData.films"
      :modulName="ResourcesTypePeople.Films"
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

    <swapi-modal
      :isOpen="modalOpen.starships"
      :loading="loadingModal"
      :content="modalData.starships"
      :modulName="ResourcesTypePeople.Starships"
      @close="closeModal"
    >
      <template #content="{ item }">
        <a-list-item>
          <a-card :title="item.name">
            <div>
              <b>{{ item.model }} </b> Модель или официальное название этого звездолета. Такие как
              «Т-65 X-wing» или «Орбитальная боевая станция ДС-1»
            </div>
            <div>
              <b>{{ item.starship_class }} </b> Класс этого звездолета, например «Звездный
              истребитель» или «Мобильная боевая станция глубокого космоса».»
            </div>
            <div>
              <b>{{ item.cost_in_credits }} </b> Стоимость этого звездолета новая, в галактических
              кредитах.
            </div>
            <div>
              <b>{{ item.crew }} </b> Количество персонала, необходимого для управления или
              пилотирования этого звездолета.
            </div>
          </a-card>
        </a-list-item>
      </template>
    </swapi-modal>

    <swapi-modal
      :isOpen="modalOpen.vehicles"
      :loading="loadingModal"
      :content="modalData.vehicles"
      :modulName="ResourcesTypePeople.Vehicles"
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