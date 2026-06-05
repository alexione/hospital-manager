<template>
    <v-layout class="fill-height">

        <Sidebar v-model="drawer" />

        <v-app-bar elevation="1">
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-app-bar-title>Panou de Control</v-app-bar-title>

            <v-spacer></v-spacer>

            <div class="mr-4 d-flex align-center">
                <div class="text-right mr-3 d-none d-sm-block">
                    <div class="font-weight-bold">{{ userEmail }}</div>
                    <div class="text-caption text-medium-emphasis">{{ isAdmin ? 'Administrator' : 'Medic/Asistent' }}
                    </div>
                </div>
                <v-avatar color="secondary">
                    <v-icon icon="mdi-account"></v-icon>
                </v-avatar>
            </div>
        </v-app-bar>

        <v-main class="bg-grey-lighten-4">
            <v-container fluid class="pa-6">

                <h2 class="text-h5 text-sm-h4 mb-6 text-grey-darken-3">
                    Buna ziua, {{ userName }}!
                </h2>

                <!-- Row 1: Key Metrics -->
                <v-row>
                    <v-col cols="12" sm="6" md="4">
                        <v-card elevation="2" class="rounded-lg">
                            <v-card-text class="d-flex align-center">
                                <v-avatar color="blue-lighten-4" class="mr-4" size="50">
                                    <v-icon color="blue" size="30">mdi-account-injury</v-icon>
                                </v-avatar>
                                <div>
                                    <div class="text-caption text-grey">Pacienti Totali</div>
                                    <div class="text-h5 font-weight-bold">{{ stats.total }}</div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                        <v-card elevation="2" class="rounded-lg">
                            <v-card-text class="d-flex align-center">
                                <v-avatar color="orange-lighten-4" class="mr-4" size="50">
                                    <v-icon color="orange" size="30">mdi-bed</v-icon>
                                </v-avatar>
                                <div>
                                    <div class="text-caption text-grey">Pacienti Internati</div>
                                    <div class="text-h5 font-weight-bold">{{ stats.internati }}</div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="12" sm="12" md="4">
                        <v-card elevation="2" class="rounded-lg">
                            <v-card-text class="d-flex align-center">
                                <v-avatar color="teal-lighten-4" class="mr-4" size="50">
                                    <v-icon color="teal" size="30">mdi-percent</v-icon>
                                </v-avatar>
                                <div>
                                    <div class="text-caption text-grey">Grad Ocupare Paturi</div>
                                    <div class="text-h5 font-weight-bold">
                                        {{ generalOccupancy }}%
                                        <span class="text-caption text-grey-darken-1 font-weight-regular ml-1">
                                            ({{ reportsData?.paturiOcupateCount || 0 }}/{{ reportsData?.totalPaturi || 0 }})
                                        </span>
                                    </div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Row 2: Department Occupancy & PDF Reports -->
                <v-row class="mt-4">
                    <!-- Left: Department Stats Table -->
                    <v-col cols="12" md="8">
                        <v-card elevation="2" class="rounded-lg fill-height" title="Grad de Ocupare pe Sectii">
                            <v-card-text class="pa-0">
                                <div style="overflow-x: auto;">
                                    <v-table hover class="px-2 pb-2" style="min-width: 600px;">
                                        <thead>
                                            <tr>
                                                <th class="text-left font-weight-bold text-grey-darken-3" style="min-width: 150px;">Sectie</th>
                                                <th class="text-center font-weight-bold text-grey-darken-3">Cod</th>
                                                <th class="text-center font-weight-bold text-grey-darken-3">Saloane</th>
                                                <th class="text-center font-weight-bold text-grey-darken-3">Paturi</th>
                                                <th class="text-center font-weight-bold text-grey-darken-3" style="width: 150px;">Ocupare (%)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="sec in reportsData?.sectiiStats" :key="sec.id">
                                                <td class="text-left font-weight-medium">{{ sec.nume }}</td>
                                                <td class="text-center">
                                                    <v-chip size="small" color="primary" variant="tonal" class="font-weight-bold">
                                                        {{ sec.cod_sectie }}
                                                    </v-chip>
                                                </td>
                                                <td class="text-center">{{ sec.total_saloane }}</td>
                                                <td class="text-center font-weight-semibold">{{ sec.paturi_ocupate }} / {{ sec.total_paturi }}</td>
                                                <td class="text-center">
                                                    <div class="d-flex align-center justify-center">
                                                        <span class="mr-2 text-caption font-weight-bold" style="width: 35px; text-align: right;">
                                                            {{ sec.grad_ocupare }}%
                                                        </span>
                                                        <v-progress-linear
                                                            :model-value="sec.grad_ocupare"
                                                            height="8"
                                                            rounded
                                                            :color="getOccupancyColor(sec.grad_ocupare)"
                                                            style="width: 70px;"
                                                        ></v-progress-linear>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr v-if="!reportsData?.sectiiStats?.length">
                                                <td colspan="5" class="text-center text-grey py-4">Nu exista date despre sectii.</td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <!-- Right: PDF Report Actions -->
                    <v-col cols="12" md="4">
                        <v-card elevation="2" class="rounded-lg fill-height d-flex flex-column" title="Rapoarte și Documente (PDF)">
                            <v-card-text class="flex-grow-1 d-flex flex-column justify-space-between">
                                <p class="text-body-2 text-grey-darken-1 mb-4">
                                    Generati documente PDF oficiale de activitate și liste de spitalizare pentru tiparire sau raportare administrativa.
                                </p>
                                <div class="d-flex flex-column gap-3 mb-4">
                                    <v-btn
                                        color="primary"
                                        prepend-icon="mdi-file-pdf-box"
                                        class="rounded-lg py-3 height-auto text-none justify-start"
                                        :loading="loadingReports"
                                        variant="elevated"
                                        block
                                        @click="generateGeneralReportPDF"
                                    >
                                        <div class="text-left">
                                            <div class="font-weight-bold">Raport General Spital</div>
                                            <div class="text-caption text-blue-lighten-4 font-weight-regular">Sumar indicatori și sectii</div>
                                        </div>
                                    </v-btn>

                                    <v-btn
                                        color="orange-darken-2"
                                        prepend-icon="mdi-file-document-multiple-outline"
                                        class="rounded-lg py-3 height-auto text-none justify-start"
                                        :loading="loadingReports"
                                        variant="elevated"
                                        block
                                        @click="generateAdmittedPatientsPDF"
                                    >
                                        <div class="text-left">
                                            <div class="font-weight-bold">Registru Pacienti Internati</div>
                                            <div class="text-caption text-orange-lighten-4 font-weight-regular">Fisa de vizita / Lista pacienti activi</div>
                                        </div>
                                    </v-btn>
                                </div>
                                <div class="text-caption text-grey text-center">
                                    Format document: Standard A4 (PDF)
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Row 2.5: Demographics Charts -->
                <v-row class="mt-4">
                    <v-col cols="12">
                        <v-card elevation="2" class="rounded-lg" title="Statistici Demografice Pacienți">
                            <v-card-text class="pa-6">
                                <v-row>
                                    <v-col cols="12" sm="6" class="d-flex flex-column align-center">
                                        <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-2 mb-4">Distribuție pe Vârste</h3>
                                        <div style="position: relative; height: 250px; max-width: 250px; width: 100%; margin: 0 auto;">
                                            <canvas id="ageChart"></canvas>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" sm="6" class="d-flex flex-column align-center">
                                        <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-2 mb-4">Distribuție pe Sex</h3>
                                        <div style="position: relative; height: 250px; max-width: 250px; width: 100%; margin: 0 auto;">
                                            <canvas id="sexChart"></canvas>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Row 3: Recent Admissions -->
                <v-row class="mt-4">
                    <v-col cols="12">
                        <v-card title="Internari Recente" elevation="2" class="rounded-lg">
                            
                            <div style="overflow-x: auto;">
                                <v-data-table
                                    :headers="headers"
                                    :items="stats.recenti"
                                    hide-default-footer
                                    class="pa-2"
                                    style="min-width: 600px;"
                                >
                                    <template v-slot:item.lastName="{ item }">
                                        {{ item.lastName }} {{ item.firstName }}
                                    </template>

                                    <template v-slot:item.status="{ item }">
                                        <v-chip 
                                            :color="getStatusColor(item.status)" 
                                            size="small" 
                                            variant="flat"
                                            class="text-white"
                                        >
                                            {{ item.status }}
                                        </v-chip>
                                    </template>

                                    <template v-slot:no-data>
                                        <div class="text-grey">Nu exista pacienti înregistrati.</div>
                                    </template>
                                </v-data-table>
                            </div>

                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn variant="text" color="primary" to="/patients">Vezi toti pacientii</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>

            </v-container>
        </v-main>
    </v-layout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useSnackbarStore } from '../stores/snackbar';

