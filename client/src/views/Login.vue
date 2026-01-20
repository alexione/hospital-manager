<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Hospital Login</v-toolbar-title>
          </v-toolbar>
          
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field 
                v-model="email" 
                label="Email" 
                prepend-icon="mdi-account" 
                type="email"
                required
              ></v-text-field>

              <v-text-field 
                v-model="password" 
                label="Password" 
                prepend-icon="mdi-lock" 
                type="password"
                required
              ></v-text-field>

              <v-alert v-if="errorMessage" type="error" dense class="mb-3">
                {{ errorMessage }}
              </v-alert>

              <v-btn type="submit" color="primary" block :loading="loading">
                Autentificare
              </v-btn>

              <div class="text-center mt-4">
                <router-link to="/register" class="text-decoration-none text-primary font-weight-bold">
                  Nu ai cont? Înregistrează-te
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
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
    loading.value = true;
    errorMessage.value = '';
    
    try {
        await authStore.login(email.value, password.value);
        router.push('/dashboard');
    } catch (error) {
        errorMessage.value = error;
    } finally {
        loading.value = false;
    }
};
</script>