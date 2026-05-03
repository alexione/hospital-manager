<template>
  <v-layout class="fill-height">
    
    <Sidebar v-model="drawer" />

    <v-app-bar elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Gestiune Pacienți</v-app-bar-title>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container fluid>
        <v-card class="elevation-2 rounded-lg">
          <v-toolbar flat color="white">
            <v-toolbar-title>Lista Pacienți</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog">Adaugă Pacient</v-btn>
          </v-toolbar>

          <v-data-table :headers="headers" :items="patients" :loading="loading" class="pa-2">
            <template v-slot:item.image="{ item }">
              <v-avatar size="40" class="cursor-pointer">
                <v-img v-if="item.image" :src="`/uploads/${item.image}`" alt="Pacient" cover></v-img>
                <v-icon v-else icon="mdi-account"></v-icon>
              </v-avatar>
            </template>

            <template v-slot:item.status="{ item }">
              <v-chip :color="getStatusColor(item.status)" size="small" class="text-white">{{ item.status }}</v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-icon size="small" class="me-2" color="blue" @click="editItem(item)">mdi-pencil</v-icon>
              <v-icon size="small" color="red" @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title><span class="text-h5">{{ formTitle }}</span></v-card-title>
            <v-card-text>
              <v-container>
                <v-form ref="form" @submit.prevent="save">
                  <v-row>
                    <v-col cols="12">
                      <v-file-input v-model="imageFile" label="Poză Pacient / Document" prepend-icon="mdi-camera" variant="outlined" accept="image/*"></v-file-input>
                    </v-col>
                    
                    <v-col cols="12" sm="6">
                      <v-text-field 
                        v-model="editedItem.lastName" 
                        label="Nume" 
                        :rules="[rules.required, rules.minChars]"
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12" sm="6">
                      <v-text-field 
                        v-model="editedItem.firstName" 
                        label="Prenume"
                        :rules="[rules.required, rules.minChars]"
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12">
                      <v-text-field 
                        v-model="editedItem.cnp" 
                        label="CNP"
                        :rules="[rules.required, rules.cnpValidator]"
                        counter="13"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDialog">Anulează</v-btn>
              <v-btn color="blue-darken-1" variant="elevated" @click="save">Salvează</v-btn>
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
  } else if (status === 'urgență') {
      return 'red';
  } else {
      return 'grey';
  }
};

onMounted(() => { 
    fetchPatients(); 
});
</script>
