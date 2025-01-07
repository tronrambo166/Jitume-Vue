import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import viteCompression from 'vite-plugin-compression'; // For gzip/brotli compression
import purgecss from 'vite-plugin-purgecss'; // For removing unused CSS

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        viteCompression({
            algorithm: 'gzip', // Compress assets using gzip or brotli
            ext: '.gz', // File extension for compressed assets
            threshold: 10240, // Compress files larger than 10KB
        }),
        purgecss({
            content: ['./resources/views/**/*.blade.php', './resources/js/**/*.vue', './resources/js/**/*.jsx'], // Purge unused styles based on these files
        }),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                },
            },
        },
    },
    optimizeDeps: {
        include: ['axios', 'vue', 'react'], // Pre-bundle frequently used dependencies
    },
});
