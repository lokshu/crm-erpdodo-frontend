import HttpService from '@/utils/HttpService';
import LoginUtil from '@/utils/LoginUtil';
import jsCookie from "js-cookie"

export default {
  async getVerifyUser() {
    try {
      let isAuth = LoginUtil.isAuthenticated()
      if (isAuth) {
        const config = {
          headers: {
            'Session-Code': jsCookie.get('token')
          }
        };
        const response = await HttpService.get(`server/user/verifyUser`, config);
        LoginUtil.cacheUserInfo(response.data);
        return response.status;
      } else {
        return 0;
      }
    } catch (error) {
      console.error('Error verifying session:', error);
      LoginUtil.logout()
      return 0;
    }
  },
  async getLabels() {
    try {
      let langCode = jsCookie.get("language") || "en";
      const response = await HttpService.get(`server/syslabel/all?languageCode=${langCode}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all labels:', error);
      return {};
    }
  },
  async getLabelsForPage(module) {
    try {
      let langCode = jsCookie.get("language") || "en";
      const response = await HttpService.get(`server/syslabel/moudle?languageCode=${langCode}&moduleName=${module}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching labels:', error);
      return {};
    }
  },
  async getTransformLabels(module) {
    const labelsArray = await this.getLabelsForPage(module)
    const transformed = labelsArray.reduce((acc, current) => {
      if (current.labelDefault) {
        acc[current.labelDefault] = current.content;
      }
      return acc;
    }, {});
    return transformed; // Wrap it in an array as per your requirement
  },
}