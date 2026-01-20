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

                <h2 class="text-h4 mb-6 text-grey-darken-3">
                    Bună ziua, {{ userName }}! 👋
                </h2>

                <v-row>
                    <v-col cols="12" sm="6" md="3">
                        <v-card elevation="2" class="rounded-lg">
                            <v-card-text class="d-flex align-center">
                                <v-avatar color="blue-lighten-4" class="mr-4" size="50">
                                    <v-icon color="blue" size="30">mdi-account-injury</v-icon>
                                </v-avatar>
                                <div>
                                    <div class="text-caption text-grey">Pacienți Totali</div>
                                    <div class="text-h5 font-weight-bold">{{ stats.total }}</div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-card elevation="2" class="rounded-lg">
                            <v-card-text class="d-flex align-center">
                                <v-avatar color="orange-lighten-4" class="mr-4" size="50">
                                    <v-icon color="orange" size="30">mdi-bed</v-icon>
                                </v-avatar>
                                <div>
                                    <div class="text-caption text-grey">Pacienți Internați</div>
                                    <div class="text-h5 font-weight-bold">{{ stats.internati }}</div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-card elevation="2" class="rounded-lg">
                            <v-card-text class="d-flex align-center">
                                <v-avatar color="red-lighten-4" class="mr-4" size="50">
                                    <v-icon color="red" size="30">mdi-alert-circle</v-icon>
                                </v-avatar>
                                <div>
                                    <div class="text-caption text-grey">Urgențe</div>
                                    <div class="text-h5 font-weight-bold">{{ stats.urgente }}</div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row class="mt-4">
                    <v-col cols="12">
                        <v-card title="Internări Recente" elevation="2" class="rounded-lg">
                            <v-table>
                                <thead>
                                    <tr>
                                        <th class="text-left">Nume</th>
                                        <th class="text-left">Diagnostic</th>
                                        <th class="text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in stats.recenti" :key="item.id">
                                        <td>{{ item.lastName }} {{ item.firstName }}</td>
                                        <td>{{ item.diagnosis }}</td>
                                        <td>
                                            <v-chip :color="getStatusColor(item.status)" size="small" variant="flat"
                                                class="text-white">
                                                {{ item.status }}
                                            </v-chip>
                                        </td>
                                    </tr>
                                    <tr v-if="stats.recenti.length === 0">
                                        <td colspan="3" class="text-center text-grey">Nu există pacienți înregistrați.
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn variant="text" color="primary" to="/patients">Vezi toți pacienții</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>

            </v-container>
        </v-main>
    </v-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Sidebar from '../components/Sidebar.vue';

const authStore = useAuthStore();
const drawer = ref(true);

const userEmail = computed(() => authStore.user?.email || 'Guest');

const userName = computed(() => userEmail.value.split('@')[0]); 
const isAdmin = computed(() => authStore.isAdmin); 

const stats = ref({ total: 0, internati: 0, urgente: 0, recenti: [] });

const fetchStats = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/patients/dashboard-stats', {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        stats.value = res.data;
    } catch (error) {
        console.error("Nu am putut încărca statisticile", error);
    }
};

const getStatusColor = (status) => {
    if (status === 'internat') return 'orange';
    if (status === 'externat') return 'green';
    if (status === 'urgență') return 'red';
    return 'grey';
};


onMounted(() => {
    fetchStats();
});
</script>