<script setup></script>

<template>
  <q-input outlined>
    <template v-for="(_, slot) of $slots" :key="slot" #[slot]>
      <slot :name="slot"></slot>
    </template>
  </q-input>
</template>

<style scoped></style>
