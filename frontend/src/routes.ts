export const publicRoutes = [
    "/", "/new-verification"
]
export const authRoutes = ["/login", "/register",'/error','/reset','/new-password']
export const protectedRoutes = [
    "/dashboard","/predict","/result"
]
export const apiAuthPrefix = "/api/auth"
export const DEFAULT_LOGIN_REDIRECT = "/dashboard"