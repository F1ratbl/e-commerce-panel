import { defineConfig } from 'vite';
import { resolve } from 'path';

const dashboardOrigin =
  process.env.GUIDORA_DASHBOARD_ORIGIN || 'http://localhost:3000';
const localSdkEntry = `/@fs/${resolve(
  __dirname,
  '../guidorasdk/src/index.ts',
).replace(/\\/g, '/')}`;

export default defineConfig({
  define: {
    __GUIDORA_LOCAL_SDK_ENTRY__: JSON.stringify(localSdkEntry),
    __GUIDORA_DEV_PROXY_PREFIX__: JSON.stringify('/__guidora'),
  },
  server: {
    fs: {
      allow: [resolve(__dirname, '..')],
    },
    proxy: {
      '/__guidora': {
        target: dashboardOrigin,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        orders: resolve(__dirname, 'orders.html'),
        analytics: resolve(__dirname, 'analytics.html'),
        customers: resolve(__dirname, 'customers.html'),
        payments: resolve(__dirname, 'payments.html'),
      },
    },
  },
});
