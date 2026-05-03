<template>
  <v-layout class="fill-height">
    <Sidebar v-model="drawer" />

    <v-app-bar elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Structură Spital (Secții, Saloane, Paturi)</v-app-bar-title>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="4">
            <v-card class="elevation-2 rounded-lg mb-4">
              <v-toolbar flat color="primary">
                <v-toolbar-title class="text-white">Secții</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon="mdi-plus" color="white" @click="openDialog('sectie')"></v-btn>
              </v-toolbar>
              <v-list>
                <v-list-item
                  v-for="sectie in structure"
                  :key="sectie.id"
                  :title="sectie.nume"
                  :subtitle="`Cod: ${sectie.cod_sectie}`"
                  @click="selectSectie(sectie)"
                  :active="selectedSectie?.id === sectie.id"
                  color="primary"
                >
                  <template v-slot:append>
                    <v-btn icon="mdi-delete" variant="text" color="red" size="small" @click.stop.prevent="deleteSectie(sectie.id)"></v-btn>
                  </template>
                </v-list-item>
              </v-list>
              <v-card-text v-if="!structure.length" class="text-center text-grey">
                Nu există secții.
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="elevation-2 rounded-lg mb-4" :disabled="!selectedSectie">
              <v-toolbar flat color="orange">
                <v-toolbar-title class="text-white">Saloane</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon="mdi-plus" color="white" @click="openDialog('salon')" :disabled="!selectedSectie"></v-btn>
              </v-toolbar>
              <v-list v-if="selectedSectie">
                <v-list-item
                  v-for="salon in selectedSectie.Salons"
                  :key="salon.id"
                  :title="`Salon ${salon.cod_salon}`"
                  @click="selectSalon(salon)"
                  :active="selectedSalon?.id === salon.id"
                  color="orange"
                >
                  <template v-slot:append>
                    <v-btn icon="mdi-delete" variant="text" color="red" size="small" @click.stop.prevent="deleteSalon(salon.id)"></v-btn>
                  </template>
                </v-list-item>
              </v-list>
              <v-card-text v-else class="text-center text-grey">
                Selectați o secție.
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="elevation-2 rounded-lg" :disabled="!selectedSalon">
              <v-toolbar flat color="green">
                <v-toolbar-title class="text-white">Paturi</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon="mdi-plus" color="white" @click="openDialog('pat')" :disabled="!selectedSalon"></v-btn>
              </v-toolbar>
              <v-list v-if="selectedSalon">
                <v-list-item
                  v-for="pat in selectedSalon.Pats"
                  :key="pat.id"
                  :title="`Pat ${pat.cod_pat}`"
                >
                  <template v-slot:append>
                    <v-btn icon="mdi-delete" variant="text" color="red" size="small" @click.stop.prevent="deletePat(pat.id)"></v-btn>
                  </template>
                </v-list-item>
              </v-list>
              <v-card-text v-else class="text-center text-grey">
                Selectați un salon.
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-dialog v-model="dialog" max-width="400px">
          <v-card>
            <v-card-title><span class="text-h5">{{ dialogTitle }}</span></v-card-title>
            <v-card-text>
              <v-form ref="form" @submit.prevent="save">
                
                <template v-if="dialogType === 'sectie'">
                  <v-text-field v-model="newItem.nume" label="Nume Secție" required></v-text-field>
                  <v-text-field v-model="newItem.cod_sectie" label="Cod Secție" required></v-text-field>
                </template>

                <template v-if="dialogType === 'salon'">
                  <v-text-field v-model="newItem.cod_salon" label="Cod Salon" required></v-text-field>
                </template>

                <template v-if="dialogType === 'pat'">
                  <v-text-field v-model="newItem.cod_pat" label="Cod Pat" required></v-text-field>
                </template>

              </v-form>
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
            <v-card-title class="text-h5 text-red"><v-icon color="red" class="mr-2">mdi-alert</v-icon>Confirmare</v-card-title>
            <v-card-text class="pt-4">{{ confirmMessage }}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" @click="confirmDialog = false">Renunță</v-btn>
              <v-btn color="red-darken-1" variant="elevated" @click="executeDelete">Șterge</v-btn>
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
import { useAuthStore } from '../../stores/auth';
import { useSnackbarStore } from '../../stores/snackbar';
import Sidebar from '../../components/Sidebar.vue';

const notify = useSnackbarStore();
const authStore = useAuthStore();
const drawer = ref(true);
const structure = ref([]);

const selectedSectie = ref(null);
const selectedSalon = ref(null);

const dialog = ref(false);
const dialogType = ref(''); // 'sectie', 'salon', 'pat'
const newItem = ref({ nume: '', cod_sectie: '', cod_salon: '', cod_pat: '' });
const form = ref(null);