import axios from 'axios';
import Sidebar from '../components/Sidebar.vue';

const authStore = useAuthStore();
const notify = useSnackbarStore();
const drawer = ref(false);

const userEmail = computed(() => authStore.user?.email || 'Guest');
const userName = computed(() => userEmail.value.split('@')[0]); 
const isAdmin = computed(() => authStore.isAdmin); 

const stats = ref({ total: 0, internati: 0, recenti: [] });
const reportsData = ref(null);
const loadingReports = ref(false);

const headers = [
    { title: 'Nume', key: 'lastName', sortable: false },
    { title: 'Diagnostic', key: 'diagnosis', sortable: false },
    { title: 'Status', key: 'status', sortable: false },
    { title: 'Salon', key: 'salon', sortable: false },
];

const generalOccupancy = computed(() => {
    if (!reportsData.value || !reportsData.value.totalPaturi) return 0;
    return Math.round((reportsData.value.paturiOcupateCount / reportsData.value.totalPaturi) * 100);
});

const getOccupancyColor = (val) => {
    if (val < 50) return 'green';
    if (val < 85) return 'orange';
    return 'red';
};

let ageChartInstance = null;
let sexChartInstance = null;

const renderCharts = async (demographics) => {
    if (!demographics) return;

    try {
        const { Chart } = await import('chart.js/auto');

        // Age Chart
        const ageCtx = document.getElementById('ageChart');
        if (ageCtx) {
            if (ageChartInstance) ageChartInstance.destroy();
            
            const ageLabels = Object.keys(demographics.ageDist);
            const ageData = Object.values(demographics.ageDist);
            
            ageChartInstance = new Chart(ageCtx, {
                type: 'doughnut',
                data: {
                    labels: ageLabels,
                    datasets: [{
                        data: ageData,
                        backgroundColor: [
                            'rgba(33, 150, 243, 0.8)', // blue
                            'rgba(76, 175, 80, 0.8)',  // green
                            'rgba(255, 152, 0, 0.8)',  // orange
                            'rgba(156, 39, 176, 0.8)'  // purple
                        ],
                        borderColor: '#ffffff',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Sex Chart
        const sexCtx = document.getElementById('sexChart');
        if (sexCtx) {
            if (sexChartInstance) sexChartInstance.destroy();

            const sexLabels = Object.keys(demographics.sexDist).filter(k => demographics.sexDist[k] > 0 || k !== 'Necunoscut');
            const sexData = sexLabels.map(l => demographics.sexDist[l]);

            sexChartInstance = new Chart(sexCtx, {
                type: 'doughnut',
                data: {
                    labels: sexLabels,
                    datasets: [{
                        data: sexData,
                        backgroundColor: [
                            'rgba(30, 136, 229, 0.8)', // Blue
                            'rgba(240, 98, 146, 0.8)', // Pink
                            'rgba(158, 158, 158, 0.8)' // Grey
                        ],
                        borderColor: '#ffffff',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    } catch (e) {
        console.error("Eroare la redarea graficelor: ", e);
    }
};

const fetchData = async () => {
    loadingReports.value = true;
    try {
        const resStats = await axios.get('/api/patients/dashboard-stats', {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        stats.value = resStats.data;

        const resReports = await axios.get('/api/reports/general', {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        reportsData.value = resReports.data;

        if (stats.value.demographics) {
            nextTick(() => {
                renderCharts(stats.value.demographics);
            });
        }
    } catch (error) {
        console.error("Nu am putut încarca statisticile", error);
        if (error.response && error.response.status === 401) {
            authStore.logout();
            navigateTo('/login');
        }
    } finally {
        loadingReports.value = false;
    }
};

const getStatusColor = (status) => {
    if (status === 'internat') return 'orange';
    if (status === 'externat') return 'green';
    if (status === 'admis') return 'blue';
    return 'grey';
};

const generateGeneralReportPDF = async () => {
    if (!reportsData.value) return;
    
    try {
        const { jsPDF } = await import('jspdf');
        const autoTable = (await import('jspdf-autotable')).default;
        
        const doc = new jsPDF();
        
        // Culoare principala (Navy Blue)
        const primaryColor = [13, 71, 161];
        
        // 1. Antet
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('RAPORT GENERAL - HOSPITAL MANAGER', 15, 20);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generat la: ${new Date().toLocaleString('ro-RO')}  |  Utilizator: ${userEmail.value}`, 15, 30);
        
        // 2. Sectiunea: Indicatori Cheie
        doc.setTextColor(33, 33, 33);
        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.text('1. Indicatori Statistici Generali', 15, 55);
        
        // Desenam cutii pentru indicatori
        const startY = 62;
        const colWidth = 55;
        const boxHeight = 20;
        
        const metrics = [
            { label: 'Pacienti Inregistrati', val: reportsData.value.totalPacienti },
            { label: 'Pacienti Internati', val: reportsData.value.totalInternati }
        ];
        
        metrics.forEach((m, idx) => {
            const x = 15 + idx * (colWidth + 8);
            doc.setFillColor(245, 245, 245);
            doc.rect(x, startY, colWidth, boxHeight, 'F');
            doc.setDrawColor(220, 220, 220);
            doc.rect(x, startY, colWidth, boxHeight, 'D');
            
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text(m.label, x + 4, startY + 6);
            
            doc.setTextColor(13, 71, 161);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(String(m.val), x + 4, startY + 15);
        });
        
        const metricsRow2 = [
            { label: 'Personal Medical', val: reportsData.value.totalAngajati },
            { label: 'Capacitate Paturi', val: `${reportsData.value.paturiOcupateCount} / ${reportsData.value.totalPaturi}` },
            { label: 'Grad General Ocupare', val: `${reportsData.value.totalPaturi > 0 ? Math.round((reportsData.value.paturiOcupateCount / reportsData.value.totalPaturi) * 100) : 0}%` }
        ];
        
        metricsRow2.forEach((m, idx) => {
            const x = 15 + idx * (colWidth + 8);
            const y = startY + boxHeight + 6;
            doc.setFillColor(245, 245, 245);
            doc.rect(x, y, colWidth, boxHeight, 'F');
            doc.setDrawColor(220, 220, 220);
            doc.rect(x, y, colWidth, boxHeight, 'D');
            
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text(m.label, x + 4, y + 6);
            
            doc.setTextColor(m.label.includes('Grad') ? 224 : 13, m.label.includes('Grad') ? 124 : 71, m.label.includes('Grad') ? 0 : 161);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(String(m.val), x + 4, y + 15);
        });
        
        // 3. Sectiunea: Distributie Paturi pe Sectii
        doc.setTextColor(33, 33, 33);
        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.text('2. Grad de Ocupare pe Sectii', 15, startY + boxHeight * 2 + 20);
        
        const tableBody = reportsData.value.sectiiStats.map(s => [
            s.nume,
            s.cod_sectie,
            s.total_saloane,
            `${s.paturi_ocupate} / ${s.total_paturi}`,
            `${s.grad_ocupare}%`
        ]);
        
        autoTable(doc, {
            startY: startY + boxHeight * 2 + 25,
            head: [['Sectie', 'Cod', 'Saloane', 'Paturi (Ocupate / Totale)', 'Grad Ocupare']],
            body: tableBody,
            theme: 'striped',
            headStyles: { fillColor: primaryColor, halign: 'center' },
            bodyStyles: { halign: 'center' },
            columnStyles: { 0: { halign: 'left' } },
            margin: { left: 15, right: 15 }
        });
        
        // Footer pe toate paginile
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            doc.text(`Pagina ${i} din ${pageCount}`, 195, 285, { align: 'right' });
            doc.text('Sistem Hospital Manager - Raport Confidential', 15, 285);
        }
        
        doc.save(`Raport_General_Spital_${new Date().toISOString().split('T')[0]}.pdf`);
        notify.show('Raportul general PDF a fost descarcat!', 'success');
    } catch (e) {
        console.error(e);
        notify.show('Eroare la generarea raportului PDF', 'error');
    }
};

const generateAdmittedPatientsPDF = async () => {
    if (!reportsData.value) return;
    
    try {
        const { jsPDF } = await import('jspdf');
        const autoTable = (await import('jspdf-autotable')).default;
        
        const doc = new jsPDF();
        
        // Culoare secundara (Orange/Deep Orange)
        const headerColor = [230, 81, 0]; 
        
        // 1. Antet
        doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('REGISTRU PACIENTI INTERNATI', 15, 20);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generat la: ${new Date().toLocaleString('ro-RO')}  |  Total pacienti spitalizati: ${reportsData.value.totalInternati}`, 15, 30);
        
        // 2. Tabelul cu pacienti
        const tableBody = reportsData.value.internariActive.map((int, index) => [
            index + 1,
            int.pacient ? `${int.pacient.lastName} ${int.pacient.firstName}` : 'N/A',
            int.pacient ? int.pacient.cnp : 'N/A',
            int.diagnostic,
            int.pat ? `${int.pat.sectie} / Sal ${int.pat.salon} / Pat ${int.pat.cod_pat}` : 'Nealocat',
            int.status.toUpperCase(),
            new Date(int.data_internare).toLocaleDateString('ro-RO')
        ]);
        
        autoTable(doc, {
            startY: 50,
            head: [['Nr', 'Nume Pacient', 'CNP', 'Diagnostic', 'Locatie (Sectie/Salon/Pat)', 'Status', 'Data Internarii']],
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: headerColor, fontSize: 9, halign: 'center' },
            bodyStyles: { fontSize: 8 },
            columnStyles: { 
                0: { halign: 'center' },
                1: { fontStyle: 'bold' },
                5: { halign: 'center' },
                6: { halign: 'center' }
            },
            margin: { left: 10, right: 10 }
        });
        
        // Footer pe toate paginile
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            doc.text(`Pagina ${i} din ${pageCount}`, 195, 285, { align: 'right' });
            doc.text('Sistem Hospital Manager - Registru Pacienti Internati', 15, 285);
        }
        
        doc.save(`Registru_Internari_${new Date().toISOString().split('T')[0]}.pdf`);
        notify.show('Registrul pacientilor internati PDF a fost descarcat!', 'success');
    } catch (e) {
        console.error(e);
        notify.show('Eroare la generarea registrului de pacienti', 'error');
    }
};

onMounted(() => {
    fetchData();
});
</script>

<style scoped>
.gap-3 {
    gap: 12px;
}
.height-auto {
    height: auto !important;
}
.font-weight-semibold {
    font-weight: 600;
}
/* Ensure button content wraps on extra-small mobile viewports */
:deep(.v-btn) {
    white-space: normal !important;
}
:deep(.v-btn__content) {
    white-space: normal !important;
    text-align: left !important;
    width: 100%;
}
</style>
