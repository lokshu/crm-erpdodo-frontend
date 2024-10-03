<script setup>
import localforage from "localforage"
import { useRouter } from "vue-router";
import { useCollapseStateStore } from "@/stores/data/collapseStateStore";
import { useNavStore } from "@/stores/data/navStore";
import { useUserInfoStore } from "@/stores/data/userInfoStore";
import { computed, onMounted, reactive, ref } from "vue";
import loginUtil from "@/utils/LoginUtil";
// @ts-ignore
import screenUtil from "@/utils/ScreenUtil";
import httpUtil from "@/utils/HttpService";
import NProgress from 'nprogress'
import { ElMessage } from "element-plus";

const router = useRouter()
const navStore = useNavStore()
const userInfoStore = useUserInfoStore()
const collapseStateStore = useCollapseStateStore()

onMounted(() => {
  localforage.getItem("userInfo").then((val) => {
    userInfoStore.setUserInfo(val)
  })
})
const collapseState = computed(() => collapseStateStore.collapseState)

const breadcrumb = computed(() => {
  let routeInfo = navStore.routeInfo
  return routeInfo.breadcrumb
})

const userNick = computed(() => userInfoStore.userInfo.nickName)
const profile = computed(() => userInfoStore.userInfo)

const collapseClick = () => {
  collapseStateStore.setCollapseState(!collapseState.value)
}

const userInfoClick = () => {
  state.addLayout = [
    {
      "itemName": "avatar",
      "sorting": "1",
      "width": 150,
      "optionId": null,
      "align": null,
      "fieldType": "uploadFile",
      "fieldCheck": "",
      "label": "Profile Picture",
    },
    {
      "itemName": "nickName",
      "sorting": "1",
      "width": 150,
      "optionId": null,
      "align": null,
      "fieldType": "input",
      "fieldCheck": "require",
      "label": "Nick name",
    },
    {
      "itemName": "email",
      "sorting": "1",
      "width": 150,
      "optionId": null,
      "align": null,
      "fieldType": "input",
      "fieldCheck": "require",
      "label": "Email"
    }
  ]
  const filteredList = []
  state.addLayout.forEach((item) => {
    if (item.fieldCheck !== '') {
      filteredList.push(item.itemName)
    }
  });
  filteredList.forEach((val) => {
    state.formRule[val] = [{ required: true, message: ``, trigger: 'blur' }]
  })

  state.addLayoutPwd = [
    {
      "itemName": "oldPassword",
      "sorting": "1",
      "width": 150,
      "optionId": null,
      "align": null,
      "fieldType": "password",
      "fieldCheck": "require",
      "label": "Old password"
    },
    {
      "itemName": "newPassword",
      "sorting": "1",
      "width": 150,
      "optionId": null,
      "align": null,
      "fieldType": "password",
      "fieldCheck": "require",
      "label": "New password"
    },
    {
      "itemName": "confirmPassword",
      "sorting": "1",
      "width": 150,
      "optionId": null,
      "align": null,
      "fieldType": "password",
      "fieldCheck": "require",
      "label": "Confirm password"
    },
  ]
  const filteredList2 = []
  state.addLayoutPwd.forEach((item) => {
    if (item.fieldCheck !== '') {
      filteredList2.push(item.itemName)
    }
  });
  filteredList2.forEach((val) => {
    state.formRulePwd[val] = [{ required: true, message: ``, trigger: 'blur' }]
  })


  state.dialogProfile = true

}

const state = reactive({
  dialogProfile: false,
  formData: [],
  formDataPwd: [],
  formRule: [],
  formRulePwd: [],
  addLayout: [],
  addLayoutPwd: [],
  loading: false,
  imageUrl: '',
})
let addProductFormRef = ref({})
let addProductFormRef2 = ref({})
state.formData = profile
const handleAvatarSuccess = async (uploadFile) => {
  console.log(uploadFile)
  state.imageUrl = URL.createObjectURL(uploadFile.raw)
}

