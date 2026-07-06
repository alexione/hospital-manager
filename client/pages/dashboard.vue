<template>
    <v-layout class="fill-height">

        <Sidebar v-model="drawer" />

        <v-app-bar elevation="0" class="border-b bg-white px-4">
            <v-app-bar-nav-icon @click="drawer = !drawer" color="indigo-darken-4"></v-app-bar-nav-icon>
            <v-app-bar-title class="font-weight-bold text-indigo-darken-4">Panou de Control</v-app-bar-title>

            <v-spacer></v-spacer>

            <div class="mr-4 d-flex align-center">
                <div class="text-right mr-3 d-none d-sm-block">
                    <div class="font-weight-bold text-grey-darken-3">{{ userEmail }}</div>
                    <div class="text-caption text-indigo font-weight-medium">
                      {{ isAdmin ? 'Administrator' : 'Personal Medical' }}
                    </div>
                </div>
                <v-avatar color="indigo-lighten-4" class="text-indigo-darken-4 font-weight-bold">
                    <v-icon icon="mdi-account"></v-icon>
                </v-avatar>
            </div>
        </v-app-bar>

        <v-main class="bg-slate-50">
            <v-container fluid class="pa-6">

                <div class="mb-6">
                    <h2 class="text-h4 font-weight-bold text-grey-darken-3">
                        Bun venit, {{ userName }}!
                    </h2>
                    <p class="text-subtitle-1 text-grey-darken-1">Sumarul activității și indicatorii de spitalizare de astăzi</p>
                </div>

                <!-- Row 1: Key Metrics -->
                <v-row>
                    <v-col cols="12" sm="6" md="4">
                        <v-card elevation="0" class="rounded-xl shadow-soft hover-scale card-stat-gradient-blue transition-all-fast">
                            <v-card-text class="d-flex align-center pa-6">
                                <v-avatar color="blue-lighten-4" class="mr-4 shadow-soft" size="60">
                                    <v-icon color="blue-darken-2" size="32">mdi-account-injury</v-icon>
                                </v-avatar>
                                <div>
                                    <div class="text-caption font-weight-bold text-blue-darken-3 text-uppercase">Pacienți Înregistrați</div>
                                    <div class="text-h4 font-weight-black text-blue-darken-4 mt-1">{{ stats.total }}</div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                        <v-card elevation="0" class="rounded-xl shadow-soft hover-scale card-stat-gradient-orange transition-all-fast">
                            <v-card-text class="d-flex align-center pa-6">
                                <v-avatar color="orange-lighten-4" class="mr-4 shadow-soft" size="60">
                                    <v-icon color="orange-darken-2" size="32">mdi-bed</v-icon>
                                </v-avatar>
                                <div>
                                    <div class="text-caption font-weight-bold text-orange-darken-3 text-uppercase">Pacienți Internați</div>
                                    <div class="text-h4 font-weight-black text-orange-darken-4 mt-1">{{ stats.internati }}</div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="12" sm="12" md="4">
                        <v-card elevation="0" class="rounded-xl shadow-soft hover-scale card-stat-gradient-teal transition-all-fast">
                            <v-card-text class="d-flex align-center pa-6">
                                <v-avatar color="teal-lighten-4" class="mr-4 shadow-soft" size="60">
                                    <v-icon color="teal-darken-2" size="32">mdi-percent</v-icon>
                                </v-avatar>
                                <div>
                                    <div class="text-caption font-weight-bold text-teal-darken-3 text-uppercase">Grad Ocupare Paturi</div>
                                    <div class="text-h4 font-weight-black text-teal-darken-4 mt-1">
                                        {{ generalOccupancy }}%
                                        <span class="text-caption text-teal-darken-2 font-weight-medium ml-1">
                                            ({{ reportsData?.paturiOcupateCount || 0 }}/{{ reportsData?.totalPaturi || 0 }})
                                        </span>
                                    </div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Row 2: Department Occupancy & PDF Reports -->
                <v-row class="mt-6">
                    <!-- Left: Department Stats Table -->
                    <v-col cols="12" md="8">
                        <v-card elevation="0" class="rounded-xl shadow-soft bg-white border fill-height">
                            <v-card-item class="py-4 border-b">
                                <v-card-title class="font-weight-bold text-grey-darken-3">Grad de Ocupare pe Secții</v-card-title>
                            </v-card-item>
                            <v-card-text class="pa-0">
                                <div style="overflow-x: auto;">
                                    <v-table hover class="px-4 pb-4" style="min-width: 600px;">
                                        <thead>
                                            <tr>
                                                <th class="text-left font-weight-bold text-grey-darken-3 py-3" style="min-width: 150px;">Secție</th>
                                                <th class="text-center font-weight-bold text-grey-darken-3">Cod</th>
                                                <th class="text-center font-weight-bold text-grey-darken-3">Saloane</th>
                                                <th class="text-center font-weight-bold text-grey-darken-3">Paturi</th>
                                                <th class="text-center font-weight-bold text-grey-darken-3" style="width: 150px;">Ocupare (%)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="sec in reportsData?.sectiiStats" :key="sec.id">
                                                <td class="text-left font-weight-bold text-grey-darken-3">{{ sec.nume }}</td>
                                                <td class="text-center">
                                                    <v-chip size="small" color="primary" variant="flat" class="font-weight-bold">
                                                        {{ sec.cod_sectie }}
                                                    </v-chip>
                                                </td>
                                                <td class="text-center">{{ sec.total_saloane }}</td>
                                                <td class="text-center font-weight-bold text-grey-darken-4">{{ sec.paturi_ocupate }} / {{ sec.total_paturi }}</td>
                                                <td class="text-center">
                                                    <div class="d-flex align-center justify-center">
                                                        <span class="mr-2 text-caption font-weight-bold text-grey-darken-3" style="width: 35px; text-align: right;">
                                                            {{ sec.grad_ocupare }}%
                                                        </span>
                                                        <v-progress-linear
                                                            :model-value="sec.grad_ocupare"
                                                            height="10"
                                                            rounded
                                                            :color="getOccupancyColor(sec.grad_ocupare)"
                                                            style="width: 80px;"
                                                            class="shadow-soft"
                                                        ></v-progress-linear>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr v-if="!reportsData?.sectiiStats?.length">
                                                <td colspan="5" class="text-center text-grey py-6">Nu există date despre secții.</td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <!-- Right: PDF Report Actions -->
                    <v-col cols="12" md="4">
                        <v-card elevation="0" class="rounded-xl shadow-soft bg-white border fill-height d-flex flex-column">
                            <v-card-item class="py-4 border-b">
                                <v-card-title class="font-weight-bold text-grey-darken-3">Rapoarte și Documente (PDF)</v-card-title>
                            </v-card-item>
                            <v-card-text class="flex-grow-1 d-flex flex-column justify-space-between pa-6">
                                <p class="text-body-2 text-grey-darken-1 mb-6">
                                    Generați documente PDF oficiale de activitate și liste de spitalizare pentru tipărire sau raportare administrativă.
                                </p>
                                <div class="d-flex flex-column gap-3 mb-6">
                                    <v-btn
                                        color="primary"
                                        prepend-icon="mdi-file-pdf-box"
                                        class="rounded-xl py-4 height-auto text-none justify-start shadow-soft"
                                        :loading="loadingReports"
                                        variant="elevated"
                                        block
                                        @click="generateGeneralReportPDF"
                                    >
                                        <div class="text-left py-1">
                                            <div class="font-weight-bold">Raport General Spital</div>
                                            <div class="text-caption text-indigo-lighten-4 font-weight-regular">Sumar indicatori și secții</div>
                                        </div>
                                    </v-btn>

                                    <v-btn
                                        color="orange-darken-2"
                                        prepend-icon="mdi-file-document-multiple-outline"
                                        class="rounded-xl py-4 height-auto text-none justify-start shadow-soft"
                                        :loading="loadingReports"
                                        variant="elevated"
                                        block
                                        @click="generateAdmittedPatientsPDF"
                                    >
                                        <div class="text-left py-1">
                                            <div class="font-weight-bold">Registru Pacienți Internați</div>
                                            <div class="text-caption text-orange-lighten-4 font-weight-regular">Fișa de vizită / Lista pacienți activi</div>
                                        </div>
                                    </v-btn>
                                </div>
                                <div class="text-caption text-grey text-center font-weight-medium">
                                    Format document: Standard A4 (PDF)
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Row 2.5: Demographics Charts -->
                <v-row class="mt-6">
                    <v-col cols="12">
                        <v-card elevation="0" class="rounded-xl shadow-soft bg-white border">
                            <v-card-item class="py-4 border-b">
                                <v-card-title class="font-weight-bold text-grey-darken-3">Statistici Demografice Pacienți</v-card-title>
                            </v-card-item>
                            <v-card-text class="pa-6">
                                <v-row>
                                    <v-col cols="12" sm="6" class="d-flex flex-column align-center border-e-sm py-4">
                                        <h3 class="text-subtitle-1 font-weight-bold text-indigo-darken-4 mb-4">Distribuție pe Vârste</h3>
                                        <div style="position: relative; height: 250px; max-width: 250px; width: 100%; margin: 0 auto;">
                                            <canvas id="ageChart"></canvas>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" sm="6" class="d-flex flex-column align-center py-4">
                                        <h3 class="text-subtitle-1 font-weight-bold text-indigo-darken-4 mb-4">Distribuție pe Sex</h3>
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
                <v-row class="mt-6">
                    <v-col cols="12">
                        <v-card elevation="0" class="rounded-xl shadow-soft bg-white border">
                            <v-card-item class="py-4 border-b">
                                <v-card-title class="font-weight-bold text-grey-darken-3">Internări Recente</v-card-title>
                            </v-card-item>
                            
                            <div style="overflow-x: auto;">
                                <v-data-table
                                    :headers="headers"
                                    :items="stats.recenti"
                                    hide-default-footer
                                    class="pa-4 bg-transparent"
                                    style="min-width: 600px;"
                                >
                                    <template v-slot:item.lastName="{ item }">
                                        <div class="font-weight-bold text-grey-darken-3">
                                          {{ item.lastName }} {{ item.firstName }}
                                        </div>
                                    </template>

                                    <template v-slot:item.status="{ item }">
                                        <v-chip 
                                            :color="getStatusColor(item.status)" 
                                            size="small" 
                                            variant="flat"
                                            class="text-white font-weight-bold"
                                        >
                                            {{ item.status }}
                                        </v-chip>
                                    </template>

                                    <template v-slot:no-data>
                                        <div class="text-grey py-6">Nu există pacienți înregistrați.</div>
                                    </template>
                                </v-data-table>
                            </div>

                            <v-divider></v-divider>
                            <v-card-actions class="pa-4 justify-end">
                                <v-btn variant="text" color="primary" to="/patients" class="font-weight-bold text-none rounded-lg">
                                    Vezi toți pacienții
                                </v-btn>
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
const drawer = ref(true);

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

