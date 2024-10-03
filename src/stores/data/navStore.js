import { defineStore } from "pinia/dist/pinia";
import { ref } from "vue";

export const useNavStore = defineStore('navStore', () => {

    const routeInfo = ref({})
    const setRouteInfo = val => routeInfo.value = val
    const includes = ref([])
    return { routeInfo, setRouteInfo, includes }
})