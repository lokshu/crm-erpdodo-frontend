import jsCookie from "js-cookie"
import localforage from "localforage";


const isAuthenticated = () => {
    return jsCookie.get('token')
}

const logout = async () => {
    console.log("logout")
    jsCookie.remove("token")
    await localforage.removeItem("userInfo")
    await localforage.removeItem("routes")
}

const cacheUserInfo = async (data) => {
    jsCookie.set("token", data.sessionCode)
    await localforage.setItem("userInfo", data)
}

export default {
    isAuthenticated,
    logout,
    cacheUserInfo,
}