import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  const protectedRoutes = ['/dashboard', '/patients', '/users']

  if (protectedRoutes.includes(to.path) && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
