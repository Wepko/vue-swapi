<template>
  <a-table
    :columns="columns"
    :data-source="list"
    :pagination="pagination"
    :loading="loadingTable"
    @change="handleTableChange"
    :scroll="{ x: 3100, y: 600 }"
    bordered
  >
    <template #bodyCell="{ column, record }">
      <!-- {{ column }} -->
      <slot
        name="content"
        v-bind="{ column, record }"
      />
    </template>
  </a-table>
</template>
  
<script lang="ts" setup>
import { defineProps, computed, reactive, ref, onMounted } from 'vue';
import { addNumberToItems } from '@/helpers/helpers';

const props = defineProps({
  columns: Array,
  data: Array,
  queryOnData: Function,
  onReturnData: Function,
});

const loadingTable = ref(false);

const list = reactive([]);
let count = ref(0);
let current = ref(1);
const pagination = computed(() => ({ total: count.value, current: current.value }));

const getDataAndUpdate = (paginate: { current: any }) => {
  loadingTable.value = true;
  list.splice(0, list.length);
  console.log('loading', loadingTable.value);
  if (props && props.queryOnData) {
    props
      .queryOnData({ page: paginate.current })
      .then((response: { data: any; count: number; results: any }) => {
        current.value = paginate.current;
        count.value = response.data.count;
        const results = addNumberToItems(response.data.results);
        list.push(...(results as []));
        loadingTable.value = false;
        if (props.onReturnData) {
          props.onReturnData(list);
        }
      });
  }
};

const handleTableChange = (paginate: { current: any }) => {
  getDataAndUpdate(paginate);
};

onMounted(() => {
  getDataAndUpdate({ current: 1 });
});
</script>

  
<style scoped></style>

