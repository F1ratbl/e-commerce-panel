import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
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
