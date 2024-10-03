<script lang="js" setup>
import { defineComponent, onMounted, watch } from 'vue'
import VelMenu from "@/views/layouts/fragments/vel-menu.vue"
import VelContainer from '@/views/layouts/fragments/vel-container.vue';
import { useRoutesStore } from "@/stores/data/routesStore";
import { useNavStore } from '@/stores/data/navStore'
import { useRoute } from 'vue-router'
import { useDocumentWHStore } from "@/stores/data/documentWHStore";

const routesStore = useRoutesStore()
const navStore = useNavStore()
const documentWHStore = useDocumentWHStore()
const route = useRoute()

onMounted(() => {
  routeRecord(route.path)
  documentWHRecord();
  window.addEventListener('resize', () => {
    documentWHRecord();
  });
})

watch(() => route.path, (path) => {
  if (path === '/login') return
  routeRecord(path)
})

const routeRecord = (path) => {
  let route = routesStore.routes.find((item) => item.path === path)
  navStore.setRouteInfo(route)
  pageCache()
}

const pageCache = () => {
  let components = route.matched
  let lastCpt = components[components.length - 1]
  let lastCptName = lastCpt.components.default.__name
  let includes = navStore.includes
  if (!includes.find(item => item.cptName === lastCptName)) {
    includes.push({
      path: lastCpt.path,
      cptName: lastCptName
    })
  }
}

const documentWHRecord = () => {
  documentWHStore.wh.w = document.documentElement.clientWidth
  documentWHStore.wh.h = document.documentElement.clientHeight
}
</script>

<style scoped>
.vel_frame_main {
  height: 100vh;
}
</style>

<template>
  <section class="vel_frame_main">
    <vel-menu />
    <vel-container />
  </section>
</template>