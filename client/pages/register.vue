<template>
  <v-container class="fill-height justify-center align-center" fluid style="background: linear-gradient(135deg, #E0F2FE 0%, #E0E7FF 100%);">
    <v-row align="center" justify="center" class="w-100">
      <v-col cols="12" sm="10" md="6" lg="5">
        <v-card class="rounded-xl shadow-premium border-0 pa-6" elevation="0">
          <div class="text-center mb-6">
            <v-avatar color="success" size="64" class="mb-3 shadow-soft">
              <v-icon size="36" color="white">mdi-account-plus-outline</v-icon>
            </v-avatar>
            <h1 class="text-h4 font-weight-bold text-grey-darken-3">Înregistrare Cont</h1>
            <p class="text-body-2 text-grey-darken-1 mt-1">Creează un cont nou pentru a accesa sistemul</p>
          </div>
          
          <v-card-text class="pa-0">
            <v-form @submit.prevent="handleRegister">
              <v-row>
                <v-col cols="12" sm="6" class="py-1">
                  <v-text-field 
                    v-model="nume" 
                    label="Nume" 
                    prepend-inner-icon="mdi-account-outline" 
                    variant="outlined"
                    density="comfortable"
                    color="success"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" class="py-1">
                  <v-text-field 
                    v-model="prenume" 
                    label="Prenume" 
                    variant="outlined"
                    density="comfortable"
                    color="success"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-text-field 
                v-model="email" 
                label="Adresă Email" 
                prepend-inner-icon="mdi-email-outline" 
                type="email"
                variant="outlined"
                density="comfortable"
                class="mt-2"
                color="success"
                required
              ></v-text-field>

              <v-text-field 
                v-model="password" 
                label="Parolă" 
                prepend-inner-icon="mdi-lock-outline" 
                type="password"
                variant="outlined"
                density="comfortable"
                class="mt-2"
                color="success"
                required
              ></v-text-field>

              <v-text-field 
                v-model="confirmPassword" 
                label="Confirmă Parola" 
                prepend-inner-icon="mdi-lock-check-outline" 
                type="password"
                variant="outlined"
                density="comfortable"
                class="mt-2 mb-2"
                color="success"
                required
                :error-messages="passwordError"
              ></v-text-field>

              <v-alert v-if="errorMessage" type="error" dense class="mb-4 rounded-lg" variant="tonal">
                {{ errorMessage }}
              </v-alert>

              <v-btn type="submit" color="success" block :loading="loading" size="large" class="rounded-lg text-none font-weight-bold shadow-soft mt-2 text-white">
                Creează Cont
              </v-btn>

              <div class="text-center mt-6">
                <NuxtLink to="/login" class="text-decoration-none text-success font-weight-bold transition-all-fast hover-opacity">
                  Ai deja cont? Autentifică-te
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
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useSnackbarStore } from '../stores/snackbar';

const nume = ref('');
const prenume = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const errorMessage = ref('');

const authStore = useAuthStore();
const notify = useSnackbarStore();

const passwordError = computed(() => {
    return password.value === confirmPassword.value ? '' : 'Parolele nu coincid';
});

const handleRegister = async () => {
    if (password.value !== confirmPassword.value) return;
    
    loading.value = true;
    errorMessage.value = '';
    
    try {
        await authStore.register(nume.value, prenume.value, email.value, password.value);
        notify.show('Cont creat cu succes! Te poți loga.', 'success');
        navigateTo('/login');
    } catch (error) {
        errorMessage.value = error;
    } finally {
        loading.value = false;
    }
};
</script>
