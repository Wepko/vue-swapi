<template>
  <a-layout class="layout">
    <a-layout-header>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1">
          <router-link :to="`/`"></router-link>
          <span class="logo">
            <i-logo />
          </span>
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 28px 0"> </a-breadcrumb>
      <div
        :style="{
          background: '#fff',
          padding: '24px',
          minHeight: '80vh',
          height: 'auto',
          overflow: 'hidden',
        }"
      >
        <router-view />
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Ant Design ©2018 Created by Ant UED
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import ILogo from './components/ILogo.vue';
const selectedKeys = ref<string[]>(['2']);
</script>

<style scoped>
.site-layout-content {
  min-height: 280px;
  padding: 24px;
  background: #fff;
}

[data-theme='dark'] .site-layout-content {
  background: #141414;
}

.logo {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
}

.logo svg {
  display: flex;
  align-items: center;
}
</style>