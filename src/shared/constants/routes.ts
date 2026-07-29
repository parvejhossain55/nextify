export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  DASHBOARD_USERS: "/dashboard/users",
  DASHBOARD_ANALYTICS: "/dashboard/analytics",
  DASHBOARD_ROLES: "/dashboard/roles",
  DASHBOARD_DOCUMENTS: "/dashboard/documents",
  DASHBOARD_NOTIFICATIONS: "/dashboard/notifications",
  DASHBOARD_SETTINGS: "/dashboard/settings",
  DASHBOARD_HELP: "/dashboard/help",
  USERS: "/users",
  PROFILE: "/profile",
  SETTINGS: "/settings",
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
  },
  USERS: {
    LIST: "/api/users",
    DETAIL: (id: string) => `/api/users/${id}`,
    CREATE: "/api/users",
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
  },
} as const;
