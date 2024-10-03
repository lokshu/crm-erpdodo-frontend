<script setup>
import { ref, watch, onMounted } from "vue"
import { useNavStore } from "@/stores/data/navStore"
import { useRouter } from "vue-router"

const router = useRouter()
const navStore = useNavStore()

const tabs = ref([])
const activeTab = ref('')

onMounted(() => {
    let routeInfo = navStore.routeInfo
    tabsChange(routeInfo)
})

watch(() => navStore.routeInfo, (routeInfo) => {
    tabsChange(routeInfo)
})

const tabsChange = (routeInfo) => {
    if (Object.keys(routeInfo).length === 0) {
        return
    }
    let findTab = tabs.value.find((tab) => tab.path === routeInfo.path)
    if (findTab) {
        activeTab.value = findTab.path
    } else {
        tabs.value.push({
            icon: routeInfo.icon,
            label: routeInfo.label,
            path: routeInfo.path,
            closable: routeInfo.path !== '/welcome'
        })
        activeTab.value = routeInfo.path
    }
}

const tabClick = (tab) => {
    router.push(tab.props.name)
}

const tabClose = (tabName) => {
    if (activeTab.value === tabName) {
        tabs.value.forEach((tab, index) => {
            if (tab.path === tabName) {
                let nextTab = tabs.value[index + 1] || tabs.value[index - 1]
                if (nextTab) {
                    router.push(nextTab.path)
                }
            }
        })
    }

    removeTab(tabName)

    if (tabs.value.length === 0) {
        router.push('/welcome')
    }
}

const removeTab = (tabName) => {
    tabs.value = tabs.value.filter(tab => tab.path !== tabName)

    let newIncludes = navStore.includes.filter(item => item.path !== tabName)
    navStore.includes = newIncludes
}

const closeOther = () => {
    let waitCloseTabs = []
    tabs.value.forEach((tab) => {
        if (tab.path !== activeTab.value) {
            waitCloseTabs.push(tab.path)
        }
    })
    waitCloseTabs.forEach((tabName) => {
        removeTab(tabName)
    })
}

const closeLeft = () => {
    let waitCloseTabs = []
    for (let i = 0; i < tabs.value.length; i++) {
        let path = tabs.value[i].path
        if (path !== activeTab.value) {
            waitCloseTabs.push(path)
        } else {
            break
        }
    }
    waitCloseTabs.forEach((tabName) => {
        removeTab(tabName)
    })
}

const closeRight = () => {
    let waitCloseTabs = []
    for (let i = tabs.value.length - 1; i >= 0; i--) {
        let path = tabs.value[i].path
        if (path !== activeTab.value) {
            waitCloseTabs.push(path)
        } else {
            break
        }
    }
    waitCloseTabs.forEach((tabName) => {
        removeTab(tabName)
    })
}

let closeAll = () => {
    let waitCloseTabs = []
    for (let i = 0; i < tabs.value.length; i++) {
        let path = tabs.value[i].path
        if (path !== '/welcome') {
            waitCloseTabs.push(path)
        }
    }
    waitCloseTabs.forEach((tabName) => {
        removeTab(tabName)
    })
}

const mapDrive = new Map();
mapDrive.set("closeOther", closeOther);
mapDrive.set("closeLeft", closeLeft);
mapDrive.set("closeRight", closeRight);
mapDrive.set("closeAll", closeAll);

const dropdownEvent = (command) => {
    mapDrive.get(command)();

    if (tabs.value.length === 0) {
        router.push('/welcome')
    }
}
</script>

