<template>
  <v-layout class="fill-height">
    <Sidebar v-model="drawer" />

    <v-app-bar elevation="0" class="border-b bg-white px-4">
      <v-app-bar-nav-icon @click="drawer = !drawer" color="indigo-darken-4"></v-app-bar-nav-icon>
      <v-app-bar-title class="font-weight-bold text-indigo-darken-4">Internări / Externări</v-app-bar-title>
    </v-app-bar>

    <v-main class="bg-slate-50" style="height: calc(100vh - 64px); overflow: hidden;">
      <v-container fluid class="pa-6 d-flex flex-column" style="height: 100%; overflow: hidden;">
        
        <div class="d-flex align-center justify-space-between mb-6 flex-shrink-0">
          <div>
            <h1 class="text-h4 font-weight-bold text-grey-darken-3">Internări</h1>
            <p class="text-subtitle-1 text-grey-darken-1">Monitorizați internările active și eliberați paturile la externare</p>
          </div>
          <v-btn 
            v-if="canManageAdmissions" 
            color="primary" 
            prepend-icon="mdi-plus" 
            size="large" 
            class="rounded-lg shadow-soft text-none font-weight-bold"
            @click="openDialog"
          >
            Internare Nouă
          </v-btn>
        </div>

        <v-card class="rounded-xl shadow-soft border-0 d-flex flex-column flex-grow-1 overflow-hidden" elevation="0">
          <v-card-item class="py-4 border-b flex-shrink-0">
            <v-card-title class="font-weight-bold text-grey-darken-3">Lista Internări</v-card-title>
          </v-card-item>

          <v-data-table 
            :headers="headers" 
            :items="admissions" 
            :loading="loading" 
            class="pa-4 bg-transparent flex-grow-1 overflow-y-auto"
            fixed-header
            height="100%"
          >
            <template v-slot:item.Patient="{ item }">
              <div class="font-weight-bold text-grey-darken-3">
                {{ item.Patient ? `${item.Patient.firstName} ${item.Patient.lastName}` : 'N/A' }}
              </div>
            </template>
            <template v-slot:item.Pat="{ item }">
              <span class="font-weight-medium">
                {{ item.Pat ? `${item.Pat.Salon.Sectie.nume} / Salon ${item.Pat.Salon.cod_salon} / Pat ${item.Pat.cod_pat}` : 'Nealocat' }}
              </span>
            </template>
            <template v-slot:item.status="{ item }">
              <v-chip :color="getStatusColor(item.status)" size="small" class="text-white font-weight-bold">{{ item.status }}</v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <div class="d-flex flex-column flex-sm-row" style="gap: 8px;">
                <v-btn 
                  size="small" 
                  color="primary" 
                  v-if="canViewMedicalFile" 
                  @click="openMedicalFileDialog(item)"
                  style="width: 120px;"
                  class="text-none font-weight-bold rounded-lg shadow-soft"
                >
                  Fișă Medicală
                </v-btn>
                <v-btn 
                  size="small" 
                  color="success" 
                  v-if="item.status === 'internat' && canDischarge" 
                  @click="openDischargeDialog(item)"
                  style="width: 120px;"
                  class="text-none font-weight-bold rounded-lg shadow-soft text-white"
                >
                  Externează
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>

        <!-- Dialog Internare Noua -->
        <v-dialog v-model="dialog" max-width="600px">
          <v-card class="rounded-xl overflow-hidden shadow-premium">
            <v-card-title class="modal-header-gradient py-4 px-6 d-flex align-center">
              <v-icon start class="mr-2">mdi-file-document-plus</v-icon>
              <span class="text-h5 font-weight-bold">Internare Nouă</span>
            </v-card-title>
            
            <v-card-text class="pa-6">
              <v-container class="pa-0">
                <v-form ref="form" @submit.prevent="save">
                  <v-row>
                    <v-col cols="12" class="py-1">
                      <v-select
                        v-model="editedItem.id_pacient"
                        :items="patients"
                        item-title="fullName"
                        item-value="id"
                        label="Pacient"
                        variant="outlined"
                        density="comfortable"
                        color="primary"
                        :rules="[v => !!v || 'Selectați pacientul']"
                      ></v-select>
                    </v-col>
                    
                    <v-col cols="12" class="py-1">
                      <v-text-field 
                        v-model="editedItem.diagnostic" 
                        label="Diagnostic" 
                        variant="outlined"
                        density="comfortable"
                        color="primary"
                        :rules="[v => !!v || 'Obligatoriu']"
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12" class="py-1">
                      <v-select
                        v-model="editedItem.id_pat"
                        :items="beds"
                        item-title="name"
                        item-value="id"
                        label="Pat"
                        variant="outlined"
                        density="comfortable"
                        color="primary"
                        :rules="[v => !!v || 'Selectați patul']"
                      ></v-select>
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

        <!-- Dialog Fișă Medicală -->
        <v-dialog v-model="medicalFileDialog" max-width="800px">
          <v-card class="rounded-xl overflow-hidden">
            <v-card-title class="bg-primary text-white py-4 px-6 d-flex align-center justify-space-between">
              <span class="text-h5 font-weight-bold text-truncate" style="max-width: 70%;">
                <v-icon start class="mr-2">mdi-file-caduceus</v-icon>
                Fișă Medicală - {{ selectedAdmission?.Patient ? `${selectedAdmission.Patient.firstName} ${selectedAdmission.Patient.lastName}` : '' }}
              </span>
              <div class="d-flex align-center" style="gap: 8px;">
                <v-btn
                  prepend-icon="mdi-file-pdf-box"
                  color="red-lighten-1"
                  variant="elevated"
                  size="small"
                  class="text-white font-weight-bold"
                  @click="generatePatientReportPDF"
                >
                  Raport PDF
                </v-btn>
                <v-btn icon="mdi-close" variant="text" color="white" @click="medicalFileDialog = false"></v-btn>
              </div>
            </v-card-title>
            
            <v-card-text class="pa-6">
              <!-- Patient Details summary -->
              <v-row class="mb-4 bg-grey-lighten-4 rounded-lg pa-4 mx-0">
                <v-col cols="12" sm="6" class="py-1">
                  <strong>Diagnostic:</strong> {{ selectedAdmission?.diagnostic }}
                </v-col>
                <v-col cols="12" sm="6" class="py-1">
                  <strong>Cod Internare:</strong> {{ selectedAdmission?.cod_internare }}
                </v-col>
                <v-col cols="12" sm="6" class="py-1">
                  <strong>Pat:</strong> {{ selectedAdmission?.Pat ? `${selectedAdmission.Pat.Salon.Sectie.nume} / Salon ${selectedAdmission.Pat.Salon.cod_salon} / Pat ${selectedAdmission.Pat.cod_pat}` : 'Nealocat' }}
                </v-col>
                <v-col cols="12" sm="6" class="py-1">
                  <strong>Data Internare:</strong> {{ selectedAdmission?.data_internare ? new Date(selectedAdmission.data_internare).toLocaleDateString('ro-RO') : '' }}
                </v-col>
              </v-row>

              <v-tabs v-model="medicalTab" color="primary" grow>
                <v-tab value="treatments"><v-icon start>mdi-pill</v-icon>Tratamente</v-tab>
                <v-tab value="vitals"><v-icon start>mdi-heart-pulse</v-icon>Măsurători Vitals</v-tab>
              </v-tabs>

              <v-window v-model="medicalTab" class="mt-4">
                <!-- Window Tratamente -->
                <v-window-item value="treatments">
                  <!-- Prescribe new treatment (Doctor only) -->
                  <v-card v-if="isMedic || isAdmin" variant="outlined" class="pa-4 mb-4 rounded-lg">
                    <h3 class="text-subtitle-1 font-weight-bold mb-2">Prescrie Tratament Nou</h3>
                    <v-form ref="treatmentForm" @submit.prevent="addTreatment">
                      <v-textarea
                        v-model="newTreatmentDesc"
                        label="Descrierea tratamentului (ex: Algocalmin 1 fiole la 8 ore)"
                        variant="outlined"
                        rows="2"
                        :rules="[v => !!v || 'Descrierea este obligatorie']"
                      ></v-textarea>
                      <div class="d-flex justify-end mt-2">
                        <v-btn color="primary" type="submit" :loading="treatmentLoading">Prescrie</v-btn>
                      </div>
                    </v-form>
                  </v-card>

                  <!-- List of active treatments -->
                  <h3 class="text-subtitle-1 font-weight-bold mb-3">Istoric Tratamente Prescrise</h3>
                  <v-list v-if="medicalTreatments.length" class="bg-transparent pa-0">
                    <v-card v-for="t in medicalTreatments" :key="t.id" class="mb-3 rounded-lg border pa-4">
                      <div class="d-flex justify-space-between align-start">
                        <div>
                          <div class="text-body-1 font-weight-bold text-grey-darken-3">{{ t.descriere }}</div>
                          <div class="text-caption text-grey-darken-1">Prescris la: {{ new Date(t.data_tratament).toLocaleString('ro-RO') }}</div>
                        </div>
                        <!-- Administer Button (Nurse only or Doctor/Admin) -->
                        <v-btn
                          v-if="isAsistent || isMedic || isAdmin"
                          size="small"
                          color="green"
                          variant="tonal"
                          prepend-icon="mdi-check"
                          @click="openAdministerDialog(t)"
                        >
                          Administrează
                        </v-btn>
                      </div>

                      <!-- Administration history for this treatment -->
                      <v-divider class="my-2" v-if="t.Administrares && t.Administrares.length"></v-divider>
                      <div v-if="t.Administrares && t.Administrares.length">
                        <div class="text-caption font-weight-bold text-grey-darken-2">Administrări:</div>
                        <v-list density="compact" class="bg-transparent py-0">
                          <v-list-item v-for="adm in t.Administrares" :key="adm.id" class="px-0 py-1">
                            <template v-slot:prepend>
                              <v-icon size="small" color="success" class="mr-1">mdi-check-circle</v-icon>
                            </template>
                            <span class="text-body-2">
                              Administrat de <strong>{{ adm.nume_asistent }}</strong> la {{ new Date(adm.data_administrare).toLocaleString('ro-RO') }}
                              <span v-if="adm.observatii" class="text-grey-darken-1 italic"> (Obs: {{ adm.observatii }})</span>
                            </span>
                          </v-list-item>
                        </v-list>
                      </div>
                    </v-card>
                  </v-list>
                  <div v-else class="text-center py-6 text-grey-darken-1">
                    Nu există tratamente prescrise pentru această internare.
                  </div>
                </v-window-item>

                <!-- Window Măsurători -->
                <v-window-item value="vitals">
                  <!-- Add vitals logs (Nurse only or Doctor/Admin) -->
                  <v-card v-if="isAsistent || isMedic || isAdmin" variant="outlined" class="pa-4 mb-4 rounded-lg">
                    <h3 class="text-subtitle-1 font-weight-bold mb-2">Adaugă Măsurători Noi</h3>
                    <v-form ref="vitalsForm" @submit.prevent="addVitals">
                      <v-row>
                        <v-col cols="12" sm="3" class="py-1">
                          <v-text-field v-model="newVitals.temperatura" label="Temp (°C)" type="number" step="0.1" variant="outlined" density="comfortable"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" class="py-1">
                          <v-text-field v-model="newVitals.tensiune" label="TA (ex: 120/80)" variant="outlined" density="comfortable"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" class="py-1">
                          <v-text-field v-model="newVitals.puls" label="Puls (bpm)" type="number" variant="outlined" density="comfortable"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" class="py-1">
                          <v-text-field v-model="newVitals.greutate" label="Greutate (kg)" type="number" step="0.1" variant="outlined" density="comfortable"></v-text-field>
                        </v-col>
                      </v-row>
                      <div class="d-flex justify-end mt-2">
                        <v-btn color="primary" type="submit" :loading="vitalsLoading">Adaugă</v-btn>
                      </div>
                    </v-form>
                  </v-card>

                  <!-- List of Vitals Logs -->
                  <h3 class="text-subtitle-1 font-weight-bold mb-3">Istoric Semne Vitale</h3>
                  <v-table v-if="medicalVitals.length" class="border rounded-lg">
                    <thead>
                      <tr>
                        <th>Dată/Oră</th>
                        <th>Temp</th>
                        <th>TA</th>
                        <th>Puls</th>
                        <th>Greutate</th>
                        <th>Logat de</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="v in medicalVitals" :key="v.id">
                        <td>{{ new Date(v.data_masurare).toLocaleString('ro-RO') }}</td>
                        <td>{{ v.temperatura ? `${v.temperatura} °C` : '-' }}</td>
                        <td>{{ v.tensiune || '-' }}</td>
                        <td>{{ v.puls ? `${v.puls} bpm` : '-' }}</td>
                        <td>{{ v.greutate ? `${v.greutate} kg` : '-' }}</td>
                        <td>{{ v.nume_asistent }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                  <div v-else class="text-center py-6 text-grey-darken-1">
                    Nu există măsurători înregistrate pentru această internare.
                  </div>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card>
        </v-dialog>

        <!-- Dialog Administrează Tratament -->
        <v-dialog v-model="administerDialog" max-width="400px">
          <v-card class="rounded-xl">
            <v-card-title class="bg-green text-white py-4 px-6">
              Administrează Tratament
            </v-card-title>
            <v-card-text class="pa-6">
              <div class="text-body-2 mb-3">
                Înregistrați administrarea pentru: <br/>
                <strong>{{ selectedTreatment?.descriere }}</strong>
              </div>
              <v-text-field
                v-model="administerNotes"
                label="Observații (ex: administrat oral, refuzat etc.)"
                variant="outlined"
              ></v-text-field>
            </v-card-text>
            <v-card-actions class="px-6 pb-6">
              <v-spacer></v-spacer>
              <v-btn color="grey" variant="text" @click="administerDialog = false">Anulează</v-btn>
              <v-btn color="success" variant="elevated" @click="submitAdministration" :loading="administerLoading">Confirmă</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        
        <!-- Dialog Externare și Recomandări -->
        <v-dialog v-model="dischargeDialog" max-width="500px">
          <v-card class="rounded-xl">
            <v-card-title class="d-flex align-center justify-space-between pa-6">
              <span class="text-h6 font-weight-bold">Confirmare Externare Pacient</span>
              <v-btn icon="mdi-close" variant="text" size="small" @click="dischargeDialog = false"></v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-6">
              <div class="text-body-2 mb-4 text-grey-darken-3">
                Scrieți mai jos recomandările medicale pentru pacient (ex: tratament post-spitalizare, regim alimentar, repaus):
              </div>
              <v-textarea
                v-model="dischargeRecommendations"
                label="Recomandări la externare"
                placeholder="Ex: Repaus la domiciliu 14 zile, regim hiposodat, tratament conform rețetei..."
                variant="outlined"
                rows="4"
                auto-grow
              ></v-textarea>
            </v-card-text>
            <v-card-actions class="px-6 pb-6">
              <v-spacer></v-spacer>
              <v-btn color="grey" variant="text" @click="dischargeDialog = false">Renunță</v-btn>
              <v-btn color="error" variant="elevated" @click="submitDischarge" :loading="dischargeLoading">Confirmă Externarea</v-btn>
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
const loading = ref(false);
const admissions = ref([]);
const patients = ref([]);
const beds = ref([]);
const dialog = ref(false);
const form = ref(null);

// Role Helpers
const userRole = computed(() => authStore.user?.role?.toLowerCase() || '');
const isAdmin = computed(() => userRole.value === 'admin');
const isMedic = computed(() => userRole.value === 'medic');
const isAsistent = computed(() => userRole.value === 'asistent');
const isReceptie = computed(() => userRole.value === 'registratură');

const canManageAdmissions = computed(() => isAdmin.value || isReceptie.value);
const canDischarge = computed(() => isAdmin.value || isMedic.value);
const canViewMedicalFile = computed(() => isAdmin.value || isMedic.value || isAsistent.value);

const headers = [
  { title: 'Cod Internare', key: 'cod_internare' },
  { title: 'Pacient', key: 'Patient' },
  { title: 'Pat', key: 'Pat' },
  { title: 'Diagnostic', key: 'diagnostic' },
  { title: 'Status', key: 'status' },
  { title: 'Acțiuni', key: 'actions', sortable: false, width: '280px' },
];

const defaultItem = { id_pacient: null, diagnostic: '', id_pat: null, status: 'internat' };
const editedItem = ref({ ...defaultItem });

// Medical File Dialog Refs
const medicalFileDialog = ref(false);
const selectedAdmission = ref(null);
const medicalTab = ref('treatments');
const medicalTreatments = ref([]);
const medicalVitals = ref([]);

const newTreatmentDesc = ref('');
const treatmentForm = ref(null);
const treatmentLoading = ref(false);

// Discharge Recommendations Dialog Refs
const dischargeDialog = ref(false);
const dischargeRecommendations = ref('');
const dischargeLoading = ref(false);
const selectedDischargeItem = ref(null);

const newVitals = ref({ temperatura: '', tensiune: '', puls: '', greutate: '' });
const vitalsLoading = ref(false);
const vitalsForm = ref(null);

const administerDialog = ref(false);
const selectedTreatment = ref(null);
const administerNotes = ref('');
const administerLoading = ref(false);

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

// Medical File Methods
const openMedicalFileDialog = (admission) => {
  selectedAdmission.value = admission;
  medicalFileDialog.value = true;
  fetchMedicalData();
};

const removeDiacritics = (text) => {
  if (!text) return '';
  return text
    .replace(/ș/g, 's').replace(/Ș/g, 'S')
    .replace(/ț/g, 't').replace(/Ț/g, 'T')
    .replace(/ş/g, 's').replace(/Ş/g, 'S')
    .replace(/ţ/g, 't').replace(/Ţ/g, 'T')
    .replace(/ă/g, 'a').replace(/Ă/g, 'A')
    .replace(/â/g, 'a').replace(/Â/g, 'A')
    .replace(/î/g, 'i').replace(/Î/g, 'I');
};

const generatePatientReportPDF = async () => {
  if (!selectedAdmission.value) return;

  try {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const doc = new jsPDF();
    const patientName = selectedAdmission.value.Patient 
      ? `${selectedAdmission.value.Patient.firstName} ${selectedAdmission.value.Patient.lastName}`
      : 'N/A';

    // 1. Antet (Printer-friendly: White background, black text, clean divider line)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(removeDiacritics('FISA MEDICALA PACIENT'), 15, 20);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`Generat la: ${new Date().toLocaleString('ro-RO')}`, 15, 28);
    
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(15, 33, 195, 33);

    // 2. Date Identificare & Internare
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(removeDiacritics('1. Date Identificare & Internare'), 15, 45);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    doc.text(removeDiacritics(`Nume Pacient: ${patientName}`), 15, 53);
    doc.text(`CNP: ${selectedAdmission.value.Patient?.cnp || 'N/A'}`, 15, 60);

    doc.text(`Cod Internare: ${selectedAdmission.value.cod_internare}`, 110, 53);
    doc.text(`Data Internarii: ${new Date(selectedAdmission.value.data_internare).toLocaleDateString('ro-RO')}`, 110, 60);

    const locationText = selectedAdmission.value.Pat 
      ? `${selectedAdmission.value.Pat.Salon.Sectie.nume} / Sal ${selectedAdmission.value.Pat.Salon.cod_salon} / Pat ${selectedAdmission.value.Pat.cod_pat}`
      : 'Nealocat';

    doc.text(removeDiacritics(`Locatie: ${locationText}`), 15, 67);

    const diagText = removeDiacritics(`Diagnostic: ${selectedAdmission.value.diagnostic}`);
    const splitDiag = doc.splitTextToSize(diagText, 180);
    doc.text(splitDiag, 15, 74);

    let yOffset = 74 + (splitDiag.length * 5);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(15, yOffset + 2, 195, yOffset + 2);

    // 3. Schema de Tratament Prescrisa
    yOffset += 12;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(removeDiacritics('2. Schema de Tratament Prescrisa'), 15, yOffset);

    const treatmentHeaders = [[removeDiacritics('Tratament'), removeDiacritics('Data Prescriere'), removeDiacritics('Administrari inregistrate')]];
    const treatmentBody = medicalTreatments.value.map(t => {
      const administrations = t.Administrares && t.Administrares.length
        ? t.Administrares.map(adm => `${adm.nume_asistent} (${new Date(adm.data_administrare).toLocaleString('ro-RO')})${adm.observatii ? ` Obs: ${adm.observatii}` : ''}`).join('\n')
        : 'Neadministrat';
      return [
        removeDiacritics(t.descriere),
        new Date(t.data_tratament).toLocaleString('ro-RO'),
        removeDiacritics(administrations)
      ];
    });

    autoTable(doc, {
      startY: yOffset + 5,
      head: treatmentHeaders,
      body: treatmentBody,
      theme: 'plain',
      headStyles: { fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9, textColor: [30, 30, 30] },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 40 },
        2: { cellWidth: 70 }
      },
      margin: { left: 15, right: 15 }
    });

    // 4. Monitorizare Semne Vitale
    const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || (yOffset + 40);
    
    let vitalsStartY = finalY + 12;
    if (vitalsStartY > 240) {
      doc.addPage();
      vitalsStartY = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(removeDiacritics('3. Monitorizare Semne Vitale'), 15, vitalsStartY);

    const vitalsHeaders = [[removeDiacritics('Data/Ora'), 'Temp (C)', removeDiacritics('Tensiune (TA)'), 'Puls (bpm)', 'Greutate (kg)', removeDiacritics('Logat de')]];
    const vitalsBody = medicalVitals.value.map(v => [
      new Date(v.data_masurare).toLocaleString('ro-RO'),
      v.temperatura ? `${v.temperatura} C` : '-',
      v.tensiune || '-',
      v.puls ? `${v.puls} bpm` : '-',
      v.greutate ? `${v.greutate} kg` : '-',
      removeDiacritics(v.nume_asistent)
    ]);

    autoTable(doc, {
      startY: vitalsStartY + 5,
      head: vitalsHeaders,
      body: vitalsBody,
      theme: 'plain',
      headStyles: { fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9, textColor: [30, 30, 30] },
      margin: { left: 15, right: 15 }
    });

    // Adaugare paginatie in subsol
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(`Pagina ${i} din ${pageCount}`, 195, 285, { align: 'right' });
      doc.text(removeDiacritics(`Sistem Hospital Manager - Raport Confidential: ${patientName}`), 15, 285);
    }

    const sanitizedFileName = removeDiacritics(patientName).replace(/\s+/g, '_');
    doc.save(`Fisa_Medicala_${sanitizedFileName}_${selectedAdmission.value.cod_internare}.pdf`);
    notify.show('Fișa medicală PDF a fost descărcată!', 'success');
  } catch (err) {
    console.error("Eroare generare PDF pacient:", err);
  }
};

