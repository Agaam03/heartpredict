export const publicRoutes = [
    "/", "/new-verification","/sitemap.xml","/robots.txt","/opengraph-image.png","/ads.txt"
]
export const authRoutes = ["/login", "/register",'/error','/reset','/new-password']
export const protectedRoutes = [
    "/dashboard","/predict","/result"
]
export const predictRoutes = [
    "/predict", "/result"]
export const apiAuthPrefix = "/api/auth"
export const DEFAULT_LOGIN_REDIRECT = "/dashboard"