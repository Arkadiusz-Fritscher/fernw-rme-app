<script setup>
import { reactive, ref } from 'vue';
import BaseInput from 'src/components/base/BaseInput.vue';
import BaseButton from 'src/components/base/BaseButton.vue';
import { useUserStore } from '../../stores/user-store';
import { useRouter } from 'vue-router';
import LogoFull from '../../assets/img/LogoFull.vue';

const $userStore = useUserStore();
const $router = useRouter();

const formInput = reactive({ username: null, password: null });
const showPassword = ref(false);
const savePassword = ref(false);

const handleFormSubmit = async () => {
  await $userStore.login(formInput.username, formInput.password, savePassword.value);
  $router.push({ name: 'home' });
};
</script>

<template>
  <q-form flat class="login-form" @submit.prevent="handleFormSubmit">
    <div class="logo-container">
      <LogoFull />
    </div>
    <h1 class="text-center text-h5 text-weight-bold">Willkommen zu Fernwärme Monteur</h1>

    <BaseInput
      v-model="formInput.username"
      label="Nutzername"
      :rules="[(val) => (val !== null && val !== '') || `Nutzername darf nicht leer sein.`]"
      class="q-mb-sm"
    ></BaseInput>

    <BaseInput
      v-model="formInput.password"
      label="Passwort"
      :type="showPassword ? 'text' : 'password'"
      :rules="[(val) => (val !== null && val !== '') || `Passwort darf nicht leer sein.`]"
    >
      <template #append>
        <q-icon
          :name="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          class="cursor-pointer"
          @click="showPassword = !showPassword"
        />
      </template>
    </BaseInput>

    <BaseButton type="submit" label="Anmelden" class="full-width" />
    <q-checkbox v-model="savePassword" label="Eingeloggt bleiben" style="margin-left: -8px" />

    <p class="q-mb-sm">Noch nicht Angemeldet? <router-link to="/">Hier</router-link> registrieren.</p>
    <p><router-link to="/">Password vergessen?</router-link></p>
  </q-form>
</template>

<style scoped lang="scss">
.login-form {
  width: calc(100% - 16px);
  max-width: 400px;
}

.logo-container > * {
  width: 40vw;
  max-width: 140px;
}
</style>
