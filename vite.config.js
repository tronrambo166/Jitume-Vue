import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            build: {
                chunkSizeWarningLimit: 2000, // Increase the limit
                rollupOptions: {
                  output: {
                    manualChunks(id) {
                        if (id.includes("node_modules")) {
                          if (id.includes("react")) return "react"; 
                          if (id.includes("lodash")) return "lodash"; // Separate Lodash
                          return "vendor"; // Other libraries
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
