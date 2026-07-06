<template>
  <v-layout class="fill-height">
    
    <Sidebar v-model="drawer" />

    <v-app-bar elevation="0" class="border-b bg-white px-4">
      <v-app-bar-nav-icon @click="drawer = !drawer" color="indigo-darken-4"></v-app-bar-nav-icon>
      <v-app-bar-title class="font-weight-bold text-indigo-darken-4">Gestiune Pacienți</v-app-bar-title>
    </v-app-bar>

    <v-main class="bg-slate-50" style="height: calc(100vh - 64px); overflow: hidden;">
      <v-container fluid class="pa-6 d-flex flex-column" style="height: 100%; overflow: hidden;">
        
        <div class="d-flex align-center justify-space-between mb-6 flex-shrink-0">
          <div>
            <h1 class="text-h4 font-weight-bold text-grey-darken-3">Pacienți</h1>
            <p class="text-subtitle-1 text-grey-darken-1">Administrați fișele și înregistrările pacienților spitalului</p>
          </div>
          <v-btn 
            color="primary" 
            prepend-icon="mdi-plus" 
            size="large" 
            class="rounded-lg shadow-soft text-none font-weight-bold"
            @click="openDialog"
          >
            Adaugă Pacient
          </v-btn>
        </div>

        <v-card class="rounded-xl shadow-soft border-0 d-flex flex-column flex-grow-1 overflow-hidden" elevation="0">
          <v-card-item class="py-4 border-b flex-shrink-0">
            <v-card-title class="font-weight-bold text-grey-darken-3">Lista Pacienți</v-card-title>
          </v-card-item>

          <v-data-table 
            :headers="headers" 
            :items="patients" 
            :loading="loading" 
            class="pa-4 bg-transparent flex-grow-1 overflow-y-auto"
            fixed-header
            height="100%"
          >
            <template v-slot:item.image="{ item }">
              <v-avatar size="44" class="cursor-pointer shadow-soft border">
                <v-img v-if="item.image" :src="`/uploads/${item.image}`" alt="Pacient" cover></v-img>
                <v-icon v-else icon="mdi-account" color="grey"></v-icon>
              </v-avatar>
            </template>

            <template v-slot:item.status="{ item }">
              <v-chip :color="getStatusColor(item.status)" size="small" class="text-white font-weight-bold">{{ item.status }}</v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn icon="mdi-pencil" variant="text" color="blue" size="small" class="mr-1" @click="editItem(item)"></v-btn>
              <v-btn v-if="isAdmin" icon="mdi-delete" variant="text" color="red" size="small" @click="deleteItem(item)"></v-btn>
            </template>
          </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" max-width="600px">
          <v-card class="rounded-xl overflow-hidden shadow-premium">
            <v-card-title class="modal-header-gradient py-4 px-6 d-flex align-center">
              <v-icon start class="mr-2">mdi-account-circle</v-icon>
              <span class="text-h5 font-weight-bold">{{ formTitle }}</span>
            </v-card-title>
            
            <v-card-text class="pa-6">
              <v-container class="pa-0">
                <v-form ref="form" @submit.prevent="save">
                  <v-row>
                    <v-col cols="12" class="py-1">
                      <v-file-input 
                        v-model="imageFile" 
                        label="Poză Pacient" 
                        prepend-inner-icon="mdi-camera" 
                        prepend-icon=""
                        variant="outlined" 
                        density="comfortable"
                        color="primary"
                        accept="image/*"
                      ></v-file-input>
                    </v-col>
                    
                    <v-col cols="12" sm="6" class="py-1">
                      <v-text-field 
                        v-model="editedItem.lastName" 
                        label="Nume" 
                        variant="outlined"
                        density="comfortable"
                        color="primary"
                        :rules="[rules.required, rules.minChars]"
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12" sm="6" class="py-1">
                      <v-text-field 
                        v-model="editedItem.firstName" 
                        label="Prenume"
                        variant="outlined"
                        density="comfortable"
                        color="primary"
                        :rules="[rules.required, rules.minChars]"
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12" class="py-1">
                      <v-text-field 
                        v-model="editedItem.cnp" 
                        label="CNP"
                        variant="outlined"
                        density="comfortable"
                        color="primary"
                        :rules="[rules.required, rules.cnpValidator]"
                        counter="13"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions class="px-6 pb-6 pt-0">
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" class="rounded-lg text-none font-weight-bold" @click="closeDialog">Anulează</v-btn>
              <v-btn color="primary" variant="elevated" class="rounded-lg text-none font-weight-bold px-6 shadow-soft" @click="save">Salvează</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { useSnackbarStore } from '../stores/snackbar';
