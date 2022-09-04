<script setup>
import { useMeta } from 'quasar';
import { onMounted, onUpdated, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useBuildingStore } from 'src/stores/building-store';
import BaseButton from 'src/components/base/BaseButton.vue';
import BuildingUploadModal from 'src/components/building/BuildingUploadModal.vue';
const $route = useRoute();

// Page Meta
const metaData = {
  title: $route.params.title || 'Bauwerk Details',
  titleTemplate: (title) => `${title}`,

  meta: {
    description: { name: 'Login Page', content: 'Nothing but Login' },
  },
};
useMeta(metaData);

const building = ref({});
const $buildingStore = useBuildingStore();
const isUploadModalOpen = ref(false);
const isLoading = computed(() => {
  return $buildingStore.isFetching || !Object.keys(building.value).includes('id');
});

const buildingData = computed(() => {
  return [
    {
      label: 'Barcode',
      data: building.value.attributes?.barcode,
    },
    {
      label: 'Adresse',
      data: building.value.attributes?.location,
    },
    {
      label: 'Type',
      data: building.value.attributes?.type,
    },
    {
      label: 'Bemerkung',
      data: building.value.attributes?.description,
    },
  ];
});

onMounted(() => {
  getBuilding();
});

onUpdated(() => {
  getBuilding();
});

const getBuilding = async (id = $route.params.id) => {
  const data = await $buildingStore.getBuilding(id);
  building.value = data;

  replaceStoredBuilding(data);
};

const replaceStoredBuilding = (newBuilding) => {
  const buildingIndex = $buildingStore.buildings.findIndex((building) => building.id === newBuilding.id);

  if (buildingIndex !== -1) {
    $buildingStore.buildings[buildingIndex] = newBuilding;
  } else {
    $buildingStore.buildings.push(newBuilding);
  }
};

const buildingThumbnail = computed(() => {
  return building.value.attributes.thumbnail?.data
    ? building.value.attributes.thumbnail.data.attributes.url
    : 'placeholder/noImg@1x.png';
});
</script>

<template>
  <q-page>
    <div v-if="isLoading" class="flex justify-center items-center" style="min-height: inherit">
      <q-inner-loading
        :showing="isLoading"
        color="secondary"
        label="Bauwerk wird geladen..."
        label-class="text-secondary"
      />
    </div>

    <template v-else>
      <header>
        <q-img
          :src="buildingThumbnail"
          width="100%"
          :ratio="$q.screen.gt.sm ? 21 / 9 : 4 / 3"
          :fit="building.attributes.thumbnail?.data ? 'cover' : 'contain'"
        />
        <section class="building__data">
          <div v-for="(entry, i) of buildingData" :key="i" class="building__data__entry">
            <span class="text-caption text-weight-medium text-grey-7">{{ entry.label }}</span>
            <p class="text-body2">{{ entry.data || '' }}</p>
          </div>
        </section>
        <q-separator />
      </header>

      <main>
        <template v-if="building.attributes.images.data">
          <div class="building__gallery">
            <q-img
              v-for="image of building.attributes.images?.data"
              :key="image.id"
              :src="image.attributes.url"
              :alt="image.attributes.alternativeText"
            />
          </div>
        </template>

        <template v-else>
          <div class="q-mx-auto q-my-xl text-center">
            <p class="text-weight-regular text-grey-7">Zu diesem Bauwerkt wurden noch keine Bilder hinzugefügt.</p>
            <BaseButton label="Jetzt Bilder hinzufügen" @click="isUploadModalOpen = true" />
          </div>
        </template>
      </main>
    </template>
    <BuildingUploadModal v-model="isUploadModalOpen" :building="building" />
  </q-page>
</template>

<style scoped lang="scss">
.building__data {
  margin-top: 1em;
  margin-inline: 1em;
}

.building__gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(400px, 100%), 1fr));
  gap: 0.5em;
}

@media (min-width: 440px) {
  .building__data {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    justify-content: space-between;
  }
}

@media (min-width: 600px) {
  .building__data__entry {
    flex: 1 0 40%;
  }
}

@media (min-width: 900px) {
  .building__data__entry {
    flex: 1 1 20%;

    &:last-child {
      flex: 1 1 30%;
    }
  }
}

@media (min-width: calc(1440px + 2em)) {
  .building__data,
  .building__gallery {
    margin-inline: 0px;
  }
}
</style>
