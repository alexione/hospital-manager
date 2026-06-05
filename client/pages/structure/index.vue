<template>
  <v-layout class="fill-height">
    <Sidebar v-model="drawer" />

    <v-app-bar elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Structură Spital (Secții, Saloane, Paturi)</v-app-bar-title>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="pa-6">
        <!-- Main Actions & Title -->
        <div class="d-flex flex-wrap align-center justify-space-between mb-6 gap-4">
          <div>
            <h1 class="text-h4 font-weight-bold text-grey-darken-3 mb-1">Configurare Structură</h1>
            <p class="text-subtitle-1 text-grey-darken-1">Administrați secțiile, saloanele și paturile spitalului</p>
          </div>
          <v-btn
            v-if="isAdmin"
            color="primary"
            prepend-icon="mdi-plus"
            size="large"
            class="rounded-lg shadow-sm"
            @click="openDialog('sectie')"
          >
            Adaugă Secție
          </v-btn>
        </div>

        <!-- Section Selection Tabs -->
        <v-card v-if="structure.length" class="rounded-lg elevation-2 mb-6">
          <v-tabs
            v-model="activeSectieId"
            color="primary"
            show-arrows
            align-tabs="start"
          >
            <v-tab
              v-for="sectie in structure"
              :key="sectie.id"
              :value="sectie.id"
              class="text-body-1 font-weight-medium py-4 px-6"
              @click="selectSectie(sectie)"
            >
              <v-icon start>mdi-domain</v-icon>
              {{ sectie.nume }}
            </v-tab>
          </v-tabs>
        </v-card>

        <!-- No Sections Available -->
        <v-card v-else class="text-center py-12 px-6 rounded-lg elevation-2 bg-white">
          <v-icon color="grey-lighten-1" size="80" class="mb-4">mdi-hospital-building</v-icon>
          <h3 class="text-h5 font-weight-bold text-grey-darken-2 mb-2">Nu există secții înregistrate</h3>
          <p class="text-body-1 text-grey-darken-1 mb-6">Adăugați o primă secție pentru a începe configurarea spitalului.</p>
          <v-btn v-if="isAdmin" color="primary" prepend-icon="mdi-plus" size="large" @click="openDialog('sectie')">
            Adaugă Secție
          </v-btn>
        </v-card>

        <!-- Selected Section Panel -->
        <v-fade-transition hide-on-leave>
          <div v-if="selectedSectie">
            <!-- Section Info Header -->
            <v-card class="rounded-lg elevation-2 mb-6 bg-white border-start border-primary border-xl">
              <v-card-text class="d-flex flex-wrap align-center justify-space-between pa-6">
                <div>
                  <div class="text-overline text-primary font-weight-bold mb-1">Detalii Secție</div>
                  <h2 class="text-h5 font-weight-bold text-grey-darken-3">
                    {{ selectedSectie.nume }}
                  </h2>
                  <div class="text-subtitle-2 text-grey-darken-1 mt-1">
                    Cod Secție: <v-chip size="small" variant="tonal" color="primary" class="font-weight-bold">{{ selectedSectie.cod_sectie }}</v-chip>
                    <span class="mx-2">•</span>
                    Total Saloane: <span class="font-weight-bold">{{ selectedSectie.Salons ? selectedSectie.Salons.length : 0 }}</span>
                  </div>
                </div>
                <div class="d-flex flex-wrap gap-3 align-center">
                  <v-btn
                    v-if="canDownloadReports"
                    color="primary"
                    variant="elevated"
                    prepend-icon="mdi-file-pdf-box"
                    class="rounded-lg"
                    :loading="loadingPdf"
                    @click="generateBedsStatusPDF"
                  >
                    Situație Paturi (PDF)
                  </v-btn>
                  <v-btn
                    v-if="isAdmin"
                    color="orange-darken-1"
                    variant="elevated"
                    prepend-icon="mdi-plus"
                    class="rounded-lg"
                    @click="openDialog('salon')"
                  >
                    Adaugă Salon
                  </v-btn>
                  <v-btn
                    v-if="isAdmin"
                    color="red"
                    variant="outlined"
                    prepend-icon="mdi-delete"
                    class="rounded-lg"
                    @click="deleteSectie(selectedSectie.id)"
                  >
                    Șterge Secție
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>

            <!-- Salons List -->
            <div v-if="selectedSectie.Salons && selectedSectie.Salons.length">
              <v-card
                v-for="salon in selectedSectie.Salons"
                :key="salon.id"
                class="mb-6 elevation-2 rounded-lg border-start border-orange-darken-1 border-xl overflow-hidden"
              >
                <!-- Salon Header -->
                <v-toolbar flat color="grey-lighten-5" class="border-bottom px-4">
                  <v-icon color="orange-darken-1" class="mr-2" size="large">mdi-door-open</v-icon>
                  <span class="text-h6 font-weight-bold text-grey-darken-3">
                    Salon {{ salon.cod_salon }}
                  </span>
                  <v-spacer></v-spacer>
                  <div v-if="isAdmin" class="d-flex align-center gap-2">
                    <v-btn
                      prepend-icon="mdi-plus"
                      size="small"
                      color="green-darken-1"
                      variant="flat"
                      class="rounded-lg text-white font-weight-bold mr-2"
                      @click="openAddPatDialog(salon)"
                    >
                      Adaugă Pat
                    </v-btn>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="red"
                      size="small"
                      @click="deleteSalon(salon.id)"
                    ></v-btn>
                  </div>
                </v-toolbar>

                <!-- Beds Grid inside Salon -->
                <v-card-text class="pa-6 bg-white">
                  <v-row v-if="salon.Pats && salon.Pats.length">
                    <v-col
                      v-for="pat in salon.Pats"
                      :key="pat.id"
                      cols="12"
                      sm="6"
                      md="4"
                      lg="3"
                    >
                      <v-card
                        :class="[
                          'rounded-xl elevation-1 border transition-swing position-relative',
                          isOccupied(pat) 
                            ? 'border-red-lighten-3 bg-red-lighten-5' 
                            : 'border-green-lighten-3 bg-green-lighten-5'
                        ]"
                        hover
                      >
                        <v-card-text class="pa-4">
                          <div class="d-flex align-center justify-space-between mb-4">
                            <div class="d-flex align-center">
                              <v-avatar
                                :color="isOccupied(pat) ? 'red-lighten-4' : 'green-lighten-4'"
                                size="40"
                                class="mr-3"
                              >
                                <v-icon
                                  :color="isOccupied(pat) ? 'red-darken-2' : 'green-darken-2'"
                                  size="large"
                                >
                                  {{ isOccupied(pat) ? 'mdi-bed' : 'mdi-bed-empty' }}
                                </v-icon>
                              </v-avatar>
                              <div>
                                <span class="text-subtitle-1 font-weight-bold text-grey-darken-3 block">
                                  Pat {{ pat.cod_pat }}
                                </span>
                              </div>
                            </div>
                            
                            <!-- Delete Bed action -->
                            <v-btn
                              v-if="isAdmin"
                              icon="mdi-delete-outline"
                              variant="text"
                              color="red-lighten-1"
                              density="comfortable"
                              @click="deletePat(pat.id)"
                            ></v-btn>
                          </div>

                          <v-divider class="mb-3"></v-divider>

                          <!-- Bed Status Info -->
                          <div v-if="isOccupied(pat)">
                            <div class="d-flex align-center mb-2">
                              <v-chip color="red" size="x-small" class="font-weight-bold text-white uppercase mr-2">Ocupat</v-chip>
                            </div>
                            <div class="text-body-2 font-weight-bold text-grey-darken-4 text-truncate">
                              {{ getPatientName(pat) }}
                            </div>
                            <div class="text-caption text-grey-darken-1 text-truncate mt-1" :title="getPatientDiagnostic(pat)">
                              <strong>Diag:</strong> {{ getPatientDiagnostic(pat) || 'Fără diagnostic completat' }}
                            </div>
                          </div>
                          
                          <div v-else>
                            <div class="d-flex align-center mb-2">
                              <v-chip color="green" size="x-small" class="font-weight-bold text-white uppercase mr-2">Liber</v-chip>
                            </div>
                            <div class="text-body-2 text-grey-darken-1 italic py-1">
                              Pat disponibil pentru internare
                            </div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>

                  <!-- Empty Beds state -->
                  <div v-else class="text-center py-6 text-grey-darken-1">
                    <v-icon color="grey-lighten-1" size="48" class="mb-2">mdi-bed-off</v-icon>
                    <div class="text-body-1">Nu sunt paturi adăugate în acest salon.</div>
                    <v-btn 
                      v-if="isAdmin"
                      variant="text" 
                      color="green-darken-1" 
                      prepend-icon="mdi-plus" 
                      class="mt-2"
                      @click="openAddPatDialog(salon)"
                    >
                      Adaugă un pat
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </div>

            <!-- Empty Salons state -->
            <v-card v-else class="text-center py-12 px-6 rounded-lg elevation-2 bg-white">
              <v-icon color="grey-lighten-1" size="64" class="mb-3">mdi-door-closed</v-icon>
              <h3 class="text-h6 font-weight-bold text-grey-darken-2 mb-1">Nu există saloane în această secție</h3>
              <p class="text-body-2 text-grey-darken-1 mb-4">Adăugați un salon pentru a putea configura paturile.</p>
              <v-btn v-if="isAdmin" color="orange-darken-1" prepend-icon="mdi-plus" @click="openDialog('salon')">
                Adaugă Salon
              </v-btn>
            </v-card>
          </div>
        </v-fade-transition>

        <!-- Adaugare Resursa Dialog -->
        <v-dialog v-model="dialog" max-width="450px">
          <v-card class="rounded-xl overflow-hidden">
            <v-card-title class="bg-primary text-white py-4 px-6">
              <span class="text-h5 font-weight-bold">{{ dialogTitle }}</span>
            </v-card-title>
            
            <v-card-text class="pa-6">
              <v-form ref="form" @submit.prevent="save">
                
                <template v-if="dialogType === 'sectie'">
                  <div class="text-subtitle-2 text-grey-darken-1 mb-4">Introduceți numele și codul unic al secției noi.</div>
                  <v-text-field 
                    v-model="newItem.nume" 
                    label="Nume Secție" 
                    placeholder="ex: Cardiologie" 
                    variant="outlined" 
                    density="comfortable"
                    required
                    class="mb-3"
                  ></v-text-field>
                  <v-text-field 
                    v-model="newItem.cod_sectie" 
                    label="Cod Secție" 
                    placeholder="ex: CARD" 
                    variant="outlined" 
                    density="comfortable"
                    required
                  ></v-text-field>
                </template>

                <template v-if="dialogType === 'salon'">
                  <div class="text-subtitle-2 text-grey-darken-1 mb-4">
                    Adăugați un salon nou în secția: <strong>{{ selectedSectie?.nume }}</strong>
                  </div>
                  <v-text-field 
                    v-model="newItem.cod_salon" 
                    label="Cod Salon" 
                    placeholder="ex: 101" 
                    variant="outlined" 
                    density="comfortable"
                    required
                  ></v-text-field>
                </template>

                <template v-if="dialogType === 'pat'">
                  <div class="text-subtitle-2 text-grey-darken-1 mb-4">
                    Adăugați un pat în salonul: <strong>{{ selectedSalon?.cod_salon }}</strong> (Secția: {{ selectedSectie?.nume }})
                  </div>
                  <v-text-field 
                    v-model="newItem.cod_pat" 
                    label="Cod Pat" 
                    variant="outlined" 
                    density="comfortable"
                    required
                  ></v-text-field>
                </template>

              </v-form>
            </v-card-text>
            
            <v-card-actions class="px-6 pb-6 pt-0">
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" class="rounded-lg px-4" @click="dialog = false">Anulează</v-btn>
              <v-btn color="primary" variant="elevated" class="rounded-lg px-6" @click="save">Salvează</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Dialog confirmare stergere -->
        <v-dialog v-model="confirmDialog" max-width="450">
          <v-card class="rounded-xl">
            <v-card-title class="text-h5 text-red-darken-1 pa-6 pb-2 d-flex align-center">
              <v-icon color="red" class="mr-2" size="large">mdi-alert-circle</v-icon>
              Confirmare Ștergere
            </v-card-title>
            <v-card-text class="px-6 py-4 text-body-1 text-grey-darken-3">
              {{ confirmMessage }}
            </v-card-text>
            <v-card-actions class="px-6 pb-6 pt-2">
              <v-spacer></v-spacer>
              <v-btn color="grey-darken-1" variant="text" class="rounded-lg px-4" @click="confirmDialog = false">Renunță</v-btn>
              <v-btn color="red-darken-1" variant="elevated" class="rounded-lg px-6" @click="executeDelete">Șterge</v-btn>
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
const structure = ref([]);

