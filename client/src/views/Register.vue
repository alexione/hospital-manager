<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 rounded-lg">
          <v-toolbar color="success" dark flat>
            <v-toolbar-title>Înregistrare Cont</v-toolbar-title>
          </v-toolbar>
          
          <v-card-text>
            <v-form @submit.prevent="handleRegister">
              <v-text-field 
                v-model="email" 
                label="Email" 
                prepend-icon="mdi-email" 
                type="email"
                required
              ></v-text-field>

              <v-text-field 
                v-model="password" 
                label="Parolă" 
                prepend-icon="mdi-lock" 
                type="password"
                required
              ></v-text-field>

              <v-text-field 
                v-model="confirmPassword" 
                label="Confirmă Parola" 
                prepend-icon="mdi-lock-check" 
                type="password"
                required
                :error-messages="passwordError"
              ></v-text-field>

              <v-alert v-if="errorMessage" type="error" dense class="mb-3" variant="tonal">
                {{ errorMessage }}
              </v-alert>

              <v-btn type="submit" color="success" block :loading="loading" class="mt-2">
                Creează Cont
              </v-btn>

              <div class="text-center mt-4">
                <router-link to="/login" class="text-decoration-none text-success font-weight-bold">
                  Ai deja cont? Autentifică-te
                </router-link>
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
import { useAuthStore } from '../store/auth';
import { useSnackbarStore } from '../store/snackbar';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const errorMessage = ref('');

const authStore = useAuthStore();
const notify = useSnackbarStore();
const router = useRouter();

const passwordError = computed(() => {
    return password.value === confirmPassword.value ? '' : 'Parolele nu coincid';
});

const handleRegister = async () => {
    if (password.value !== confirmPassword.value) return;
    
    loading.value = true;
    errorMessage.value = '';
    
    try {
        await authStore.register(email.value, password.value);
        notify.show('Cont creat cu succes! Te poți loga.', 'success');
        router.push('/login');
    } catch (error) {
        errorMessage.value = error;
    } finally {
        loading.value = false;
    }
};
</script>