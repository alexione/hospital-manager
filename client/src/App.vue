<template>
  <v-app>
    <router-view></router-view>

    <v-snackbar
      v-model="snackbar.visible"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="top right" 
    >
      {{ snackbar.message }}

      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.hide">Închide</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { useSnackbarStore } from './store/snackbar';
const snackbar = useSnackbarStore();
</script>