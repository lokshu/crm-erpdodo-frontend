<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import apiService from "@/utils/ApiService";
import { useUserInfoStore } from "@/stores/data/userInfoStore";

export default defineComponent({
    name: 'App',
    setup() {
        const userInfoStore = useUserInfoStore();
        onMounted(async () => {
            try {
                const labels = await apiService.getLabels();
                userInfoStore.setAllLabels(labels);
            } catch (error) {
                console.error('Error in all labels:', error);
            }
        });
    }
})
</script>

<style>
* {
    margin: 0;
    padding: 0;
}

html,
body,
#app {
    color: #303133;
    height: 100vh;
    font-size: 14px;
    background-color: #fff;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
        'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

html body a {
    color: #1890ff;
    text-decoration: none;
}

.data-table-header {
    font-weight: bold;
    font-size: 18px;
    vertical-align: middle;
}

.el-popper.is-light {
    border: none !important;
}

.page {
    padding: 10px 10px 0 10px;
}

::-webkit-scrollbar {
    width: 6px
}

.page a {
    background: none;
    border: none;
    cursor: pointer;
    color: blue;
    text-decoration: underline;
}

.pagination {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
}

.page .el-card__header,
.page .el-card__body {
    padding: 8px 10px;
}

::-webkit-scrollbar:horizontal {
    height: 6px
}

::-webkit-scrollbar-track {
    border-radius: 10px
}

::-webkit-scrollbar-thumb {
    background-color: #0003;
    border-radius: 10px;
    transition: all .2s ease-in-out
}

::-webkit-scrollbar-thumb:hover {
    cursor: pointer;
    background-color: #0000004d
}
</style>