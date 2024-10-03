import axios from 'axios';
import jsCookie from "js-cookie"
import { ElMessage } from "element-plus";

const HTTP_BASE_URL = "https://max20.erpdodo.com";
const HTTP_BASE_URL_DEV = "http://localhost:6891";
axios.defaults.timeout = 50000;

const RES_STATUS_CODE = {
    SUCCESS: 200,
    WARNING: 201,
    NO_MORE: 202,
    ERROR: 300,
    NO_LOGIN: 301,
    NO_PERM: 302,
    Par_ERROR: 400,
}

class HttpService {
    constructor() {
        const baseURL = process.env.NODE_ENV === 'production' ? HTTP_BASE_URL : HTTP_BASE_URL_DEV;

        this.httpClient = axios.create({
            baseURL: baseURL,
        });

        this._initializeRequestInterceptor();
        this._initializeResponseInterceptor();

    }
    _initializeRequestInterceptor() {
        this.httpClient.interceptors.request.use(
            (request) => {
                const token = jsCookie.get('token');
                if (token) {
                    request.headers['Session-Code'] = token;
                    request.headers['language'] = jsCookie.get("language")
                }
                return request;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }
    _initializeResponseInterceptor() {
        this.httpClient.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
                ElMessage.error(errorMessage);
                if (error.response?.status === 401) {
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }
    get(url, config = {}) {
        return this.httpClient.get(url, config);
    }

    post(url, data = {}, config = {}) {
        return this.httpClient.post(url, data, config);
    }

    put(url, data = {}, config = {}) {
        return this.httpClient.put(url, data, config);
    }

    delete(url, config = {}) {
        return this.httpClient.delete(url, config);
    }

}

export default new HttpService();
