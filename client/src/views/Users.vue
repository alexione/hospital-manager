<template>
  <v-layout class="fill-height">
    <Sidebar v-model="drawer" />
    
    <v-app-bar elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Administrare Utilizatori</v-app-bar-title>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container fluid>
        <v-card class="elevation-2 rounded-lg">
          <v-toolbar flat color="white">
            <v-toolbar-title>Lista Personal Medical</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog">Utilizator Nou</v-btn>
          </v-toolbar>

          <v-data-table :headers="headers" :items="users" :loading="loading" class="pa-2">
            
            <template v-slot:item.avatar="{ item }">
               <v-avatar size="40">
                <v-img v-if="item.avatar" :src="`http://localhost:3000/uploads/${item.avatar}`" cover></v-img>
                <span v-else class="text-h6">{{ item.email[0].toUpperCase() }}</span>
              </v-avatar>
            </template>

            <template v-slot:item.role="{ item }">
              <v-chip :color="item.role === 'admin' ? 'red' : 'blue'" size="small" class="text-uppercase font-weight-bold text-white">
                {{ item.role }}
              </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn icon size="small" variant="text" color="red" @click="confirmDelete(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>

          </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title><span class="text-h5">Adaugă Utilizator Nou</span></v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                   <v-col cols="12">
                    <v-file-input v-model="avatarFile" label="Avatar (Opțional)" prepend-icon="mdi-camera" variant="outlined" accept="image/*"></v-file-input>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="form.email" label="Email" prepend-inner-icon="mdi-email" type="email"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="form.password" label="Parolă" prepend-inner-icon="mdi-lock" type="password"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select v-model="form.role" :items="['user', 'admin']" label="Rol (Permisiuni)" prepend-inner-icon="mdi-shield-account"></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" variant="text" @click="closeDialog">Anulează</v-btn>
              <v-btn color="primary" variant="elevated" @click="saveUser">Creează Cont</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="deleteDialog" max-width="400px">
          <v-card>
            <v-card-title class="text-h5">Confirmare Ștergere</v-card-title>
            <v-card-text>
              Ești sigur că vrei să ștergi utilizatorul <strong>{{ userToDelete?.email }}</strong>?
              Această acțiune este ireversibilă.
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" variant="text" @click="deleteDialog = false">Nu, Anulează</v-btn>
              <v-btn color="error" variant="elevated" @click="executeDelete">Da, Șterge</v-btn>
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
import { useAuthStore } from '../store/auth';
import { useSnackbarStore } from '../store/snackbar';
import { useRouter } from 'vue-router';
import Sidebar from '../components/Sidebar.vue';

const authStore = useAuthStore();
const notify = useSnackbarStore();
const router = useRouter();

const drawer = ref(true);
const loading = ref(false);
const users = ref([]);

// State pentru Dialogul de Creare
const dialog = ref(false);
const avatarFile = ref(null);
const defaultForm = { email: '', password: '', role: 'user' };
const form = ref({ ...defaultForm });

// State pentru Dialogul de Ștergere (NOU)
const deleteDialog = ref(false);
const userToDelete = ref(null);

const headers = [
  { title: 'Avatar', key: 'avatar', sortable: false },
  { title: 'Email', key: 'email' },
  { title: 'Rol', key: 'role' },
  { title: 'Creat la', key: 'createdAt' },
  { title: 'Acțiuni', key: 'actions', sortable: false },
];

const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${authStore.token}` } });

// --- FETCH USERS ---
const fetchUsers = async () => {
    loading.value = true;
    try {
        const res = await axios.get('http://localhost:3000/api/users', getAuthHeader());
        users.value = res.data.map(u => ({
            ...u,
            createdAt: new Date(u.createdAt).toLocaleDateString()
        }));
    } catch (error) {
        if(error.response?.status === 403) {
             notify.show("Acces interzis! Nu ești admin.", "error");
             router.push('/dashboard');
        }
    } finally {
        loading.value = false;
    }
};

// --- CREATE USER ---
const saveUser = async () => {
    try {
        const formData = new FormData();
        formData.append('email', form.value.email);
        formData.append('password', form.value.password);
        formData.append('role', form.value.role);
        if (avatarFile.value) formData.append('avatar', avatarFile.value);

        await axios.post('http://localhost:3000/api/users', formData, getAuthHeader());
        
        notify.show('Utilizator creat cu succes!', 'success');
        closeDialog();
        fetchUsers();
    } catch (error) {
        const msg = error.response?.data?.message || "Eroare la creare";
        notify.show(msg, 'error');
    }
};

// --- LOGICA DE ȘTERGERE NOUĂ ---

// Pasul 1: Deschide fereastra de confirmare
const confirmDelete = (item) => {
    userToDelete.value = item;
    deleteDialog.value = true;
};

// Pasul 2: Execută ștergerea (Doar după ce apeși "DA")
const executeDelete = async () => {
    if (!userToDelete.value) return;
    
    try {
        await axios.delete(`http://localhost:3000/api/users/${userToDelete.value.id}`, getAuthHeader());
        notify.show('Utilizator șters!', 'warning');
        fetchUsers();
    } catch (error) {
        notify.show(error.response?.data?.message || "Eroare", 'error');
    } finally {
        deleteDialog.value = false; // Închidem dialogul
        userToDelete.value = null;
    }
};

const openDialog = () => {
    form.value = { ...defaultForm };
    avatarFile.value = null;
    dialog.value = true;
};
const closeDialog = () => { dialog.value = false; };

onMounted(() => {
    if (!authStore.isAdmin) {
        notify.show("Nu ai acces la această pagină!", "error");
        router.push('/dashboard');
        return;
    }
    fetchUsers();
});
</script>