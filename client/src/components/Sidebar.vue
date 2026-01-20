<template>
  <v-navigation-drawer v-model="drawerState" color="primary" theme="dark">
    <div class="d-flex align-center pa-4">
      <v-avatar color="white" class="mr-3">
        <span class="text-primary font-weight-bold text-h5">HM</span>
      </v-avatar>
      <div>
        <div class="font-weight-bold">Hospital Manager</div>
        <div class="text-caption">v1.0.0</div>
      </div>
    </div>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" to="/dashboard"></v-list-item>
      <v-list-item prepend-icon="mdi-account-injury" title="Pacienți" to="/patients"></v-list-item>
      
      <div v-if="isAdmin">
        <v-divider class="my-2"></v-divider>
        <v-list-subheader>ADMINISTRARE</v-list-subheader>
        <v-list-item prepend-icon="mdi-account-group" title="Utilizatori" to="/users"></v-list-item>
      </div>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn block color="error" variant="text" prepend-icon="mdi-logout" @click="handleLogout">
          Deconectare
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

// 1. Definim props și emits pentru v-model
// Asta permite părintelui (Dashboard) să controleze deschiderea/închiderea
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

// 2. Computed property pentru v-model (Two-way binding)
const drawerState = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

// 3. Logica de Auth
const authStore = useAuthStore();
const router = useRouter();

const isAdmin = computed(() => authStore.isAdmin);

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>