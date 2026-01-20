import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        // Luăm tokenul din localStorage dacă userul dă refresh la pagină
        token: localStorage.getItem('token') || null,
        user: JSON.parse(localStorage.getItem('user')) || null
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin'
    },
    actions: {
        async login(email, password) {
            try {
                // Facem cererea către Backend-ul nostru
                const res = await axios.post('http://localhost:3000/api/auth/login', { 
                    email, 
                    password 
                });

                // Dacă e succes, salvăm datele
                this.token = res.data.token;
                this.user = res.data.user;

                // Le salvăm și în browser (să nu dispară la refresh)
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                
                return true; // Returnăm succes
            } catch (error) {
                console.error("Login failed:", error);
                throw error.response?.data?.message || "Login failed";
            }
        },

        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
});