import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Patients from '../views/Patients.vue';
import Users from '../views/Users.vue';
import { useAuthStore } from '../store/auth';

const routes = [
    { 
        path: '/login', 
        name: 'Login', 
        component: Login 
    },
    { 
        path: '/register', 
        name: 'Register', 
        component: Register 
    },
    { 
        path: '/', 
        redirect: '/login' 
    },
    { 
        path: '/dashboard', 
        name: 'Dashboard', 
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/patients',
        name: 'Patients',
        component: Patients,
        meta: { requiresAuth: true }
    },
    { 
        path: '/users', 
        name: 'Users', 
        component: Users, 
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

export default router;