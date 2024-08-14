// Secrets
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Config
export const BASE_URL = process.env.ASTRA_NEXT_SERVER_BASE_URL;
export const RETYPE_PASSWORD_URL = `${BASE_URL}/auth/retypepassword`;
export const SMTP_SERVER_URL = "smtp-mail.outlook.com";
export const SECRET_KEY = "@astra-api.dev";
// export const ASTRA_BASE_HTTP_URL = "https://stag.astra-api.dev";
// export const ASTRA_BASE_WS_URL = "wss://stag.astra-api.dev/ws";
export const ASTRA_BASE_HTTP_URL = process.env.NEXT_PUBLIC_ASTRA_BASE_HTTP_URL;
export const ASTRA_BASE_WS_URL = process.env.NEXT_PUBLIC_ASTRA_BASE_WS_URL;
export const GOOGLE_OAUTH_CLIENT_ID =
  process.env.NEXT_PUBLIC_ASTRA_GOOGLE_CLIENT_ID;
export const SUCCESS_PAGE_URL = "/success-page";

// API endpoints
export const SIGNIN_URL = `${BASE_URL}/auth/signin`;
export const SIGNIN_API_URL = `${ASTRA_BASE_HTTP_URL}/user?x-astra-api-key=${API_KEY}`;
export const SIGNUP_API_URL = `${ASTRA_BASE_HTTP_URL}/user`;
export const LOGIN_API = `${ASTRA_BASE_HTTP_URL}/user/validate`;
export const CONTENT_TYPE_JSON = "application/json";
export const SIGNIN_PAGE = "/auth/signin";
export const AUTH_RESET_PASSWORD = "/auth/resetpassword/";
export const DASHBOARD_LINK = "/dashboard";
export const PUT_PASSWORD = `${ASTRA_BASE_HTTP_URL}/user`;
export const VALIDATE_EMAIL_API = `${ASTRA_BASE_HTTP_URL}/user/validate/email`;
export const USER_TOKEN = `${ASTRA_BASE_HTTP_URL}/user/token`;
export const SETTING_API = `${ASTRA_BASE_HTTP_URL}/apikeys`;
export const GET_SETTING_API = `${ASTRA_BASE_HTTP_URL}/user/apikeys`;
export const VALIDATE_EMAIL_ACTION = `${ASTRA_BASE_HTTP_URL}/user/validate/email`;
export const MARKET_URL = `${ASTRA_BASE_HTTP_URL}/market`;
export const BALANCES_URL = `${ASTRA_BASE_HTTP_URL}/balances?id=`;
