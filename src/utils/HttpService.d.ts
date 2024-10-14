declare const _default: HttpService;
export default _default;
declare class HttpService {
    httpClient: import("axios").AxiosInstance;
    _initializeRequestInterceptor(): void;
    _initializeResponseInterceptor(): void;
    get(url: any, config?: {}): Promise<import("axios").AxiosResponse<any, any>>;
    post(url: any, data?: {}, config?: {}): Promise<import("axios").AxiosResponse<any, any>>;
    put(url: any, data?: {}, config?: {}): Promise<import("axios").AxiosResponse<any, any>>;
    delete(url: any, config?: {}): Promise<import("axios").AxiosResponse<any, any>>;
}
