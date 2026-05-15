/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_SERVICE_URL: string;
  readonly VITE_POST_SERVICE_URL: string;
  readonly VITE_FOLLOW_SERVICE_URL: string;
  readonly VITE_TRENDING_SERVICE_URL: string;
  readonly VITE_USE_MOCK: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_TOKEN_KEY: string;
  readonly VITE_REFRESH_TOKEN_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