const fetchMedicalData = async () => {
  if (!selectedAdmission.value) return;
  try {
    const [treatmentsRes, vitalsRes] = await Promise.all([
      axios.get(`/api/admissions/${selectedAdmission.value.id}/treatments`, getAuthHeader()),
      axios.get(`/api/admissions/${selectedAdmission.value.id}/vitals`, getAuthHeader())
    ]);
    medicalTreatments.value = treatmentsRes.data;
    medicalVitals.value = vitalsRes.data;
  } catch (err) {
    console.error("Eroare incarcare date medicale:", err);
    notify.show("Eroare la încărcarea datelor medicale", "error");
  }
};

const addTreatment = async () => {
  const { valid } = await treatmentForm.value.validate();
  if (!valid) return;
  
  treatmentLoading.value = true;
  try {
    await axios.post(`/api/admissions/${selectedAdmission.value.id}/treatments`, {
      descriere: newTreatmentDesc.value
    }, getAuthHeader());
    
    newTreatmentDesc.value = '';
    notify.show("Tratament prescris cu succes!", "success");
    fetchMedicalData();
  } catch (err) {
    console.error(err);
    notify.show("Eroare la prescrierea tratamentului", "error");
  } finally {
    treatmentLoading.value = false;
  }
};

const openAdministerDialog = (treatment) => {
  selectedTreatment.value = treatment;
  administerNotes.value = '';
  administerDialog.value = true;
};