import Sidebar from '../components/Sidebar.vue';

const notify = useSnackbarStore();
const authStore = useAuthStore();
const drawer = ref(true);
const isAdmin = computed(() => authStore.isAdmin);
const loading = ref(false);
const patients = ref([]);
const dialog = ref(false);
const imageFile = ref(null);
const form = ref(null);

const headers = [
  { title: 'Poză', key: 'image', sortable: false },
  { title: 'Nume', key: 'lastName' },
  { title: 'Prenume', key: 'firstName' },
  { title: 'CNP', key: 'cnp' },
  { title: 'Diagnostic', key: 'diagnosis' },
  { title: 'Status', key: 'status' },
  { title: 'Salon', key: 'salon' },
  { title: 'Acțiuni', key: 'actions', sortable: false },
];

const defaultItem = { firstName: '', lastName: '', cnp: '' };
const editedItem = ref({ ...defaultItem });
const editedIndex = ref(-1);
const formTitle = computed(() => editedIndex.value === -1 ? 'Pacient Nou' : 'Editare Pacient');

const rules = {
  required: value => !!value || 'Acest câmp este obligatoriu.',
  minChars: value => (value && value.length >= 2) || 'Minim 2 caractere.',
  cnpValidator: value => {
    const pattern = /^[0-9]{13}$/;
    return pattern.test(value) || 'CNP invalid (trebuie să aibă 13 cifre).';
  }
};

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  }
});

// Preluam lista de pacienti
const fetchPatients = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/api/patients', getAuthHeader());
    patients.value = res.data;
  } catch (error) { 
    console.error("Eroare preluare pacienti: ", error); 
  } finally { 
    loading.value = false;
  }
};

// Salvare formular
const save = async () => {
  const { valid } = await form.value.validate();
  if (!valid) {
    notify.show('Eroare in formular!', 'error');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('firstName', editedItem.value.firstName);
    formData.append('lastName', editedItem.value.lastName);
    formData.append('cnp', editedItem.value.cnp);

    if (imageFile.value) {
      formData.append('image', imageFile.value);
    }

    if (editedIndex.value > -1) {
      // Modificare pacient
      const id = patients.value[editedIndex.value].id;
      await axios.put(`/api/patients/${id}`, formData, getAuthHeader());
      notify.show('Modificat cu succes!', 'success');
    } else {
      // Adaugare pacient
      await axios.post('/api/patients', formData, getAuthHeader());
      notify.show('Adaugat cu succes!', 'success');
    }

    closeDialog();
    fetchPatients();
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    notify.show("Eroare la salvare: " + msg, 'error');
  }
};

// Stergere pacient
const deleteItem = async (item) => {
  if (!confirm('Stergem pacientul?')) {
      return;
  }
  
  try {
    await axios.delete(`/api/patients/${item.id}`, getAuthHeader());
    notify.show('Sters cu succes!', 'warning');
    fetchPatients();
  } catch (error) { 
    notify.show("Eroare la stergere", 'error');
  }
};

const openDialog = () => {
  editedItem.value = { ...defaultItem };
  imageFile.value = null;
  editedIndex.value = -1;
  dialog.value = true;
};

const editItem = (item) => {
  editedIndex.value = patients.value.indexOf(item);
  editedItem.value = { ...item };
  imageFile.value = null;
  dialog.value = true;
};

const closeDialog = () => { 
    dialog.value = false; 
};

// Returnam culoarea pentru badge-ul de status
const getStatusColor = (status) => {
  if (status === 'internat') {
      return 'orange';
  } else if (status === 'externat') {
      return 'green';
  } else if (status === 'admis') {
      return 'blue';
  } else {
      return 'grey';
  }
};

onMounted(() => { 
    fetchPatients(); 
});
</script>
