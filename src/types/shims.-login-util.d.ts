// src/types/shims-login-util.d.ts
declare module '@/utils/LoginUtil' {
    const LoginUtil: {
        isAuthenticated: () => string | undefined;
        logout: () => Promise<void>;
        cacheUserInfo: (data: { sessionCode: string;[key: string]: any }) => Promise<void>;
    };

    export default LoginUtil;
}
