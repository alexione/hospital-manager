<template>
  <v-layout class="fill-height">
    <Sidebar v-model="drawer" />

    <v-app-bar elevation="0" class="border-b bg-white px-4">
      <v-app-bar-nav-icon @click="drawer = !drawer" color="indigo-darken-4"></v-app-bar-nav-icon>
      <v-app-bar-title class="font-weight-bold text-indigo-darken-4">Gestiune Personal Medical</v-app-bar-title>
    </v-app-bar>

    <v-main class="bg-slate-50" style="height: calc(100vh - 64px); overflow: hidden;">
      <v-container fluid class="pa-6 d-flex flex-column" style="height: 100%; overflow: hidden;">
        
        <div class="d-flex align-center justify-space-between mb-6 flex-shrink-0">
          <div>
            <h1 class="text-h4 font-weight-bold text-grey-darken-3">Personal Medical</h1>
            <p class="text-subtitle-1 text-grey-darken-1">Administrați conturile și permisiunile medicilor și asistenților</p>
          </div>
          <v-btn 
            color="primary" 
            prepend-icon="mdi-plus" 
            size="large" 
            class="rounded-lg shadow-soft text-none font-weight-bold"
            @click="openAddDialog"
          >
            Adaugă Angajat
          </v-btn>
        </div>

        <v-card class="rounded-xl shadow-soft border-0 d-flex flex-column flex-grow-1 overflow-hidden" elevation="0">
          <v-card-item class="py-4 border-b flex-shrink-0">
            <v-row align="center">
              <v-col cols="12" sm="6">
                <v-card-title class="font-weight-bold text-grey-darken-3">Lista Angajați</v-card-title>
              </v-col>
              <v-col cols="12" sm="6" class="d-flex justify-sm-end">
                <v-text-field 
                  v-model="search" 
                  prepend-inner-icon="mdi-magnify" 
                  label="Caută angajat..." 
                  single-line 
                  hide-details
                  variant="outlined"
                  density="comfortable" 
                  class="w-100" 
                  style="max-width: 300px"
                  color="primary"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-item>

          <v-data-table 
            :headers="headers" 
            :items="employees" 
            :loading="loading" 
            :search="search" 
            class="pa-4 bg-transparent flex-grow-1 overflow-y-auto"
            fixed-header
            height="100%"
          >

            <template v-slot:item.nume="{ item }">
              <div class="font-weight-bold text-grey-darken-3">
                {{ item.nume }} {{ item.prenume }}
              </div>
            </template>

            <template v-slot:item.role="{ item }">
              <v-chip :color="item.role === 'Admin' ? 'red-darken-1' : 'primary'" size="small" class="text-white font-weight-bold">
                {{ item.role }}
              </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn icon="mdi-pencil" variant="text" color="blue" size="small" class="mr-1" @click="editItem(item)"></v-btn>
              <v-btn icon="mdi-delete" variant="text" color="red" size="small" @click="deleteItem(item)"
                :disabled="item.id === authStore.user?.id"></v-btn>
            </template>
          </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" max-width="500px">
          <v-card class="rounded-xl overflow-hidden shadow-premium">
            <v-card-title class="modal-header-gradient py-4 px-6 d-flex align-center">
              <v-icon start class="mr-2">mdi-account-plus</v-icon>
              <span class="text-h5 font-weight-bold">{{ isEditing ? 'Editare Angajat' : 'Adaugă Angajat Nou' }}</span>
            </v-card-title>
            
            <v-card-text class="pa-6">
              <v-container class="pa-0">
                <v-form ref="form" @submit.prevent="save">
                  <v-text-field v-model="editedItem.nume" label="Nume" variant="outlined" density="comfortable" color="primary" class="mb-3" required></v-text-field>
                  <v-text-field v-model="editedItem.prenume" label="Prenume" variant="outlined" density="comfortable" color="primary" class="mb-3" required></v-text-field>
                  <v-text-field v-model="editedItem.email" label="Email" :disabled="isEditing" variant="outlined" density="comfortable" color="primary" class="mb-3" required type="email"></v-text-field>
                  <v-text-field v-if="!isEditing" v-model="editedItem.password" label="Parolă" variant="outlined" density="comfortable" color="primary" class="mb-3" required type="password"></v-text-field>
                  <v-select v-model="editedItem.role" :items="['Admin', 'Medic', 'Asistent', 'Registratură']" label="Rol" variant="outlined" density="comfortable" color="primary" required></v-select>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions class="px-6 pb-6 pt-0">
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" class="rounded-lg text-none font-weight-bold" @click="dialog = false">Anulează</v-btn>
              <v-btn color="primary" variant="elevated" class="rounded-lg text-none font-weight-bold px-6 shadow-soft" @click="save">Salvează</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Dialog de confirmare stergere -->
        <v-dialog v-model="confirmDialog" max-width="450">
          <v-card class="rounded-xl overflow-hidden shadow-premium">
            <v-card-title class="bg-red-darken-1 text-white py-4 px-6 d-flex align-center">
              <v-icon color="white" class="mr-2">mdi-alert</v-icon>
              <span class="font-weight-bold">Confirmare Ștergere</span>
            </v-card-title>
            <v-card-text class="pt-6 px-6 text-body-1 text-grey-darken-3">Sunteți sigur că doriți să ștergeți acest angajat?</v-card-text>
            <v-card-actions class="px-6 pb-6">
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" class="rounded-lg text-none font-weight-bold" @click="confirmDialog = false">Renunță</v-btn>
              <v-btn color="red-darken-1" variant="elevated" class="rounded-lg text-none font-weight-bold px-6 shadow-soft" @click="confirmDelete">Șterge</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../../stores/auth';
