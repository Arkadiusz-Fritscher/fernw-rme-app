<script setup>
import { useMeta } from 'quasar';
import { productName } from '/package.json';
import TheLoginForm from 'src/components/login/TheLoginForm.vue';
// Page Meta
const metaData = {
  title: 'Anmelden',
  titleTemplate: (title) => `${title} - ${productName}`,

  meta: {
    description: { name: 'Login Page', content: 'Nothing but Login' },
  },
};
useMeta(metaData);
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page padding>
        <TheLoginForm class="absolute-center" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
