import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
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
                const res = await axios.post('http://localhost:3000/api/auth/login', {
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
        async register(email, password) {
            try {
                // Folosim FormData pentru că backend-ul tău are upload.single('avatar')
                // Chiar dacă nu trimitem poză acum, formatul trebuie să fie multipart
                const formData = new FormData();
                formData.append('email', email);
                formData.append('password', password);
                formData.append('role', 'admin');

                await axios.post('http://localhost:3000/api/auth/register', formData);

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