const generateGeneralReportPDF = async () => {
    if (!reportsData.value) return;
    
    try {
        const { jsPDF } = await import('jspdf');
        const { autoTable } = await import('jspdf-autotable');
        
        const doc = new jsPDF();
        
        // 1. Antet (Printer-friendly: White background, black text, clean divider line)
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text(removeDiacritics('RAPORT GENERAL - HOSPITAL MANAGER'), 15, 20);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        doc.text(removeDiacritics(`Generat la: ${new Date().toLocaleString('ro-RO')}  |  Utilizator: ${userEmail.value}`), 15, 28);

        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(15, 33, 195, 33);
        
        // 2. Sectiunea: Indicatori Cheie
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(removeDiacritics('1. Indicatori Statistici Generali'), 15, 45);
        
        // Desenam cutii pentru indicatori
        const startY = 50;
        const colWidth = 55;
        const boxHeight = 18;
        
        const metrics = [
            { label: removeDiacritics('Pacienti Inregistrati'), val: reportsData.value.totalPacienti },
            { label: removeDiacritics('Pacienti Internati'), val: reportsData.value.totalInternati }
        ];
        
        metrics.forEach((m, idx) => {
            const x = 15 + idx * (colWidth + 8);
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.2);
            doc.rect(x, startY, colWidth, boxHeight, 'D');
            
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(8.5);
            doc.setFont('helvetica', 'normal');
            doc.text(m.label, x + 4, startY + 5);
            
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text(String(m.val), x + 4, startY + 13);
        });
        
        const metricsRow2 = [
            { label: removeDiacritics('Personal Medical'), val: reportsData.value.totalAngajati },
            { label: removeDiacritics('Capacitate Paturi'), val: `${reportsData.value.paturiOcupateCount} / ${reportsData.value.totalPaturi}` },
            { label: removeDiacritics('Grad General Ocupare'), val: `${reportsData.value.totalPaturi > 0 ? Math.round((reportsData.value.paturiOcupateCount / reportsData.value.totalPaturi) * 100) : 0}%` }
        ];
        
        metricsRow2.forEach((m, idx) => {
            const x = 15 + idx * (colWidth + 8);
            const y = startY + boxHeight + 5;
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.2);
            doc.rect(x, y, colWidth, boxHeight, 'D');
            
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(8.5);
            doc.setFont('helvetica', 'normal');
            doc.text(m.label, x + 4, y + 5);
            
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text(String(m.val), x + 4, y + 13);
        });
        
        // 3. Sectiunea: Distributie Paturi pe Sectii
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(removeDiacritics('2. Grad de Ocupare pe Sectii'), 15, startY + boxHeight * 2 + 15);
        
        const tableBody = reportsData.value.sectiiStats.map(s => [
            removeDiacritics(s.nume),
            s.cod_sectie,
            s.total_saloane,
            `${s.paturi_ocupate} / ${s.total_paturi}`,
            `${s.grad_ocupare}%`
        ]);
        
        autoTable(doc, {
            startY: startY + boxHeight * 2 + 20,
            head: [[removeDiacritics('Sectie'), 'Cod', 'Saloane', removeDiacritics('Paturi (Ocupate / Totale)'), 'Grad Ocupare']],
            body: tableBody,
            theme: 'plain',
            headStyles: { fontStyle: 'bold', fontSize: 9, halign: 'center' },
            bodyStyles: { fontSize: 8.5, halign: 'center' },
            columnStyles: { 0: { halign: 'left' } },
            margin: { left: 15, right: 15 }
        });
        
        // Footer pe toate paginile
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(120, 120, 120);
            doc.text(`Pagina ${i} din ${pageCount}`, 195, 285, { align: 'right' });
            doc.text(removeDiacritics('Sistem Hospital Manager - Raport Confidential'), 15, 285);
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
        const { autoTable } = await import('jspdf-autotable');
        
        const doc = new jsPDF();
        
        // 1. Antet (Printer-friendly: White background, black text, clean divider line)
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text(removeDiacritics('REGISTRU PACIENTI INTERNATI'), 15, 20);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        doc.text(removeDiacritics(`Generat la: ${new Date().toLocaleString('ro-RO')}  |  Total pacienti spitalizati: ${reportsData.value.totalInternati}`), 15, 28);

        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(15, 33, 195, 33);
        
        // 2. Tabelul cu pacienti
        const tableBody = reportsData.value.internariActive.map((int, index) => [
            index + 1,
            int.pacient ? removeDiacritics(`${int.pacient.lastName} ${int.pacient.firstName}`) : 'N/A',
            int.pacient ? int.pacient.cnp : 'N/A',
            removeDiacritics(int.diagnostic),
            int.pat ? removeDiacritics(`${int.pat.sectie} / Sal ${int.pat.salon} / Pat ${int.pat.cod_pat}`) : 'Nealocat',
            int.status.toUpperCase(),
            new Date(int.data_internare).toLocaleDateString('ro-RO')
        ]);
        
        autoTable(doc, {
            startY: 40,
            head: [['Nr', 'Nume Pacient', 'CNP', 'Diagnostic', 'Locatie (Sectie/Salon/Pat)', 'Status', 'Data Internarii']],
            body: tableBody,
            theme: 'plain',
            headStyles: { fontStyle: 'bold', fontSize: 9, halign: 'center' },
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
            doc.setFontSize(8);
            doc.setTextColor(120, 120, 120);
            doc.text(`Pagina ${i} din ${pageCount}`, 195, 285, { align: 'right' });
            doc.text(removeDiacritics('Sistem Hospital Manager - Registru Pacienti Internati'), 15, 285);
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
