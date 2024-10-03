import { defineStore } from "pinia/dist/pinia";
import { ref } from "vue";

export const useCollapseStateStore = defineStore('collapseStateStore', () => {
    const collapseState = ref(false)
    const setCollapseState = val => collapseState.value = val
    return { collapseState, setCollapseState }
})