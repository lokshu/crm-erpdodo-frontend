<script setup>
import VelMenuHeader from "@/views/layouts/fragments/vel-menu-header.vue";
import { computed, ref } from "vue";
import { useCollapseStateStore } from "@/stores/data/collapseStateStore";
import { useRoutesStore } from "@/stores/data/routesStore";
import { useNavStore } from '@/stores/data/navStore'
import { useRouter } from "vue-router";

const router = useRouter()
const routesStore = useRoutesStore()
const navStore = useNavStore()
const collapseStateStore = useCollapseStateStore()

const collapseState = computed(() => collapseStateStore.collapseState)
const width = computed(() => collapseStateStore.collapseState ? '64px' : '180px')
const height = computed(() => collapseStateStore.collapseState ? '98px' : '118px')

const menus = computed(() => routesStore.menus)
//const activeIndex = computed(() => navStore.routeInfo.id)
const activeIndex = "0"
const goTo = (path) => router.push(path)

const search = ref()
const fetchEntities = () => {

}

</script>

<template>
    <section class="vel_menu" :style="{ width: width }">
        <vel-menu-header />
        <el-input class="menus-search-box" v-model="search" placeholder="Search" @keyup.enter="fetchEntities" clearable>
            <template #append>
                <el-button @click="fetchEntities"><el-icon class="el-icon--search">
                        <Search />
                    </el-icon></el-button>
            </template>
        </el-input>
        <div class="vel_menu_panel" :style="{ height: 'calc(100vh - ' + height + ')' }">
            <el-scrollbar>
                <el-menu class="el_menu_override" :default-active="activeIndex" :default-openeds="['1']"
                    :collapse="collapseState" background-color="#191a23" text-color="#d9d8d8">
                    <template v-for="menu in menus" :key="menu.id">
                        <el-sub-menu v-if="menu.children" :index="menu.id">
                            <template #title>
                                <el-icon>
                                    <component :is="menu.icon" />
                                </el-icon>
                                <span>{{ menu.label }}</span>
                            </template>
                            <div v-for="son in menu.children" :key="son.id">
                                <el-sub-menu v-if="son.children" :index="son.id">
                                    <template #title>
                                        <el-icon>
                                            <component :is="son.icon" />
                                        </el-icon>
                                        <span>{{ son.label }}</span>
                                    </template>
                                    <el-menu-item v-for="sun in son.children" @click="goTo(sun.path)" :index="sun.id"
                                        :key="sun.id">
                                        <el-icon>
                                            <component :is="sun.icon" />
                                        </el-icon>
                                        <template #title>
                                            {{ sun.label }}
                                        </template>
                                    </el-menu-item>
                                </el-sub-menu>
                                <el-menu-item @click="goTo(son.path)" :index="son.id" v-else>
                                    <el-icon>
                                        <component :is="son.icon" />
                                    </el-icon>
                                    <template #title>
                                        {{ son.label }}
                                    </template>
                                </el-menu-item>
                            </div>
                        </el-sub-menu>
                        <el-menu-item @click="goTo(menu.path)" :index="menu.id" v-else>
                            <el-icon>
                                <component :is="menu.icon" />
                            </el-icon>
                            <template #title>
                                {{ menu.label }}
                            </template>
                        </el-menu-item>
                    </template>
                </el-menu>
            </el-scrollbar>
        </div>
    </section>
</template>

<style scoped>
.vel_menu {
    height: 100vh;
    float: left;
    transition: width .5s;
}

.vel_menu_panel {
    background-color: #191a23;
    transition: height .5s;
}

.el_menu_override {
    border-right: solid 1px #191a23;
}

.menus-search-box {
    padding: 5px;
    background-color: #191a23;
}

.menus-search-box .el-input__inner {
    padding: 1px 6px
}

.menus-search-box .el-input-group__append {
    padding: 0 15px
}
</style>
