import { defineStore } from 'pinia'

export const useTabsStore = defineStore('tabs', {
    state: () => ({
        tabs: []
    }),
    actions: {
        addTab(tab) {
            this.tabs.push(tab);
        },
        removeTab(index) {
            this.tabs.splice(index, 1);
        }
    }
});