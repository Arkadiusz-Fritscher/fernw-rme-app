<script setup>
import { computed } from 'vue';

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },

  attributes: {
    type: Object,
    required: true,
  },
});

const buildingThumbnail = computed(() => {
  return props.attributes.thumbnail?.data ? props.attributes.thumbnail.data.attributes.url : 'placeholder/noImg@1x.png';
});
</script>

<template>
  <q-card square flat class="cursor-pointer" @click="$router.push({ name: 'building', params: { id } })">
    <q-card-section class="absolute-top-right" style="z-index: 2">
      <q-badge color="secondary" text-color="yellow-1" rounded :label="attributes.type" class="q-px-sm q-py-xs" />
    </q-card-section>

    <q-img :src="buildingThumbnail">
      <div v-if="attributes.thumbnail?.data" class="absolute-top img-overlay"></div>
    </q-img>

    <q-item>
      <q-item-section top>
        <q-item-label lines="1" class="text-h5 text-weight-medium">{{ attributes.barcode }}</q-item-label>
        <q-item-label lines="1" caption>{{ attributes.location }}</q-item-label>
        <q-item-label lines="2" class="text-body2 q-pt-sm">{{ attributes.description }}</q-item-label>
      </q-item-section>

      <!-- <q-item-section top side class="col-3">
        <q-item-label caption>Entfernung</q-item-label>
        <q-item-label class="text-body2 q-mb-sm">
          <q-badge outline color="primary" label="640m" />
        </q-item-label>
      </q-item-section> -->
    </q-item>
  </q-card>
</template>

<style scoped>
.img-overlay {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
  height: 30%;
}
</style>
