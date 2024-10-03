import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useRoutesStore = defineStore('routesStore', () => {
    const routes = ref([])
    const menus = ref([])
    const hasLoadRoutes = ref(false)
    return { routes, menus, hasLoadRoutes }
})
