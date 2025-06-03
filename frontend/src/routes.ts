export const publicRoutes = [
    "/", "/predict","/result","/new-verification"
]
export const authRoutes = ["/login", "/register",'/error','/reset','/new-password']
export const protectedRoutes = [
    "/dashboard"
]
export const apiAuthPrefix = "/api/auth"
export const DEFAULT_LOGIN_REDIRECT = "/dashboard"