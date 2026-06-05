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
            <v-btn v-if="canManageAdmissions" color="primary" prepend-icon="mdi-plus" @click="openDialog">Internare Nouă</v-btn>
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
              <div class="d-flex flex-column flex-sm-row" style="gap: 8px;">
                <v-btn 
                  size="small" 
                  color="primary" 
                  v-if="canViewMedicalFile" 
                  @click="openMedicalFileDialog(item)"
                  style="width: 120px;"
                  class="text-none font-weight-bold"
                >
                  Fișă Medicală
                </v-btn>
                <v-btn 
                  size="small" 
                  color="success" 
                  v-if="item.status === 'internat' && canDischarge" 
                  @click="discharge(item)"
                  style="width: 120px;"
                  class="text-none font-weight-bold"
                >
                  Externează
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>

        <!-- Dialog Internare Noua -->
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
                        label="Pat"
                        :rules="[v => !!v || 'Selectați patul']"
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
const drawer = ref(false);
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
const isReceptie = computed(() => userRole.value === 'recepție');

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
const treatmentLoading = ref(false);
const treatmentForm = ref(null);

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

const generatePatientReportPDF = async () => {
  if (!selectedAdmission.value) return;

  try {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const doc = new jsPDF();
    const primaryColor = [13, 71, 161]; // Navy Blue

    const patientName = selectedAdmission.value.Patient 
      ? `${selectedAdmission.value.Patient.firstName} ${selectedAdmission.value.Patient.lastName}`
      : 'N/A';

    // 1. Antet
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FISA MEDICALA PACIENT', 15, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generat la: ${new Date().toLocaleString('ro-RO')}`, 15, 30);

    // 2. Date Identificare & Internare
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Date Identificare & Internare', 15, 52);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const detailsLeft = [
      `Nume Pacient: ${patientName}`,
      `CNP: ${selectedAdmission.value.Patient?.cnp || 'N/A'}`,
      `Diagnostic: ${selectedAdmission.value.diagnostic}`
    ];

    const locationText = selectedAdmission.value.Pat 
      ? `${selectedAdmission.value.Pat.Salon.Sectie.nume} / Sal ${selectedAdmission.value.Pat.Salon.cod_salon} / Pat ${selectedAdmission.value.Pat.cod_pat}`
      : 'Nealocat';

    const detailsRight = [
      `Cod Internare: ${selectedAdmission.value.cod_internare}`,
      `Data Internarii: ${new Date(selectedAdmission.value.data_internare).toLocaleDateString('ro-RO')}`,
      `Locatie: ${locationText}`
    ];

    let yOffset = 60;
    for (let i = 0; i < detailsLeft.length; i++) {
      doc.text(detailsLeft[i], 15, yOffset);
      doc.text(detailsRight[i], 110, yOffset);
      yOffset += 7;
    }

    doc.setDrawColor(200, 200, 200);
    doc.line(15, yOffset + 2, 195, yOffset + 2);

    // 3. Schema de Tratament Prescrisa
    yOffset += 12;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Schema de Tratament Prescrisa', 15, yOffset);

    const treatmentHeaders = [['Tratament', 'Data Prescriere', 'Administrari inregistrate']];
    const treatmentBody = medicalTreatments.value.map(t => {
      const administrations = t.Administrares && t.Administrares.length
        ? t.Administrares.map(adm => `${adm.nume_asistent} (${new Date(adm.data_administrare).toLocaleString('ro-RO')})${adm.observatii ? ` Obs: ${adm.observatii}` : ''}`).join('\n')
        : 'Neadministrat';
      return [
        t.descriere,
        new Date(t.data_tratament).toLocaleString('ro-RO'),
        administrations
      ];
    });

    autoTable(doc, {
      startY: yOffset + 5,
      head: treatmentHeaders,
      body: treatmentBody,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 40 },
        2: { cellWidth: 70 }
      },
      margin: { left: 15, right: 15 }
    });

    // 4. Monitorizare Semne Vitale
    const finalY = doc.lastAutoTable.finalY || (yOffset + 15);
    
    let vitalsStartY = finalY + 15;
    if (vitalsStartY > 240) {
      doc.addPage();
      vitalsStartY = 25;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('3. Monitorizare Semne Vitale', 15, vitalsStartY);

    const vitalsHeaders = [['Data/Ora', 'Temp (C)', 'Tensiune (TA)', 'Puls (bpm)', 'Greutate (kg)', 'Logat de']];
    const vitalsBody = medicalVitals.value.map(v => [
      new Date(v.data_masurare).toLocaleString('ro-RO'),
      v.temperatura ? `${v.temperatura} C` : '-',
      v.tensiune || '-',
      v.puls ? `${v.puls} bpm` : '-',
      v.greutate ? `${v.greutate} kg` : '-',
      v.nume_asistent
    ]);

    autoTable(doc, {
      startY: vitalsStartY + 5,
      head: vitalsHeaders,
      body: vitalsBody,
      theme: 'striped',
      headStyles: { fillColor: [230, 81, 0], fontSize: 10, halign: 'center' }, // Orange accent
      bodyStyles: { fontSize: 9, halign: 'center' },
      columnStyles: {
        0: { halign: 'left', cellWidth: 40 },
        5: { halign: 'left', cellWidth: 40 }
      },
      margin: { left: 15, right: 15 }
    });

    // Adaugare paginatie in subsol
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(`Pagina ${i} din ${pageCount}`, 195, 285, { align: 'right' });
      doc.text(`Sistem Hospital Manager - Raport Confidential: ${patientName}`, 15, 285);
    }

    const sanitizedFileName = patientName.replace(/\s+/g, '_');
    doc.save(`Fisa_Medicala_${sanitizedFileName}_${selectedAdmission.value.cod_internare}.pdf`);
    notify.show('Fișa medicală PDF a fost descărcată!', 'success');
  } catch (err) {
    console.error("Eroare generare PDF pacient:", err);
    notify.show("Eroare la generarea raportului PDF", "error");
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
