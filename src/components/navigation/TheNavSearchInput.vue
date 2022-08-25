<script setup>
import { useBuildingStore } from 'src/stores/building-store';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
defineProps({
  isDesktop: {
    type: Boolean,
    required: true,
  },
});

const $buildingStore = useBuildingStore();
const $router = useRouter();

const searchInput = ref('');
const searchOptions = ref([]);
const isLoading = ref(false);
const desktopSearchElement = ref(null);

const handleSearchInput = async (value, update) => {
  if (!value || value.length < 2) {
    update(() => {
      searchOptions.value = [];
    });
    isLoading.value = false;
    return;
  }

  isLoading.value = true;

  const searchResult = await findBuildings(value);

  if (!searchResult) {
    update(() => {
      searchOptions.value = [];
    });
    isLoading.value = false;
    return;
  }

  update(() => {
    searchOptions.value = searchResult;
  });

  isLoading.value = false;
  return;
};

const findBuildings = async (barcode) => {
  const storedBuildings = $buildingStore.buildings.filter((building) =>
    building.attributes.barcode?.toLowerCase().includes(barcode.toLowerCase())
  );

  if (storedBuildings.length) {
    return storedBuildings;
  } else {
    try {
      const { data } = await $buildingStore.getBuildings({
        pagination: {
          pageSize: 5,
        },
        filters: {
          barcode: {
            $containsi: barcode,
          },
        },
        fields: ['barcode'],
      });

      if (!data) return [];
      return data;
    } catch (err) {
      console.error(err.message);
    }
  }
};

const resetSearch = (event, scope) => {
  desktopSearchElement.value.blur();
  searchInput.value = '';
  searchOptions.value = [];

  $router.push({ name: 'building', params: { id: scope.opt.id } });
};
</script>

<template>
  <!-- Desktop search -->
  <q-select
    v-if="isDesktop"
    ref="desktopSearchElement"
    v-model="searchInput"
    :loading="isLoading"
    outlined
    dense
    use-input
    hide-dropdown-icon
    :options="searchOptions"
    @filter="handleSearchInput"
  >
    <template #option="scope">
      <q-item v-bind="scope.itemProps" @click="resetSearch($event, scope)">
        <q-item-section>
          <q-item-label>{{ scope.opt.attributes?.barcode }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-if="searchInput" #selected>
      {{ searchInput.attributes.barcode ? searchInput.attributes.barcode : searchInput }}
    </template>

    <template #append>
      <q-icon name="mdi-magnify" @click.stop.prevent />
    </template>

    <template #no-option>
      <q-item>
        <q-item-section class="text-grey"> No results </q-item-section>
      </q-item>
    </template>
  </q-select>

  <!-- Mobile search -->
  <q-btn v-else id="search-btn" icon="mdi-magnify" flat round />
</template>

<style scoped>
.q-select {
  min-width: 240px;
}
</style>
