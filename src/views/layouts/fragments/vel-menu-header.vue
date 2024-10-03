<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { useCollapseStateStore } from "@/stores/data/collapseStateStore";
import { useRouter } from 'vue-router';

const router = useRouter()
const collapseStateStore = useCollapseStateStore();

const collapseState = computed(() => collapseStateStore.collapseState)
const height = computed(() => collapseStateStore.collapseState ? '60px' : '80px')
const width = computed(() => collapseStateStore.collapseState ? '50px' : '130px')
const logoSize = computed(() => collapseStateStore.collapseState ? 30 : 44)
const marginBottom = computed(() => collapseStateStore.collapseState ? '0px' : '10px')
const fontHeight = computed(() => collapseStateStore.collapseState ? '0px' : '24px')

const showLogoName = ref(true)

watch(collapseState, (newVal) => {
    if (!newVal) {
        setTimeout(() => {
            showLogoName.value = true
        }, 200);
    } else {
        showLogoName.value = false
    }
})


</script>

<template>
    <section class="vel_menu_header" :style="{ height: height }">
        <div>
            <img src="/res/imgs/dodomax20-logo-white.png" alt="" :style="{ width: width }">
        </div>
    </section>
</template>

<style scoped>
.vel_menu_header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: height .5s;
    background: linear-gradient(90deg, #409eff 90%, #00537E 120%);
}

.vel_menu_header .el-icon {
    transition: font-size .5s, margin-bottom .5s;
}

.vel_menu_header_txt {
    color: #ffffff;
    font-size: 20px;
    transition: height .5s;
}
</style>