<script setup>
import { computed } from "vue";
import { useCollapseStateStore } from "@/stores/data/collapseStateStore";
import VelContainerHeader from "@/views/layouts/fragments/vel-container-header.vue";
import VelContainerPage from "@/views/layouts/fragments/vel-container-page.vue";

const collapseStateStore = useCollapseStateStore()
const containerPaddingLeft = computed(() => collapseStateStore.collapseState ? '64px' : '180px')
</script>
<template>
    <section class="vel_container" :style="{ paddingLeft: containerPaddingLeft }">
        <vel-container-header />
        <vel-container-page />
    </section>
</template>

<style scoped>
.vel_container {
    height: 100vh;
    background-color: #f6f8f9;
    transition: padding-left .5s;
}
</style>