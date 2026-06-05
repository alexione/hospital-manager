<template>
  <v-navigation-drawer
    v-model="drawerState"
    :expand-on-hover="!isMobile"
    :rail="!isMobile"
    :permanent="!isMobile"
    color="primary"
  >
    <v-list>
      <v-list-item title="Hospital Manager" subtitle="v1.0.0">
        <template v-slot:prepend>
          <v-avatar color="white" class="text-primary font-weight-bold">
            HM
          </v-avatar>
        </template>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
        to="/dashboard"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-injury"
        title="Pacienți"
        to="/patients"
      ></v-list-item>

      <v-list-item
        v-if="showStructure"
        prepend-icon="mdi-hospital-building"
        title="Structură (Paturi/Saloane)"
        to="/structure"
      ></v-list-item>
      
      <v-list-item
        prepend-icon="mdi-file-document-edit"
        title="Internări / Externări"
        to="/admissions"
      ></v-list-item>

      <div v-if="isAdmin">
        <v-divider class="my-2"></v-divider>

        <v-list-item
          prepend-icon="mdi-shield-crown"
          title="ADMINISTRARE"
          class="text-uppercase font-weight-bold text-medium-emphasis"
          style="pointer-events: none"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-account-group"
          title="Personal Medical"
          to="/employees"
        ></v-list-item>
      </div>
    </v-list>

    <template v-slot:append>
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-logout"
          title="Deconectare"
          value="logout"
          base-color="red"
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
