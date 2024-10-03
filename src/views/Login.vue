<template>
  <section class="vel_login">
    <el-form :model="loginForm" class="el_form_override" @keyup.enter="submitLogin">
      <h3>
        <img src="/res/imgs/logo-wide.png" alt="">
      </h3>
      <el-form-item>
        <el-input v-model="loginForm.userName" :placeholder="getLabel('Login name')" size="large"
          prefix-icon="UserFilled" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="loginForm.password" :placeholder="getLabel('Password')" type="password" size="large"
          prefix-icon="Lock" show-password />
      </el-form-item>
      <div class="d-flex justify-content-between align-center mb-2">
        <el-select v-model="selectedLanguage" placeholder="Select Language" size="large"
          style="width: 185px;margin-right: 10px">
          <el-option label="English" value="en"></el-option>
          <el-option label="簡体中文" value="cn"></el-option>
          <el-option label="繁體中文" value="tc"></el-option>
        </el-select>
        <el-link type="primary">Forget Password？</el-link>
      </div>

      <el-form-item>
        <el-button type="primary" :loading="loading" @click="submitLogin" size="large" style="width: 100%">
          {{ getLabel('Login') }}
        </el-button>
      </el-form-item>

      <div class="d-flex justify-content-between">
        <el-checkbox label="Remember me" />
        <el-link type="primary">Register</el-link>
      </div>

    </el-form>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserInfoStore } from "@/stores/data/userInfoStore";
import { ElMessage } from "element-plus";
import httpUtil from "@/utils/HttpService";
// @ts-ignore
import loginUtil from "@/utils/LoginUtil";
// @ts-ignore
import jsCookie from "js-cookie"

export default defineComponent({
  setup() {
    const router = useRouter()
    const userInfoStore = useUserInfoStore()
    const selectedLanguage = ref(jsCookie.get("language") || "en");
    const loading = ref(false)
    const rememberMe = ref(false)
    rememberMe.value = !!jsCookie.get("rememberMe");
    const getLabel = userInfoStore.getLabelByModule("access control")

    const loginForm = ref({
      userName: '',
      password: ''
    })
    loginForm.value.userName = jsCookie.get("rememberMe") || '';
    onMounted(async () => {

    });
    const getDeviceInfo = () => {
      const userAgent = navigator.userAgent;
      const platform = navigator.platform;
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      return {
        userAgent,   // Browser and operating system
        platform,    // Platform (e.g., Win32, Linux x86_64)
        screenWidth,
        screenHeight
      };
    };
    const deviceInfo = JSON.stringify(getDeviceInfo());

    const submitLogin = () => {
      loading.value = true
      ElMessage.closeAll()
      if (!loginForm.value.userName || !loginForm.value.password) {
        ElMessage({
          message: getLabel("Please enter user name and password!"),
          type: 'error',
          showClose: true,
          duration: 0
        })
        loading.value = false
        return false
      }
      httpUtil.post('/server/user/login', {
        ...loginForm.value,
        deviceInfo: deviceInfo,
        language: selectedLanguage.value,
      }).then(async res => {
        await loginUtil.cacheUserInfo(res.data)
        await new Promise(resolve => setTimeout(resolve, 1000))
        jsCookie.set("language", selectedLanguage.value)
        rememberMe.value ? jsCookie.set("rememberMe", loginForm.value.userName) : jsCookie.remove("rememberMe");
        router.push('/')
      }).catch(err => {
        loading.value = false
      }).finally(() => {
        loading.value = false
      })
    }
    return {
      loginForm,
      submitLogin,
      getLabel,
      loading,
      selectedLanguage
    }
  }
})
</script>

<style scoped>
.vel_login {
  background-color: #2d3a4b;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el_form_override {
  min-width: 300px;
  padding: 50px;
  background-color: rgb(41, 51, 67);
  border: 1px solid rgb(50, 60, 74);
  border-radius: 5px;
}

.el_form_override h3 {
  font-size: 26px;
  color: #eee;
  margin-bottom: 40px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el_form_override h3 .el-icon {
  margin-right: 10px;
}
</style>