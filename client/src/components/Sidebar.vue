<template>
  <v-navigation-drawer
    v-model="drawerState"
    expand-on-hover
    permanent
    rail
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
          title="Utilizatori"
          to="/users"
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
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const drawerState = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const authStore = useAuthStore();
const router = useRouter();

const isAdmin = computed(() => authStore.isAdmin);

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>
