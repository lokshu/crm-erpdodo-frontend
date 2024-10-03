import {defineStore} from "pinia/dist/pinia";
import {ref} from "vue";

export const useUserInfoStore = defineStore('userInfoStore', () => {
    const userInfo = ref({})
    const setUserInfo = val => userInfo.value = val

    const allLabels = ref([]);
    const setAllLabels = (labels) => {
        allLabels.value = labels;
    };
    const getLabelByModule = (moduleName) => (labelDefault) => {
        const label = allLabels.value.find(label => 
            label.moduleName === moduleName && label.labelDefault === labelDefault
        );
        return label ? label.content : labelDefault;
    };

    return {userInfo, setUserInfo, setAllLabels, getLabelByModule }
})