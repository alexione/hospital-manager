<template>
  <v-container class="fill-height justify-center align-center" fluid style="background: linear-gradient(135deg, #EEF2F6 0%, #E0E7FF 100%);">
    <v-row align="center" justify="center" class="w-100">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card class="rounded-xl shadow-premium border-0 pa-6" elevation="0">
          <div class="text-center mb-6">
            <v-avatar color="primary" size="64" class="mb-3 shadow-soft">
              <v-icon size="36" color="white">mdi-hospital-building</v-icon>
            </v-avatar>
            <h1 class="text-h4 font-weight-bold text-grey-darken-3">Hospital Manager</h1>
            <p class="text-body-2 text-grey-darken-1 mt-1">Introduceți datele pentru a vă conecta la panou</p>
          </div>
          
          <v-card-text class="pa-0">
            <v-form @submit.prevent="handleLogin">
              <v-text-field 
                v-model="email" 
                label="Adresă Email" 
                prepend-inner-icon="mdi-email-outline" 
                type="email"
                variant="outlined"
                density="comfortable"
                class="mb-3"
                color="primary"
                required
              ></v-text-field>
 
              <v-text-field 
                v-model="password" 
                label="Parolă" 
                prepend-inner-icon="mdi-lock-outline" 
                type="password"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                color="primary"
                required
              ></v-text-field>
 
              <v-alert v-if="errorMessage" type="error" dense class="mb-4 rounded-lg" variant="tonal">
                {{ errorMessage }}
              </v-alert>
 
              <v-btn type="submit" color="primary" block :loading="loading" size="large" class="rounded-lg text-none font-weight-bold shadow-soft">
                Autentificare
              </v-btn>
 
              <div class="text-center mt-6">
                <NuxtLink to="/register" class="text-decoration-none text-primary font-weight-bold transition-all-fast hover-opacity">
                  Nu ai cont? Înregistrează-te
                </NuxtLink>
              </div>
 
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

const authStore = useAuthStore();

const handleLogin = async () => {
    loading.value = true;
    errorMessage.value = '';
    
    try {
        await authStore.login(email.value, password.value);
        navigateTo('/dashboard');
    } catch (error) {
        errorMessage.value = error;
    } finally {
        loading.value = false;
    }
};
</script>
