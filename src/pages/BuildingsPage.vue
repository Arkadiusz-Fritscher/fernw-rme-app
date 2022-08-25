<script setup>
import { onBeforeMount, ref } from 'vue';
import { useMeta } from 'quasar';
import { productName } from '/package.json';
import { useBuildingStore } from 'src/stores/building-store';
import BuildingCard from 'src/components/building/BuildingCard.vue';
import { computed } from 'vue';
// Start Meta
const metaData = {
  title: 'Bauwerke',
  titleTemplate: (title) => `${title} - ${productName}`,

  meta: {
    description: { name: 'Login Page', content: 'Nothing but Login' },
  },
};
useMeta(metaData);
// End Meta

const $buildingStore = useBuildingStore();

const initialFetch = async () => {
  if ($buildingStore.buildings.length) return;
  const { data, meta } = await $buildingStore.getBuildings();
  $buildingStore.buildings.push(...data);
  $buildingStore.fetchMeta = meta;
};

onBeforeMount(() => {
  initialFetch();
});

// Pagination
const maxItems = 34;

const paginationSetup = computed(() => {
  return { max: Math.round($buildingStore.buildings.length / maxItems) || 1, 'max-pages': 6 };
});

const paginationArray = computed(() => {
  const startIndex = $buildingStore.paginationPage === 1 ? 0 : $buildingStore.paginationPage * maxItems - maxItems - 1;
  const endIndex = startIndex + (maxItems - 1) >= $buildingStore.buildings.length ? -1 : startIndex + maxItems;

  return $buildingStore.buildings.slice(startIndex, endIndex) || [];
});
</script>

<template>
  <q-page id="building-list">
    <div class="building-list">
      <BuildingCard
        v-for="building in paginationArray"
        :id="building.id"
        :key="building.id"
        :attributes="building.attributes"
      />
    </div>

    <div class="q-pa-lg flex flex-center">
      <q-pagination v-model="$buildingStore.paginationPage" color="primary" v-bind="paginationSetup" boundary-links />
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.building-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, 1fr);
  gap: 0.5em;
  padding-block: 0.5em;
}

@media (min-width: $breakpoint-sm-min) {
  .building-list {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    padding: 1em;
  }
}
</style>
