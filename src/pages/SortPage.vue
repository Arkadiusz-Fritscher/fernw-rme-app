<script setup>
import { useMeta } from 'quasar';
import { productName } from '/package.json';
import { useBuildingStore } from 'src/stores/building-store';
import { onBeforeMount } from 'vue';

// Page Meta
const metaData = {
  title: 'Bilder sortieren',
  titleTemplate: (title) => `${title} - ${productName}`,

  meta: {
    description: { name: 'Bilder sortieren', content: 'Nothing but Login' },
  },
};
useMeta(metaData);

const $buildingStore = useBuildingStore();

onBeforeMount(() => {
  if (!$buildingStore.loadedAllBuildings) {
    $buildingStore.getAllBuildings();
  }
});
</script>

<template>
  <q-page padding>
    <div style="max-width: 80vw">
      <pre>{{ $buildingStore.buildings }}</pre>
    </div>
  </q-page>
</template>

<style scoped></style>
