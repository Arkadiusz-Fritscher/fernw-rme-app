<script setup>
import { ref } from 'vue';
import { useBuildingStore } from 'src/stores/building-store';
import useUtils from 'src/composables/useUtils.js';

const props = defineProps({
  building: {
    type: Object,
    required: true,
  },
});

const $buildingStore = useBuildingStore();
const { createFormData } = useUtils();

const files = ref([]);
const isUploading = ref(false);
const uploadProgress = ref([]);
const canUpload = ref(true);

const uploadController = new AbortController();

const thumbnailHasCreated = ref(false);

const cancelUpload = () => {
  console.log('cancel', uploadController.signal);
  uploadController.abort('canceled by user');
};

const upload = () => {
  isUploading.value = true;

  files.value.forEach(async (file, i) => {
    const formData = createFormData(
      file,
      props.building.id,
      props.building.attributes.barcode,
      props.building.attributes.barcode
    );

    const response = await $buildingStore.uploadImages(
      formData,
      { signal: uploadController.signal },
      function (percent) {
        percent < 100 ? (isUploading.value = true) : (isUploading.value = false);
        uploadProgress.value[i] = percent;
      }
    );

    if (!props.building.attributes.thumbnail?.data && !thumbnailHasCreated.value && response.status === 200) {
      setThumbnail(response.data[0].id);
    }
  });

  const setThumbnail = async (thumbnailID) => {
    thumbnailHasCreated.value = true;
    await $buildingStore.updateBuilding(props.building.id, {
      data: {
        thumbnail: thumbnailID,
      },
    });
  };
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
          <q-file
            v-model="files"
            label="Fotos auswählen"
            outlined
            multiple
            accept="image/jpeg"
            :clearable="!isUploading"
          >
            <template #file="{ index, file }">
              <q-chip
                class="full-width q-my-xs"
                :removable="isUploading && uploadProgress[index] < 100"
                square
                @remove="cancelUpload()"
              >
                <q-linear-progress
                  class="absolute-full full-height"
                  :value="uploadProgress[index] / 100 || 0"
                  color="secondary"
                  track-color="grey-2"
                />

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