<template>
    <section class="vel_container_header_navbar">
        <div class="vel_navbar_panel">
            <el-tabs v-model="activeTab" @tab-click="tabClick" @tab-remove="tabClose" class="vel_el_tabs_override">
                <el-tab-pane v-for="tab in tabs" :name="tab.path" :closable="tab.closable" :key="tab.path">
                    <template #label>
                        <el-icon class="vel_el_icon_home" :size="16" v-if="tab.path == '/welcome'">
                            <HomeFilled />
                        </el-icon>
                        <el-icon class="vel_el_icon_home" :size="16" v-else>
                            <component :is="tab.icon" />
                        </el-icon>

                        <span>{{ tab.label }}</span>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="vel_navbar_operation">
            <el-dropdown @command="dropdownEvent">
                <span>
                    <el-icon class="vel_navbar_operation_icon">
                        <ArrowDown />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="closeOther">
                            <el-icon>
                                <Close />
                            </el-icon>
                            Close others
                        </el-dropdown-item>
                        <el-dropdown-item command="closeLeft">
                            <el-icon>
                                <ArrowLeft />
                            </el-icon>
                            Close left
                        </el-dropdown-item>
                        <el-dropdown-item command="closeRight">
                            <el-icon>
                                <ArrowRight />
                            </el-icon>
                            Close right
                        </el-dropdown-item>
                        <el-dropdown-item command="closeAll">
                            <el-icon>
                                <CircleClose />
                            </el-icon>
                            Close all
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </section>
</template>

<style scoped>
.vel_container_header_navbar {
    height: 30px;
    position: relative;
}

.vel_navbar_panel {
    padding-right: 40px;
}

:deep(.vel_el_tabs_override) .el-tabs__header {
    margin: 0;
}

:deep(.vel_el_tabs_override) .el-tabs__nav-wrap.is-scrollable {
    padding: 0 40px;
}

:deep(.vel_el_tabs_override) .el-tabs__nav-wrap:after {
    height: 0px;
}

:deep(.vel_el_tabs_override) .el-tabs__nav-prev,
:deep(.vel_el_tabs_override) .el-tabs__nav-next {
    width: 30px;
    height: 30px;
    text-align: center;
}

:deep(.vel_el_tabs_override) .el-tabs__nav-prev {
    border-right: 1px solid #f4f4f4;
    transition: background-color .2s;
}

:deep(.vel_el_tabs_override) .el-tabs__nav-next {
    border-left: 1px solid #f4f4f4;
    transition: background-color .2s;
}

:deep(.vel_el_tabs_override) .el-tabs__nav-prev:hover,
:deep(.vel_el_tabs_override) .el-tabs__nav-next:hover {
    background-color: #F2F6FC;
}

:deep(.vel_el_tabs_override) .el-tabs__active-bar {
    display: none;
}

:deep(.vel_el_tabs_override) .el-tabs__item {
    color: #646464;
    transition: background-color .3s, color .3s;
    border-right: 1px solid #f4f4f4;
    font-weight: normal;
}

:deep(.vel_el_tabs_override) .el-tabs__item .el-icon {
    margin-left: 8px;
    color: #a7a9af;
}

:deep(.vel_el_tabs_override) .el-tabs__item .vel_el_icon_home {
    margin-left: 0px;
    margin-right: 5px;
}

:deep(.vel_el_tabs_override) .el-tabs__item .el-icon:not(.vel_el_icon_home):hover {
    color: #ffffff;
    background-color: #ff0000;
}

:deep(.vel_el_tabs_override) .el-tabs__item:not(.is-active):hover {
    background-color: rgba(64, 158, 255, 0.05);
    color: #303133;
}

:deep(.el-tabs__item) {
    padding: 0 10px;
}

:deep(.vel_el_tabs_override) .el-tabs__item.is-top:nth-child(2) {
    padding-left: 10px;
}

:deep(.vel_el_tabs_override) .el-tabs__item.is-top:last-child {
    padding-right: 10px;
}

:deep(.vel_el_tabs_override) .el-tabs__item.is-active {
    border-bottom: 2px solid #409eff;
    color: #409eff;
    background-color: rgba(64, 158, 255, 0.1);
}

:deep(.vel_el_tabs_override) .el-tabs__item.is-active .vel_el_icon_home {
    color: #409eff;
}

.vel_navbar_operation {
    position: absolute;
    top: 0;
    right: 0;
    border-left: 1px solid #f4f4f4;
    transition: background-color .2s;
}

.vel_navbar_operation:hover {
    background-color: #F2F6FC;
}

.vel_navbar_operation_icon {
    width: 30px;
    height: 30px;
}
</style>
