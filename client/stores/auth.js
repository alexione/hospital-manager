import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => {
        const storedUser = localStorage.getItem('user');
        return {
            token: localStorage.getItem('token') || null,
            user: storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null
        };
    },
    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role?.toLowerCase() === 'admin'
    },
    actions: {
        async login(email, password) {
            try {
                const res = await axios.post('/api/auth/login', {
                    email,
                    password
                });

                this.token = res.data.token;
                this.user = res.data.user;

                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));

                return true;
            } catch (error) {
                console.error("Login failed:", error);
                throw error.response?.data?.message || "Login failed";
            }
        },
        async register(nume, prenume, email, password) {
            try {
                await axios.post('/api/auth/register', {
                    nume,
                    prenume,
                    email,
                    password,
                    role: 'Admin'
                });

                return true;
            } catch (error) {
                console.error("Register failed:", error);
                throw error.response?.data?.message || "Register failed";
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