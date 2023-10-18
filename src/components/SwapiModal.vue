<template>
  <a-modal
    v-bind:open="isOpen"
    width="100%"
    :title="`Модальное окно ${modulName}`"
    wrap-class-name="full-modal"
    @change="handleChange"
    @ok="handleOk()"
  >
    <div
      v-if="loading"
      class="loading"
    >
      <swapi-loader></swapi-loader>
    </div>

    <a-list
      v-else
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 3 }"
      :data-source="content"
    >
      <template #renderItem="{ item }">
        <slot
          name="content"
          v-bind="{ item }"
        />
      </template>
    </a-list>
  </a-modal>
</template>
<!--  -->
  
<script lang="ts" setup>
import { defineEmits } from 'vue';
import SwapiLoader from './SwapiLoader.vue';

const props = defineProps({
  isOpen: Boolean,
  close: Function,
  loading: Boolean,
  content: Array,
  modulName: String,
});

const emit = defineEmits(['close', 'submit']);

function handeClose(param: string | undefined) {
  emit('close', param);
}

function handleChange() {
  handeClose(props.modulName);
}

function handleOk() {
  handeClose(props.modulName);
}
</script>

  
<style scoped></style>