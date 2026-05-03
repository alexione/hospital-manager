<template>
  <v-layout class="fill-height">
    <Sidebar v-model="drawer" />

    <v-app-bar elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Internări / Externări</v-app-bar-title>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container fluid>
        <v-card class="elevation-2 rounded-lg">
          <v-toolbar flat color="white">
            <v-toolbar-title>Lista Internări</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog">Internare Nouă</v-btn>
          </v-toolbar>

          <v-data-table :headers="headers" :items="admissions" :loading="loading" class="pa-2">
            <template v-slot:item.Patient="{ item }">
              {{ item.Patient ? `${item.Patient.firstName} ${item.Patient.lastName}` : 'N/A' }}
            </template>
            <template v-slot:item.Pat="{ item }">
              {{ item.Pat ? `${item.Pat.Salon.Sectie.nume} / ${item.Pat.Salon.cod_salon} / Pat ${item.Pat.cod_pat}` : 'Nealocat' }}
            </template>
            <template v-slot:item.status="{ item }">
              <v-chip :color="getStatusColor(item.status)" size="small" class="text-white">{{ item.status }}</v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn size="small" color="success" v-if="item.status === 'internat' || item.status === 'urgență'" @click="discharge(item)">Externează</v-btn>
            </template>
          </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title><span class="text-h5">Internare Nouă</span></v-card-title>
            <v-card-text>
              <v-container>
                <v-form ref="form" @submit.prevent="save">
                  <v-row>
                    <v-col cols="12">
                      <v-select
                        v-model="editedItem.id_pacient"
                        :items="patients"
                        item-title="fullName"
                        item-value="id"
                        label="Pacient"
                        :rules="[v => !!v || 'Selectați pacientul']"
                      ></v-select>
                    </v-col>
                    
                    <v-col cols="12">
                      <v-text-field 
                        v-model="editedItem.diagnostic" 
                        label="Diagnostic" 
                        :rules="[v => !!v || 'Obligatoriu']"
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12">
                      <v-select
                        v-model="editedItem.id_pat"
                        :items="beds"
                        item-title="name"
                        item-value="id"
                        label="Pat (Opțional)"
                        clearable
                      ></v-select>
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
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../../stores/auth';
import { useSnackbarStore } from '../../stores/snackbar';
import Sidebar from '../../components/Sidebar.vue';

const notify = useSnackbarStore();
const authStore = useAuthStore();
const drawer = ref(true);
const loading = ref(false);
const admissions = ref([]);
const patients = ref([]);
const beds = ref([]);
const dialog = ref(false);
const form = ref(null);

const headers = [
  { title: 'Cod Internare', key: 'cod_internare' },
  { title: 'Pacient', key: 'Patient' },
  { title: 'Pat', key: 'Pat' },
  { title: 'Diagnostic', key: 'diagnostic' },
  { title: 'Status', key: 'status' },
  { title: 'Acțiuni', key: 'actions', sortable: false },
];

const defaultItem = { id_pacient: null, diagnostic: '', id_pat: null, status: 'internat' };
const editedItem = ref({ ...defaultItem });

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${authStore.token}` }
});

// Incarcam datele pentru internari, pacienti si paturi
const fetchData = async () => {
  loading.value = true;
  try {
    const resAdm = await axios.get('/api/admissions', getAuthHeader());
    admissions.value = resAdm.data;

    const resPat = await axios.get('/api/patients', getAuthHeader());
    // Formatam numele complet al pacientului pentru lista
    const patientList = [];
    for (const p of resPat.data) {
        patientList.push({
            id: p.id,
            fullName: p.firstName + " " + p.lastName + " (" + p.cnp + ")"
        });
    }
    patients.value = patientList;

    const resStruct = await axios.get('/api/structure', getAuthHeader());
    const allBeds = [];
    // Cautam toate paturile din sectii si saloane
    for (const sec of resStruct.data) {
        if (sec.Salons) {
            for (const sal of sec.Salons) {
                if (sal.Pats) {
                    for (const pat of sal.Pats) {
                        allBeds.push({ 
                            id: pat.id, 
                            name: sec.nume + " - " + sal.cod_salon + " - Pat " + pat.cod_pat 
                        });
                    }
                }
            }
        }
    }
    beds.value = allBeds;
  } catch (error) { 
    console.error("Eroare la incarcare: ", error); 
  } finally { 
    loading.value = false; 
  }
};

// Creare internare noua
const save = async () => {
  const { valid } = await form.value.validate();
  if (!valid) {
      return;
  }

  try {
    await axios.post('/api/admissions', editedItem.value, getAuthHeader());
    notify.show('Internare adăugată cu succes!', 'success');
    closeDialog();
    fetchData(); // Actualizam lista
  } catch (error) {
    notify.show("Eroare la salvare", 'error');
  }
};

// Externare pacient
const discharge = async (item) => {
  if (!confirm('Doriți să externați pacientul?')) {
      return;
  }
  
  try {
    await axios.post(`/api/admissions/${item.id}/discharge`, {}, getAuthHeader());
    notify.show('Pacient externat cu succes!', 'success');
    fetchData();
  } catch (error) {
    notify.show("Eroare la externare", 'error');
  }
};

const openDialog = () => {
  editedItem.value = { ...defaultItem };
  dialog.value = true;
};

const closeDialog = () => { 
    dialog.value = false; 
};

// Culoare pentru status internare
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
    fetchData(); 
});
</script>
