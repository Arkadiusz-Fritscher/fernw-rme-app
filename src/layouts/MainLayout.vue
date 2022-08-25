<script setup>
import TheMainNavbar from 'src/components/navigation/TheMainNavbar.vue';
</script>

<template>
  <q-layout id="layout" view="hHh lpR fFf">
    <q-header bordered class="bg-white text-dark">
      <TheMainNavbar />
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