const dialogTitle = computed(() => {
  if (dialogType.value === 'sectie') return 'Adaugă Secție Nouă';
  if (dialogType.value === 'salon') return 'Adaugă Salon Nou';
  return 'Adaugă Pat Nou';
});

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${authStore.token}` }
});

const fetchStructure = async () => {
  try {
    const res = await axios.get('/api/structure', getAuthHeader());
    structure.value = res.data;
    
    // Păstrăm selecțiile active dacă există
    if (selectedSectie.value) {
        selectedSectie.value = structure.value.find(s => s.id === selectedSectie.value.id) || null;
    }
    if (selectedSalon.value && selectedSectie.value) {
        selectedSalon.value = selectedSectie.value.Salons.find(s => s.id === selectedSalon.value.id) || null;
    } else {
        selectedSalon.value = null;
    }
  } catch (error) { console.error(error); }
};

const selectSectie = (sectie) => {
  if (selectedSectie.value?.id === sectie.id) {
    selectedSectie.value = null;
    selectedSalon.value = null;
  } else {
    selectedSectie.value = sectie;
    selectedSalon.value = null;
  }
};

const selectSalon = (salon) => {
  if (selectedSalon.value?.id === salon.id) {
    selectedSalon.value = null;
  } else {
    selectedSalon.value = salon;
  }
};

const openDialog = (type) => {
  dialogType.value = type;
  newItem.value = { nume: '', cod_sectie: '', cod_salon: '', cod_pat: '' };
  
  // Generare sugestie cod pat automat:
  if (type === 'pat' && selectedSalon.value) {
      const nrPaturiGata = selectedSalon.value.Pats ? selectedSalon.value.Pats.length + 1 : 1;
      
      // Dacă utilizatorul a denumit deja salonul incluzând secția (ex: CARDIOS1), folosim doar codul salonului pentru a evita dublarea (ex: CARDIOCARDIOS1)
      newItem.value.cod_pat = `${selectedSalon.value.cod_salon}-P${nrPaturiGata}`;
  }
  
  dialog.value = true;
};

const save = async () => {
  try {
    if (dialogType.value === 'sectie') {
      await axios.post('/api/structure/sectii', {
        nume: newItem.value.nume,
        cod_sectie: newItem.value.cod_sectie.toUpperCase()
      }, getAuthHeader());
    } else if (dialogType.value === 'salon') {
      await axios.post('/api/structure/saloane', {
        cod_salon: newItem.value.cod_salon.toUpperCase(),
        id_sectie: selectedSectie.value.id
      }, getAuthHeader());
    } else if (dialogType.value === 'pat') {
      await axios.post('/api/structure/paturi', {
        cod_pat: newItem.value.cod_pat.toUpperCase(),
        id_salon: selectedSalon.value.id
      }, getAuthHeader());
    }
    
    notify.show(`${dialogType.value} adăugat(ă) cu succes!`, 'success');
    dialog.value = false;
    fetchStructure();
  } catch (error) {
    notify.show("Eroare la salvare", 'error');
  }
};

const confirmDialog = ref(false);
const confirmMessage = ref('');
let pendingDeleteAction = null;

const promptDelete = (message, action) => {
  confirmMessage.value = message;
  pendingDeleteAction = action;
  confirmDialog.value = true;
};

const executeDelete = async () => {
  confirmDialog.value = false;
  if (pendingDeleteAction) {
    await pendingDeleteAction();
    pendingDeleteAction = null;
  }
};

const deleteSectie = (id) => {
  promptDelete('Sunteți sigur că doriți să ștergeți această secție și toate saloanele ei?', async () => {
    try {
      await axios.delete(`/api/structure/sectii/${id}`, getAuthHeader());
      selectedSectie.value = null; 
      fetchStructure();
      notify.show("Secție ștearsă!", "warning");
    } catch(e) { console.error('Delete error', e); notify.show("Eroare la ștergere", "error"); }
  });
};

const deleteSalon = (id) => {
  promptDelete('Sunteți sigur că doriți să ștergeți acest salon și paturile sale?', async () => {
    try {
      await axios.delete(`/api/structure/saloane/${id}`, getAuthHeader());
      selectedSalon.value = null;
      fetchStructure();
      notify.show("Salon șters!", "warning");
    } catch(e) { console.error('Delete error', e); notify.show("Eroare la ștergere", "error"); }
  });
};

const deletePat = (id) => {
  promptDelete('Sunteți sigur că doriți să ștergeți acest pat?', async () => {
    try {
      await axios.delete(`/api/structure/paturi/${id}`, getAuthHeader());
      fetchStructure();
      notify.show("Pat șters!", "warning");
    } catch(e) { console.error('Delete error', e); notify.show("Eroare la ștergere", "error"); }
  });
};

onMounted(() => { fetchStructure(); });
</script>
