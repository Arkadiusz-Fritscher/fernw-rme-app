<script setup>
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { useUserStore } from 'src/stores/user-store';
import LogoSmall from 'src/assets/img/LogoSmall.vue';
import LogoLarge from 'src/assets/img/LogoLarge.vue';
import TheNavSearchInput from './TheNavSearchInput.vue';

const $q = useQuasar();
const $userStore = useUserStore();

const isDesktop = computed(() => {
  return $q.screen.gt.sm;
});

const activeLink = ref(null);
const menuLinks = [
  {
    name: 'home',
    label: 'Start',
    url: { name: 'home' },
  },
  {
    name: 'sort',
    label: 'Bilder sortieren',
    url: { name: 'sort' },
  },
  {
    name: 'test',
    label: 'Test',
    url: { name: 'test' },
  },
  {
    name: 'buildings',
    label: 'Bauwerke',
    url: { name: 'buildings' },
  },
];
</script>

<template>
  <q-toolbar>
    <!-- Logo -->
    <router-link :to="{ name: 'home' }" class="logo">
      <LogoLarge v-if="isDesktop" />
      <LogoSmall v-else />
    </router-link>

    <!-- Section title -->
    <q-toolbar-title v-if="!isDesktop" class="text-subtitle2">
      {{ $route.meta?.title || $route.params?.title }}
    </q-toolbar-title>

    <q-space v-if="isDesktop" />

    <!-- Desktop Navigation Tabs -->
    <q-tabs v-if="isDesktop" v-model="activeLink" no-caps>
      <q-route-tab v-for="link of menuLinks" :key="link.name" :label="link.label" :name="link.name" :to="link.url" />
      <q-tab label="Logout" name="logout" @click="$userStore.logout()" />
    </q-tabs>

    <q-space v-if="isDesktop" />

    <!-- Search -->
    <TheNavSearchInput :is-desktop="isDesktop" />

    <!-- Mobile Menu -->
    <q-btn v-if="!isDesktop" icon="mdi-menu" flat round />
  </q-toolbar>
</template>

<style scoped>
.logo {
  display: block;
}
</style>
