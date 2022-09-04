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
  const { data, meta } = await $buildingStore.getBuildings({
    pagination: {
      pageSize: 20,
    },
  });
  $buildingStore.buildings.push(...data);
  $buildingStore.fetchMeta = meta;
};

onBeforeMount(() => {
  initialFetch();
});

const loadMoreContent = async (index, done) => {
  if (buildings.value.length > 0) {
    const { data } = await $buildingStore.getMoreBuildings();
    $buildingStore.buildings.push(...data);
    done();
  } else {
    done((stop) => true);
  }
};

const buildings = computed(() => {
  if (!$buildingStore.buildings.length) return [];
  return $buildingStore.buildings;
});
</script>

<template>
  <q-page id="building-list">
    <q-infinite-scroll debounce="300" :offset="180" @load="loadMoreContent">
      <div class="building-list">
        <BuildingCard
          v-for="building in buildings"
          :id="building.id"
          :key="building.id"
          :attributes="building.attributes"
        />
      </div>

      <template #loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>

    <!-- <div class="q-pa-lg flex flex-center">
      <q-pagination v-model="$buildingStore.paginationPage" color="primary" v-bind="paginationSetup" boundary-links />
    </div> -->
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