const submitAdministration = async () => {
  administerLoading.value = true;
  try {
    await axios.post('/api/treatments/administer', {
      id_tratament: selectedTreatment.value.id,
      observatii: administerNotes.value
    }, getAuthHeader());
    
    administerDialog.value = false;
    notify.show("Administrare înregistrată cu succes!", "success");
    fetchMedicalData();
  } catch (err) {
    console.error(err);
    notify.show("Eroare la înregistrarea administrării", "error");
  } finally {
    administerLoading.value = false;
  }
};

const addVitals = async () => {
  vitalsLoading.value = true;
  try {
    await axios.post(`/api/admissions/${selectedAdmission.value.id}/vitals`, newVitals.value, getAuthHeader());
    
    newVitals.value = { temperatura: '', tensiune: '', puls: '', greutate: '' };
    notify.show("Măsurători adăugate cu succes!", "success");
    fetchMedicalData();
  } catch (err) {
    console.error(err);
    notify.show("Eroare la salvarea măsurătorilor", "error");
  } finally {
    vitalsLoading.value = false;
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

const generateBiletExternarePDF = async (admission, recommendations = '') => {
  try {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const [treatmentsRes, vitalsRes] = await Promise.all([
      axios.get(`/api/admissions/${admission.id}/treatments`, getAuthHeader()),
      axios.get(`/api/admissions/${admission.id}/vitals`, getAuthHeader())
    ]);
    const treatments = treatmentsRes.data;
    const vitals = vitalsRes.data;

    const doc = new jsPDF();

    const patientName = admission.Patient 
      ? `${admission.Patient.firstName} ${admission.Patient.lastName}`
      : 'N/A';

    // 1. Antet (Printer-friendly: White background, black text, clean divider line)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(removeDiacritics('BILET DE EXTERNARE'), 15, 20);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`Generat la: ${new Date().toLocaleString('ro-RO')}`, 15, 28);
    
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(15, 33, 195, 33);

    // 2. Date Identificare & Detalii Spitalizare
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(removeDiacritics('1. Date Identificare & Spitalizare'), 15, 45);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    doc.text(removeDiacritics(`Nume Pacient: ${patientName}`), 15, 53);
    doc.text(`CNP: ${admission.Patient?.cnp || 'N/A'}`, 15, 60);

    doc.text(`Cod Internare: ${admission.cod_internare}`, 110, 53);
    doc.text(`Data Internarii: ${new Date(admission.data_internare).toLocaleDateString('ro-RO')}`, 110, 60);
    doc.text(`Data Externarii: ${new Date().toLocaleDateString('ro-RO')}`, 110, 67);

    const locationText = admission.Pat 
      ? `${admission.Pat.Salon.Sectie.nume} / Sal ${admission.Pat.Salon.cod_salon} / Pat ${admission.Pat.cod_pat}`
      : 'Nealocat';

    doc.text(removeDiacritics(`Sectie/Locatie: ${locationText}`), 15, 67);

    const diagText = removeDiacritics(`Diagnostic externare: ${admission.diagnostic}`);
    const splitDiag = doc.splitTextToSize(diagText, 180);
    doc.text(splitDiag, 15, 74);

    let yOffset = 74 + (splitDiag.length * 5);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(15, yOffset + 2, 195, yOffset + 2);

    // 3. Recomandari medicale la externare
    yOffset += 12;
    if (recommendations) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(removeDiacritics('2. Recomandari Medicale la Externare'), 15, yOffset);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const splitRecs = doc.splitTextToSize(removeDiacritics(recommendations), 180);
      doc.text(splitRecs, 15, yOffset + 7);
      
      yOffset += 7 + (splitRecs.length * 5);
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.line(15, yOffset + 2, 195, yOffset + 2);
      yOffset += 12;
    } else {
      yOffset += 2;
    }

    // 4. Schema de Tratament Urmată / Recomandată
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(removeDiacritics('3. Schema de Tratament din timpul Spitalizarii'), 15, yOffset);

    const treatmentHeaders = [[removeDiacritics('Tratament Prescris'), removeDiacritics('Data Prescrierii')]];
    const treatmentBody = treatments.map(t => [
      removeDiacritics(t.descriere),
      new Date(t.data_tratament).toLocaleString('ro-RO')
    ]);

    autoTable(doc, {
      startY: yOffset + 5,
      head: treatmentHeaders,
      body: treatmentBody.length ? treatmentBody : [[removeDiacritics('Nu au fost prescrise tratamente specifice pe parcursul spitalizarii.'), '-']],
      theme: 'plain',
      headStyles: { fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9, textColor: [30, 30, 30] },
      margin: { left: 15, right: 15 }
    });

    // 5. Partea de semnătură/parafă medic
    const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || (yOffset + 40);
    let signY = finalY + 25;
    if (signY > 260) {
      doc.addPage();
      signY = 40;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(removeDiacritics('Semnatura si Parafa Medic,'), 140, signY);
    doc.line(140, signY + 15, 190, signY + 15);

    // Footer pe pagini
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(`Pagina ${i} din ${pageCount}`, 195, 285, { align: 'right' });
      doc.text(removeDiacritics(`Sistem Hospital Manager - Bilet de Externare: ${patientName}`), 15, 285);
    }

    const sanitizedFileName = removeDiacritics(patientName).replace(/\s+/g, '_');
    doc.save(`Bilet_de_Externare_${sanitizedFileName}_${admission.cod_internare}.pdf`);
  } catch (err) {
    console.error("Eroare generare PDF bilet externare:", err);
    notify.show("Eroare la generarea biletului de externare PDF", "error");
  }
};

// Externare pacient - Deschidere dialog
const openDischargeDialog = (item) => {
  selectedDischargeItem.value = item;
  dischargeRecommendations.value = '';
  dischargeDialog.value = true;
};

// Confirmare externare din dialog
const submitDischarge = async () => {
  if (!selectedDischargeItem.value) return;
  
  dischargeLoading.value = true;
  try {
    await axios.post(`/api/admissions/${selectedDischargeItem.value.id}/discharge`, {}, getAuthHeader());
    notify.show('Pacient externat cu succes! Se descarcă biletul de externare...', 'success');
    
    // Generăm biletul de externare cu recomandările trimise de utilizator
    await generateBiletExternarePDF(selectedDischargeItem.value, dischargeRecommendations.value);
    
    dischargeDialog.value = false;
    fetchData();
  } catch (error) {
    console.error(error);
    notify.show("Eroare la externare", 'error');
  } finally {
    dischargeLoading.value = false;
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
  } else if (status === 'admis') {
      return 'blue';
  } else {
      return 'grey';
  }
};

onMounted(() => { 
    fetchData(); 
});
</script>
