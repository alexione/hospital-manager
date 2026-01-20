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
                <v-img v-if="item.image" :src="`http://localhost:3000/uploads/${item.image}`" alt="Pacient" cover></v-img>
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
                <v-row>
                  <v-col cols="12">
                    <v-file-input v-model="imageFile" label="Poză Pacient / Document" prepend-icon="mdi-camera" variant="outlined" accept="image/*"></v-file-input>
                  </v-col>
                  <v-col cols="12" sm="6"><v-text-field v-model="editedItem.lastName" label="Nume"></v-text-field></v-col>
                  <v-col cols="12" sm="6"><v-text-field v-model="editedItem.firstName" label="Prenume"></v-text-field></v-col>
                  <v-col cols="12"><v-text-field v-model="editedItem.cnp" label="CNP"></v-text-field></v-col>
                  <v-col cols="12"><v-text-field v-model="editedItem.diagnosis" label="Diagnostic"></v-text-field></v-col>
                  <v-col cols="12" sm="6">
                    <v-select v-model="editedItem.status" :items="['internat', 'externat', 'urgență', 'decedat']" label="Status"></v-select>
                  </v-col>
                  <v-col cols="12" sm="6"><v-text-field v-model="editedItem.salon" label="Salon"></v-text-field></v-col>
                </v-row>
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
import { useAuthStore } from '../store/auth';
import { useSnackbarStore } from '../store/snackbar';
// IMPORTĂM COMPONENTA NOUĂ
import Sidebar from '../components/Sidebar.vue';

const notify = useSnackbarStore();
const authStore = useAuthStore();
const drawer = ref(true); // Aceasta variabilă controlează Sidebar-ul prin v-model
const loading = ref(false);
const patients = ref([]);
const dialog = ref(false);
const imageFile = ref(null);

const headers = [
  { title: 'Poză', key: 'image', sortable: false },
  { title: 'Nume', key: 'lastName' },
  { title: 'Prenume', key: 'firstName' },
  { title: 'CNP', key: 'cnp' },
  { title: 'Diagnostic', key: 'diagnosis' },
  { title: 'Status', key: 'status' },
  { title: 'Acțiuni', key: 'actions', sortable: false },
];

const defaultItem = { firstName: '', lastName: '', cnp: '', diagnosis: '', status: 'internat', salon: '' };
const editedItem = ref({ ...defaultItem });
const editedIndex = ref(-1);
const formTitle = computed(() => editedIndex.value === -1 ? 'Pacient Nou' : 'Editare Pacient');

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  }
});

const fetchPatients = async () => {
  loading.value = true;
  try {
    const res = await axios.get('http://localhost:3000/api/patients', getAuthHeader());
    patients.value = res.data;
  } catch (error) { console.error(error); }
  finally { loading.value = false; }
};

const save = async () => {
  try {
    const formData = new FormData();
    formData.append('firstName', editedItem.value.firstName);
    formData.append('lastName', editedItem.value.lastName);
    formData.append('cnp', editedItem.value.cnp);
    formData.append('diagnosis', editedItem.value.diagnosis);
    formData.append('status', editedItem.value.status);
    formData.append('salon', editedItem.value.salon);

    if (imageFile.value) {
      formData.append('image', imageFile.value);
    }

    if (editedIndex.value > -1) {
      const id = patients.value[editedIndex.value].id;
      await axios.put(`http://localhost:3000/api/patients/${id}`, formData, getAuthHeader());
      notify.show('Pacient modificat cu succes!', 'success');
    } else {
      await axios.post('http://localhost:3000/api/patients', formData, getAuthHeader());
      notify.show('Pacient adăugat cu succes!', 'success');
    }

    closeDialog();
    fetchPatients();
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    notify.show("Eroare la salvare: " + msg, 'error');
  }
};

const deleteItem = async (item) => {
  if (!confirm('Ștergi pacientul?')) return;
  
  try {
    await axios.delete(`http://localhost:3000/api/patients/${item.id}`, getAuthHeader());
    notify.show('Pacient șters cu succes!', 'warning');
    fetchPatients();
  } catch (error) { 
    const msg = error.response?.data?.message || "Eroare la ștergere";
    notify.show(msg, 'error');
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

const closeDialog = () => { dialog.value = false; };
const getStatusColor = (s) => {
  if (s === 'internat') return 'orange';
  if (s === 'externat') return 'green';
  if (s === 'urgență') return 'red';
  return 'grey';
};

onMounted(() => { fetchPatients(); });
</script>