import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            build: {
                chunkSizeWarningLimit: 1800, // Increase the limit
                rollupOptions: {
                  output: {
                    manualChunks(id) {
                      if (id.includes("node_modules")) {
                        return "vendor"; // Create a separate vendor chunk
                      }
                    },
                  },
                },
              },
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
});
