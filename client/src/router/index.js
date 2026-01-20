import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Patients from '../views/Patients.vue';
import { useAuthStore } from '../store/auth';
import Users from '../views/Users.vue';

const routes = [
    { 
        path: '/login', 
        name: 'Login', 
        component: Login 
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
        meta: { requiresAuth: true } // Admin check e făcut în componentă
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