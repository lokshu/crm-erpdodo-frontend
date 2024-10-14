declare namespace _default {
    export { isAuthenticated };
    export { logout };
    export { cacheUserInfo };
}
export default _default;
declare function isAuthenticated(): string | undefined;
declare function logout(): Promise<void>;
declare function cacheUserInfo(data: any): Promise<void>;