const isAdmin = computed(() => authStore.isAdmin);
const canDownloadReports = computed(() => {
  const role = authStore.user?.role?.toLowerCase();
  return role !== 'recepție' && role !== 'receptie';
});
const loadingPdf = ref(false);

const selectedSectie = ref(null);
const selectedSalon = ref(null);
const activeSectieId = ref(null);

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

const selectSectie = (sectie) => {
  selectedSectie.value = sectie;
  selectedSalon.value = null;
  activeSectieId.value = sectie ? sectie.id : null;
};

const fetchStructure = async () => {
  try {
    const res = await axios.get('/api/structure', getAuthHeader());
    structure.value = res.data;
    
    // Păstrăm selecția activă dacă există
    if (selectedSectie.value) {
        const found = structure.value.find(s => s.id === selectedSectie.value.id);
        if (found) {
            selectedSectie.value = found;
            activeSectieId.value = found.id;
        } else {
            selectSectie(structure.value[0] || null);
        }
    } else if (structure.value.length > 0) {
        selectSectie(structure.value[0]);
    }
    
    if (selectedSalon.value && selectedSectie.value) {
        selectedSalon.value = selectedSectie.value.Salons.find(s => s.id === selectedSalon.value.id) || null;
    } else {
        selectedSalon.value = null;
    }
  } catch (error) { 
    console.error(error); 
  }
};

