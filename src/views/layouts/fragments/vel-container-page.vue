<script setup>
import { computed } from 'vue'
import { useNavStore } from "@/stores/data/navStore";

const navStore = useNavStore()
const includes = computed(() => {
    let includes_cache = navStore.includes
    let result = []
    includes_cache.forEach((item) => {
        result.push(item.cptName)
    })
    return result
})
</script>

<template>
    <section class="vel_container_page">
        <el-scrollbar>
            <router-view v-slot="{ Component }">
                <keep-alive :include="includes">
                    <component :is="Component" />
                </keep-alive>
            </router-view>
        </el-scrollbar>
    </section>
</template>

<style scoped>
.vel_container_page {
    height: calc(100vh - 90px);
}
</style>
