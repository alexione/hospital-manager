<template>
  <v-app>
    <NuxtPage />

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
const snackbar = useSnackbarStore();
</script>

<style>
/* Stiluri globale pentru intreaga aplicatie */
html, body {
  overflow-x: hidden !important;
  width: 100%;
}

body, .v-application {
  font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  background-color: #F8FAFC !important;
  overflow-x: hidden !important;
}

/* Scrollbar personalizat elegant */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #F1F5F9;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: #CBD5E1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94A3B8;
}

/* Clasa helper pentru umbre fine premium (soft shadows) */
.shadow-soft {
  box-shadow: 0 4px 20px -2px rgba(50, 50, 93, 0.05), 0 2px 8px -1px rgba(0, 0, 0, 0.02) !important;
}

.shadow-premium {
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 5px 15px -5px rgba(0, 0, 0, 0.02) !important;
}

/* Tranzitii uniforme la interactiuni */
.transition-all-fast {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Efect de zoom discret la hover */
.hover-scale {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
.hover-scale:hover {
  transform: translateY(-2px) scale(1.01);
}

/* Header modal cu gradient premium */
.modal-header-gradient {
  background: linear-gradient(135deg, #4F46E5 0%, #3730A3 100%) !important;
  color: white !important;
}

/* Bilet / Card cu gradient subtil pentru statistici */
.card-stat-gradient-blue {
  background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%) !important;
  border: 1px solid #BFDBFE !important;
}

.card-stat-gradient-orange {
  background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%) !important;
  border: 1px solid #FED7AA !important;
}

.card-stat-gradient-teal {
  background: linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%) !important;
  border: 1px solid #99F6E4 !important;
}
</style>