const beforeAvatarUpload = async (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

const closeForm = async () => {
  state.dialogProfile = false
}
const submitForm = async (addProductFormRef) => {
  if (!addProductFormRef) return
  await addProductFormRef.validate((valid, fields) => {
    if (valid) {
      state.loading = true
      httpUtil.post(`/server/user/updateProfile`, {
        ...state.formData,
      }).then(async res => {
        if (res.data) {
          ElMessage.success(res.data)
          addProductFormRef.resetFields()
          //await labelService.getVerifyUser();
          localforage.getItem("userInfo").then((val) => {
            userInfoStore.setUserInfo(val)
          })
        }
        state.loading = false
      }).catch(err => {
        state.loading = false
        console.error(err)
      })
    }
  })
}

const submitForm2 = async (addProductFormRef2) => {
  if (!addProductFormRef2) return
  await addProductFormRef2.validate((valid, fields) => {
    if (valid) {
      if (state.formDataPwd.newPassword != state.formDataPwd.confirmPassword) {
        ElMessage.error('New password does not match Confirmed password')
        return false
      }
      state.loading = true
      httpUtil.post('/server/user/changePassword?userId=' + state.formData.userId
        + '&oldPassword=' + state.formDataPwd.oldPassword
        + '&newPassword=' + state.formDataPwd.newPassword, {

      }).then(res => {
        if (res.data) {
          ElMessage.success(res.data)
          setTimeout(() => { logout() }, 2300);
        }
        state.loading = false
      }).catch(err => {
        state.loading = false
        console.error(err)
      })
    }
  })
}


/**
 * 消息中心
 */
const userMessageClick = () => {
  router.push("/user/message")
}

const screenFull = () => {
  screenUtil.screenFull(val => { })
}
const logout = async () => {
  NProgress.start()
  NProgress.set(0.5)
  await httpUtil.get('/server/user/logout')
  loginUtil.logout()
  NProgress.done()
  router.push("/login")
}

</script>

<template>
  <section class="vel_container_header_menu">
    <div class="vel_container_header_menu_left">
      <div @click="collapseClick" class="vel_header_item vel_container_header_menu_left_collapse">
        <el-icon :size="18">
          <component :is="collapseState ? 'Expand' : 'Fold'" />
        </el-icon>
      </div>
      <div class="vel_header_item vel_container_header_menu_left_breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(crumb, index) of breadcrumb" :key="index">
            {{ crumb }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="vel_container_header_menu_right">
      <div class="vel_header_item vel_container_header_menu_right_nick">
        <el-dropdown class="el_dropdown_override">
          <span>
            <el-badge class="el_badge_override" is-dot>
              <el-avatar class="el_avatar_override" :size="20">
                <el-icon :size="16">
                  <Setting />
                </el-icon>
              </el-avatar>
            </el-badge>
            <span>{{ userNick }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu class="el_dropdown_menu_override">
              <el-dropdown-item @click="userInfoClick">
                <el-icon :size="18">
                  <User />
                </el-icon>
                Profile
              </el-dropdown-item>
              <el-dropdown-item @click="userMessageClick">
                <el-icon :size="18">
                  <Bell />
                </el-icon>
                Messages
              </el-dropdown-item>
              <el-dropdown-item @click="logout" divided>
                <el-icon :size="18">
                  <SwitchButton />
                </el-icon>
                Logout
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div @click="screenFull" class="vel_header_item vel_container_header_menu_right_fullscreen">
        <el-icon :size="16">
          <FullScreen />
        </el-icon>
      </div>
    </div>

    <el-dialog class="profile-dialog" v-model="state.dialogProfile" title="Profile" draggable>

      <el-form :model="state.formData" :rules="state.formRule" ref="addProductFormRef" label-width="150px">
        <template v-for="(column) in state.addLayout" :key="column.index">
          <el-form-item :align="column.align || 'left'"
            :prop="column.fieldType === 'select' ? column.optionId : column.itemName" :label="column.label">
            <div class="select-avatar" v-if="column.fieldType === 'uploadFile'">
              <el-icon v-if="!state.formData.avatar" class="selected-avatar">
                <Avatar />
              </el-icon>
              <div v-else><img class="selected-avatar" :src="state.formData.avatar" alt=""></div>

              <el-radio-group v-model="state.formData[column.itemName]">
                <el-radio value="/res/imgs/profile/adventurer-ginger.png" size="default"><img
                    src="/res/imgs/profile/adventurer-ginger.png" alt=""></el-radio>
                <el-radio value="/res/imgs/profile/adventurer-kitty.png" size="default"><img
                    src="/res/imgs/profile/adventurer-kitty.png" alt=""></el-radio>
                <el-radio value="/res/imgs/profile/adventurer-patches.png" size="default"><img
                    src="/res/imgs/profile/adventurer-patches.png" alt=""></el-radio>
                <el-radio value="/res/imgs/profile/adventurer-lilly.png" size="default"><img
                    src="/res/imgs/profile/adventurer-lilly.png" alt=""></el-radio>
                <el-radio value="/res/imgs/profile/adventurer-angel.png" size="default"><img
                    src="/res/imgs/profile/adventurer-angel.png" alt=""></el-radio>
                <el-radio value="/res/imgs/profile/adventurer-sam.png" size="default"><img
                    src="/res/imgs/profile/adventurer-sam.png" alt=""></el-radio>
              </el-radio-group>

            </div>

            <el-input size="default" v-if="column.fieldType === 'input'
              || column.fieldType === 'password'
              || column.fieldType === 'email'" :type="column.fieldType" :disabled="column.disabled"
              v-model="state.formData[column.itemName]" autocomplete="off" />

            <el-input size="default" v-if="column.fieldType === 'textarea'" :type="column.fieldType"
              v-model="state.formData[column.itemName]" autocomplete="off" />

            <el-input size="default" v-if="column.fieldType === 'currency'" v-model="state.formData[column.itemName]"
              autocomplete="off" />

            <el-select size="default" v-if="column.fieldType === 'select'" @focus="clickOpen(column.itemName)"
              v-model="state.formData[column.optionId]" placeholder="">
              <el-option v-for="itemOption in options[column.itemName]" :key="itemOption.id" :label="itemOption.name"
                :value="itemOption.id">
              </el-option>
            </el-select>

          </el-form-item>
        </template>

        <div class="text-right">
          <div class=" pb-3">
            <el-button :loading="state.loading" type="primary" @click="submitForm(addProductFormRef)">Save</el-button>
          </div>
        </div>

      </el-form>

      <hr class="mb-3">

      <el-form :model="state.formDataPwd" :rules="state.formRulePwd" ref="addProductFormRef2" label-width="150px">
        <template v-for="(column) in state.addLayoutPwd" :key="column.index">
          <el-form-item :align="column.align || 'left'"
            :prop="column.fieldType === 'select' ? column.optionId : column.itemName" :label="column.label">

            <el-input size="default" v-if="column.fieldType === 'input'
              || column.fieldType === 'password'
              || column.fieldType === 'email'" :type="column.fieldType" :disabled="column.disabled"
              v-model="state.formDataPwd[column.itemName]" autocomplete="off" />

          </el-form-item>
        </template>

        <div class="text-right">
          <div class="pt-3">
            <!--              <el-button @click="closeForm">Cancel</el-button>-->
            <el-button :loading="state.loading" type="primary" @click="submitForm2(addProductFormRef2)">Save</el-button>
          </div>
        </div>

      </el-form>



    </el-dialog>

  </section>
</template>

<style scoped>
.vel_container_header_menu {
  height: 35px;
  border-bottom: 1px solid #f4f4f4;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.vel_container_header_menu_left,
.vel_container_header_menu_right {
  display: flex;
  align-items: center;
}

.vel_header_item {
  height: 35px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  transition: background-color .2s;
}

.vel_header_item:not(.vel_container_header_menu_left_breadcrumb, .vel_container_header_menu_right_nick):hover {
  background-color: #F2F6FC;
  cursor: pointer;
}

:deep(.el_badge_override) sup.is-dot {
  right: 8px;
  top: 4px
}

.el_badge_override {
  margin-right: 5px;
}

.el_avatar_override {
  background-color: #409eff;
}

:deep(li).el-dropdown-menu__item {
  padding: 10px 15px;
  min-width: 120px;
  color: #7c7c7c;
}

:deep(li).el-dropdown-menu__item:focus {
  color: #303133;
  background-color: #F2F6FC;
}

:deep(li).el-dropdown-menu__item .el-badge {
  display: flex;
  align-items: center;
  margin-left: 5px;
}

.select-avatar .el-radio {
  height: auto
}

.select-avatar .el-radio img {
  width: 70px;
  height: 70px;
  box-shadow: 1px 1px 10px #eeeeee
}

.select-avatar .selected-avatar {
  width: 70px;
  height: 70px;
  font-size: 35px;
  box-shadow: 1px 1px 10px #eeeeee;
  margin-bottom: 20px
}
</style>