const openDialog = (type) => {
  dialogType.value = type;
  newItem.value = { nume: '', cod_sectie: '', cod_salon: '', cod_pat: '' };
  
  // Generare sugestie cod pat automat:
  if (type === 'pat' && selectedSalon.value) {
      const nrPaturiGata = selectedSalon.value.Pats ? selectedSalon.value.Pats.length + 1 : 1;
      newItem.value.cod_pat = `${selectedSalon.value.cod_salon}-P${nrPaturiGata}`;
  }
  
  dialog.value = true;
};

const openAddPatDialog = (salon) => {
  selectedSalon.value = salon;
  openDialog('pat');
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
    
    notify.show(`${dialogType.value === 'sectie' ? 'Secție' : dialogType.value === 'salon' ? 'Salon' : 'Pat'} adăugat(ă) cu succes!`, 'success');
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

const isOccupied = (pat) => {
  return pat.Internares && pat.Internares.some(i => i.status === 'internat');
};

const getPatientName = (pat) => {
  if (!pat.Internares) return '';
  const active = pat.Internares.find(i => i.status === 'internat');
  if (active && active.Patient) {
    return `${active.Patient.firstName} ${active.Patient.lastName}`;
  }
  return '';
};

const getPatientDiagnostic = (pat) => {
  if (!pat.Internares) return '';
  const active = pat.Internares.find(i => i.status === 'internat');
  return active ? active.diagnostic : '';
};

const generateBedsStatusPDF = async () => {
  if (!selectedSectie.value) return;
  loadingPdf.value = true;
  try {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const doc = new jsPDF();
    const sectie = selectedSectie.value;

    // Calculăm statisticile în timp real
    const totalSalons = sectie.Salons ? sectie.Salons.length : 0;
    let totalBeds = 0;
    let occupiedBeds = 0;
    let availableBeds = 0;

    const tableBody = [];

    if (sectie.Salons) {
      sectie.Salons.forEach(salon => {
        if (salon.Pats) {
          salon.Pats.forEach(pat => {
            totalBeds++;
            const occupied = isOccupied(pat);
            if (occupied) {
              occupiedBeds++;
            } else {
              availableBeds++;
            }

            const pName = getPatientName(pat);
            const pDiag = getPatientDiagnostic(pat);

            tableBody.push([
              `Salon ${salon.cod_salon}`,
              `Pat ${pat.cod_pat}`,
              occupied ? 'OCUPAT' : 'LIBER',
              occupied ? pName : '-',
              occupied ? (pDiag || 'Fără diagnostic completat') : '-'
            ]);
          });
        }
      });
    }

    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    // Culoare principală: Teal modern
    const primaryColor = [0, 150, 136];

    // 1. Antet profesional
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('SITUATIA OCUPARII PATURILOR', 15, 20);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Sectia: ${sectie.nume} (${sectie.cod_sectie})`, 15, 28);
    doc.text(`Generat la: ${new Date().toLocaleString('ro-RO')}  |  Utilizator: ${authStore.user?.email || 'N/A'}`, 15, 34);

    // 2. Casete indicatori statistici
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Indicatori de Capacitate si Ocupare', 15, 55);

    const startY = 62;
    const colWidth = 43;
    const boxHeight = 22;

    const metrics = [
      { label: 'Total Saloane', val: totalSalons, color: [33, 33, 33] },
      { label: 'Total Paturi', val: totalBeds, color: [33, 150, 243] },
      { label: 'Paturi Ocupate', val: occupiedBeds, color: [244, 67, 54] },
      { label: 'Paturi Libere', val: availableBeds, color: [76, 175, 80] }
    ];

    metrics.forEach((m, idx) => {
      const x = 15 + idx * (colWidth + 6);
      doc.setFillColor(248, 249, 250);
      doc.rect(x, startY, colWidth, boxHeight, 'F');
      doc.setDrawColor(222, 226, 230);
      doc.rect(x, startY, colWidth, boxHeight, 'D');

      doc.setTextColor(108, 117, 125);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text(m.label, x + 4, startY + 6);

      doc.setTextColor(m.color[0], m.color[1], m.color[2]);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(String(m.val), x + 4, startY + 16);
    });

    // Rata de ocupare vizuală
    const rateX = 15;
    const rateY = startY + boxHeight + 6;
    const rateWidth = 180;
    const rateHeight = 15;
    doc.setFillColor(240, 242, 245);
    doc.rect(rateX, rateY, rateWidth, rateHeight, 'F');
    doc.setDrawColor(206, 212, 218);
    doc.rect(rateX, rateY, rateWidth, rateHeight, 'D');

    doc.setTextColor(33, 33, 33);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Rata generala de ocupare a sectiei: ${occupancyRate}%`, rateX + 6, rateY + 9.5);

    // Bara de progres vizuală în PDF
    const barX = rateX + 95;
    const barY = rateY + 4.5;
    const barWidth = 75;
    const barHeight = 6;
    doc.setFillColor(222, 226, 230);
    doc.rect(barX, barY, barWidth, barHeight, 'F');
    if (occupancyRate > 0) {
      const fillWidth = (occupancyRate / 100) * barWidth;
      if (occupancyRate < 50) {
        doc.setFillColor(76, 175, 80); // verde
      } else if (occupancyRate < 85) {
        doc.setFillColor(255, 152, 0); // portocaliu
      } else {
        doc.setFillColor(244, 67, 54); // rosu
      }
      doc.rect(barX, barY, fillWidth, barHeight, 'F');
    }

    // 3. Tabel detaliat cu paturi
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Inventar Detaliat Paturi', 15, rateY + rateHeight + 15);

    autoTable(doc, {
      startY: rateY + rateHeight + 20,
      head: [['Salon', 'Identificator Pat', 'Stare Pat', 'Pacient Internat', 'Diagnostic']],
      body: tableBody.length ? tableBody : [['-', '-', 'Nu exista paturi inregistrate', '-', '-']],
      theme: 'grid',
      headStyles: { fillColor: primaryColor, halign: 'center', fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        0: { halign: 'center', fontStyle: 'bold' },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'left' },
        4: { halign: 'left' }
      },
      didParseCell: function(data) {
        if (data.column.index === 2 && data.cell.section === 'body') {
          if (data.cell.text[0] === 'OCUPAT') {
            data.cell.styles.textColor = [211, 47, 47];
            data.cell.styles.fontStyle = 'bold';
          } else if (data.cell.text[0] === 'LIBER') {
            data.cell.styles.textColor = [56, 142, 60];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      },
      margin: { left: 15, right: 15 }
    });

    // Footer pe pagini
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8.5);
      doc.setTextColor(150, 150, 150);
      doc.text(`Pagina ${i} din ${pageCount}`, 195, 287, { align: 'right' });
      doc.text(`Spitalul Clinic - Raport Capacitate Cazare Sectia ${sectie.nume}`, 15, 287);
    }

    doc.save(`Situatie_Paturi_${sectie.cod_sectie}_${new Date().toISOString().split('T')[0]}.pdf`);
    notify.show('Raportul privind situatia paturilor a fost descarcat cu succes!', 'success');
  } catch (err) {
    console.error('Error generating PDF:', err);
    notify.show('Eroare la generarea raportului PDF!', 'error');
  } finally {
    loadingPdf.value = false;
  }
};

onMounted(() => { fetchStructure(); });
</script>

<style scoped>
.transition-swing {
  transition: all 0.2s ease-in-out;
}
.transition-swing:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
}
.gap-2 {
  gap: 8px;
}
.gap-3 {
  gap: 12px;
}
.gap-4 {
  gap: 16px;
}
.block {
  display: block;
}
</style>
