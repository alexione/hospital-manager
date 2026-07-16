<template>
  <v-navigation-drawer
    v-model="drawerState"
    :expand-on-hover="!isMobile"
    :rail="!isMobile"
    :permanent="!isMobile"
    color="indigo-darken-4"
    elevation="4"
    width="280"
    class="border-0 shadow-premium"
  >
    <v-list class="py-4">
      <v-list-item class="mb-2">
        <template v-slot:prepend>
          <v-avatar color="white" class="text-indigo-darken-4 font-weight-bold shadow-soft">
            HM
          </v-avatar>
        </template>
        <v-list-item-title class="font-weight-bold text-h6">Hospital Manager</v-list-item-title>
        <v-list-item-subtitle class="text-indigo-lighten-3 font-weight-medium">Sistem Medical</v-list-item-subtitle>
      </v-list-item>
    </v-list>
 
    <v-divider class="border-opacity-15 mb-4"></v-divider>
 
    <v-list density="comfortable" nav class="px-2">
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
        to="/dashboard"
        active-class="bg-indigo-lighten-1 text-white shadow-soft rounded-lg"
        class="mb-1 rounded-lg text-indigo-lighten-4 transition-all-fast"
      ></v-list-item>
      
      <v-list-item
        prepend-icon="mdi-account-injury"
        title="Pacienți"
        to="/patients"
        active-class="bg-indigo-lighten-1 text-white shadow-soft rounded-lg"
        class="mb-1 rounded-lg text-indigo-lighten-4 transition-all-fast"
      ></v-list-item>
 
      <v-list-item
        v-if="showStructure"
        prepend-icon="mdi-hospital-building"
        title="Structură (Paturi/Saloane)"
        to="/structure"
        active-class="bg-indigo-lighten-1 text-white shadow-soft rounded-lg"
        class="mb-1 rounded-lg text-indigo-lighten-4 transition-all-fast"
      ></v-list-item>
      
      <v-list-item
        prepend-icon="mdi-file-document-edit"
        title="Internări / Externări"
        to="/admissions"
        active-class="bg-indigo-lighten-1 text-white shadow-soft rounded-lg"
        class="mb-1 rounded-lg text-indigo-lighten-4 transition-all-fast"
      ></v-list-item>
 
      <div v-if="isAdmin">
        <v-divider class="my-4 border-opacity-15 admin-divider"></v-divider>
 
        <div class="text-overline text-indigo-lighten-3 px-3 mb-2 font-weight-bold admin-section-title">
          ADMINISTRARE
        </div>
 
        <v-list-item
          prepend-icon="mdi-account-group"
          title="Personal Medical"
          to="/employees"
          active-class="bg-indigo-lighten-1 text-white shadow-soft rounded-lg"
          class="rounded-lg text-indigo-lighten-4 transition-all-fast"
        ></v-list-item>
      </div>
    </v-list>
 
    <template v-slot:append>
      <v-divider class="border-opacity-15 my-2"></v-divider>
      <v-list density="comfortable" nav class="px-2 py-4">
        <v-list-item
          prepend-icon="mdi-logout"
          title="Deconectare"
          value="logout"
          color="red-lighten-1"
          class="rounded-lg text-red-lighten-3 hover-bg-red transition-all-fast"
          @click="handleLogout"
        ></v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>
 
<script setup>
import { computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useDisplay } from "vuetify";
 
const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);
 
const drawerState = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
 
const authStore = useAuthStore();
const { smAndDown } = useDisplay();
const isMobile = computed(() => smAndDown.value);
 
const isAdmin = computed(() => authStore.isAdmin);
 
const showStructure = computed(() => {
  const role = authStore.user?.role?.toLowerCase();
  return role === 'admin' || role === 'medic' || role === 'asistent';
});
 
const handleLogout = () => {
  authStore.logout();
  navigateTo("/login");
};
</script>

<style scoped>
/* Ascunde divizorul și titlul secțiunii de administrare când sidebar-ul este restrâns (rail) și nu este hover-uit */
.v-navigation-drawer--rail:not(:hover) .admin-divider,
.v-navigation-drawer--rail:not(:hover) .admin-section-title {
  display: none !important;
}
</style>
