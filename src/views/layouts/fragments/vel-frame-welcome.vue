<script setup>
import { useUserInfoStore } from "@/stores/data/userInfoStore";
import { computed } from "vue";

const userInfoStore = useUserInfoStore()

const avatarUrl = computed(() => userInfoStore.userInfo.avatar)
const userNick = computed(() => userInfoStore.userInfo.nickName)

</script>

<template>
    <div class="welcome_panel">
        <el-row>
            <el-col :span="24">
                <el-card shadow="never" class="vel_el_card_override vel_el_card_introduce">
                    <div class="introduce_avatar">
                        <el-avatar :size="60" :src="avatarUrl" />
                    </div>
                    <h2 class="introduce_desc">Hello, {{ userNick }}</h2>

                    <div class="mt-1 desc">
                        <h3 class="mb-3">Welcome to DodoMax ERP System</h3>
                        <p class="">
                            We are pleased to welcome you to DodoMax, your comprehensive solution for managing business
                            operations efficiently.
                            Please be reminded that by using this system, you agree to comply with all applicable
                            privacy policies and
                            legal requirements regarding the use of computer systemsUnauthorized access or misuse of
                            information is
                            strictly prohibited and may result in legal action.
                        </p>
                        <p>Let's work together to ensure a secure and efficient environment.</p>
                        <p>Thank you for choosing DodoMax!</p>
                    </div>


                </el-card>
            </el-col>
        </el-row>


    </div>
</template>

<style scoped>
.welcome_panel {
    padding: 20px 0 0 20px;
}

:deep(.vel_el_card_introduce) .el-card__body {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
}

:deep(.vel_el_card_override) .el-card__header {
    padding-top: 15px;
    padding-bottom: 15px;
}

.introduce_avatar .el-avatar {
    margin-right: 20px;
}

.introduce_desc {
    width: calc(100% - 80px);
    min-width: 200px;
}

.desc h3 {
    margin: 20px 0 15px 0;
    color: #141b1e;
    font-weight: 500;
    font-size: 22px;
}

.desc p {
    color: #808695;
    margin-top: 20px;
    font-size: 17px;
    line-height: 22px;
}

.el-row .el-col {
    padding-bottom: 20px;
    padding-right: 20px;
}

.vel_el_card_override .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.vel_el_card_override .vel_card_header_left {
    display: flex;
    align-items: center;
}

.vel_el_card_override .vel_card_header_left .el-icon {
    margin-right: 5px;
}

:deep(.vel_el_card_button) .el-card__body {
    display: flex;
    flex-direction: column;
    align-items: center;
}

:deep(.vel_el_card_button) .el-card__body p {
    padding-top: 15px;
}
</style>