import { useSnackbarStore } from '../../stores/snackbar';
import Sidebar from '../../components/Sidebar.vue';

const notify = useSnackbarStore();
const authStore = useAuthStore();
const drawer = ref(true);
const loading = ref(false);
const employees = ref([]);
const search = ref('');

const dialog = ref(false);
const isEditing = ref(false);
const confirmDialog = ref(false);
const editedItem = ref({});
let itemToDelete = null;

const headers = [
  { title: 'Cod', key: 'cod_angajat' },
  { title: 'Nume', key: 'nume' },
  { title: 'Prenume', key: 'prenume', align: 'd-none' }, // Ascuns dar util pentru search
  { title: 'Email', key: 'email' },
  { title: 'Rol', key: 'role' },
  { title: 'Acțiuni', key: 'actions', sortable: false },
];

// Returneaza header-ul necesar pentru autentificarea API-ului
const getAuthHeader = () => {
  return {
    headers: { Authorization: `Bearer ${authStore.token}` }
  };
};

// Preluam datele angajatilor
const fetchEmployees = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/api/employees', getAuthHeader());
    employees.value = res.data;
  } catch (error) {
    console.error("Eroare preluare angajati: ", error);
  } finally {
    loading.value = false;
  }
};

const openAddDialog = () => {
  isEditing.value = false;
  editedItem.value = { nume: '', prenume: '', email: '', password: '', role: 'Registratură' };
  dialog.value = true;
};

const editItem = (item) => {
  isEditing.value = true;
  editedItem.value = { ...item };
  dialog.value = true;
};

// Salvarea unui angajat nou sau modificat
const save = async () => {
  try {
    if (isEditing.value) {
      // Daca editam, facem un request de tip PUT
      await axios.put(`/api/employees/${editedItem.value.id}`, {
        nume: editedItem.value.nume,
        prenume: editedItem.value.prenume,
        role: editedItem.value.role
      }, getAuthHeader());
      notify.show('Modificat cu succes!', 'success');
    } else {
      // Daca adaugam, folosim ruta de inregistrare
      await axios.post('/api/auth/register', {
        nume: editedItem.value.nume,
        prenume: editedItem.value.prenume,
        email: editedItem.value.email,
        password: editedItem.value.password,
        role: editedItem.value.role
      });
      notify.show('Adaugat cu succes!', 'success');
    }

    dialog.value = false;
    fetchEmployees();
  } catch (error) {
    notify.show("Eroare la salvare", 'error');
  }
};

const deleteItem = (item) => {
  itemToDelete = item.id;
  confirmDialog.value = true;
};

// Stergerea finala dupa confirmare
const confirmDelete = async () => {
  confirmDialog.value = false;
  try {
    await axios.delete(`/api/employees/${itemToDelete}`, getAuthHeader());
    notify.show('Sters cu succes!', 'warning');
    fetchEmployees();
  } catch (error) {
    notify.show("Eroare la stergere", 'error');
  }
};

onMounted(() => {
  if (authStore.user?.role?.toLowerCase() !== 'admin') {
    navigateTo('/dashboard');
    return;
  }
  fetchEmployees();
});
</script>
