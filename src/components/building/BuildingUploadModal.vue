<script setup>
import { ref } from 'vue';

defineProps({
  building: {
    type: Object,
    required: true,
  },
});

const files = ref([]);
const isUploading = ref(false);
const updateFiles = ref();
const canUpload = ref(true);

const upload = () => {
  console.log('upload images...');
};
</script>

<template>
  <teleport to="body">
    <q-dialog persistent v-bind="$attrs">
      <q-card>
        <q-card-section>
          <div class="text-h5">
            Fotos
            <span v-if="building.attributes?.type && building.attributes.barcode">
              {{ `zu ${building.attributes.type} ${building.attributes.barcode}` }}
            </span>
            hochladen
          </div>
        </q-card-section>

        <q-card-section>
          <!-- Filepicker -->
          <q-file v-model="files" label="Fotos auswählen" outlined multiple accept="image/jpeg" clearable>
            <template #file="{ index, file }">
              <q-chip
                class="full-width q-my-xs"
                :removable="isUploading && uploadProgress[index].percent < 1"
                square
                @remove="cancelFile(index)"
              >
                <!-- <q-linear-progress
                  class="absolute-full full-height"
                  :value="uploadProgress[index].percent"
                  :color="uploadProgress[index].color"
                  track-color="grey-2"
                /> -->

                <!-- <q-avatar>
                  <q-icon :name="uploadProgress[index].icon" />
                </q-avatar> -->

                <div class="ellipsis relative-position">
                  {{ file.name }}
                </div>

                <q-tooltip>
                  {{ file.name }}
                </q-tooltip>
              </q-chip>
            </template>

            <template v-if="canUpload" #after>
              <q-btn
                color="primary"
                dense
                icon="mdi-upload"
                round
                :disable="!canUpload"
                :loading="isUploading"
                @click="upload"
              />
            </template>
          </q-file>
        </q-card-section>
      </q-card>
    </q-dialog>
  </teleport>
</template>

<style scoped>
.q-card {
  width: 100%;
  max-width: 500px;
}
</style>
