<template>
  <v-layout class="fill-height">
    <Sidebar v-model="drawer" />

    <v-app-bar elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Gestiune Personal Medical</v-app-bar-title>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container fluid>
        <v-card class="elevation-2 rounded-lg">
          <v-toolbar flat color="white">
            <v-toolbar-title>Lista Angajați</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-inner-icon="mdi-magnify" label="Caută..." single-line hide-details
              density="compact" class="mx-4" style="max-width: 300px"></v-text-field>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openAddDialog">Adaugă Angajat</v-btn>
          </v-toolbar>

          <v-data-table :headers="headers" :items="employees" :loading="loading" :search="search" class="pa-2">

            <template v-slot:item.nume="{ item }">
              {{ item.nume }}
            </template>

            <template v-slot:item.role="{ item }">
              <v-chip :color="item.role === 'Admin' ? 'red' : 'blue'" size="small" class="text-white">
                {{ item.role }}
              </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn icon="mdi-pencil" variant="text" color="blue" size="small" @click="editItem(item)"></v-btn>
              <v-btn icon="mdi-delete" variant="text" color="red" size="small" @click="deleteItem(item)"
                :disabled="item.id === authStore.user?.id"></v-btn>
            </template>
          </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title><span class="text-h5">{{ isEditing ? 'Editare Angajat' : 'Adaugă Angajat Nou'
                }}</span></v-card-title>
            <v-card-text>
              <v-container>
                <v-form ref="form" @submit.prevent="save">
                  <v-text-field v-model="editedItem.nume" label="Nume" required></v-text-field>
                  <v-text-field v-model="editedItem.prenume" label="Prenume" required></v-text-field>
                  <v-text-field v-model="editedItem.email" label="Email" :disabled="isEditing" required
                    type="email"></v-text-field>
                  <v-text-field v-if="!isEditing" v-model="editedItem.password" label="Parolă" required
                    type="password"></v-text-field>
                  <v-select v-model="editedItem.role" :items="['Admin', 'Medic', 'Asistent', 'Registratură']" label="Rol"
                    required></v-select>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="dialog = false">Anulează</v-btn>
              <v-btn color="blue-darken-1" variant="elevated" @click="save">Salvează</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Dialog de confirmare stergere -->
        <v-dialog v-model="confirmDialog" max-width="400">
          <v-card>
            <v-card-title class="text-h5 text-red"><v-icon color="red"
                class="mr-2">mdi-alert</v-icon>Confirmare</v-card-title>
            <v-card-text class="pt-4">Sunteți sigur că doriți să ștergeți acest angajat?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" @click="confirmDialog = false">Renunță</v-btn>
              <v-btn color="red-darken-1" variant="elevated" @click="confirmDelete">Șterge</v-btn>
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
const drawer = ref(false);
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
