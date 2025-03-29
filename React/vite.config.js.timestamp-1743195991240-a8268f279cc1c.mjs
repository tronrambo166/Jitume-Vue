// vite.config.js
import { defineConfig } from "file:///home/owen/Documents/Manu/nurul/Jitume-Vue/React/node_modules/vite/dist/node/index.js";
import react from "file:///home/owen/Documents/Manu/nurul/Jitume-Vue/React/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  // commented this to bring back live site 
  // build: {
  //   chunkSizeWarningLimit: 2000, // Increase the limit
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id) {
  //           if (id.includes("node_modules")) {
  //             if (id.includes("react")) return "react"; 
  //             if (id.includes("lodash")) return "lodash"; // Separate Lodash
  //             return "vendor"; // Other libraries
  //           }
  //       },
  //     },
  //   },
  // },
  server: {
    host: true,
    //port:80,
    port: 81
  },
  plugins: [react()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9vd2VuL0RvY3VtZW50cy9NYW51L251cnVsL0ppdHVtZS1WdWUvUmVhY3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL293ZW4vRG9jdW1lbnRzL01hbnUvbnVydWwvSml0dW1lLVZ1ZS9SZWFjdC92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9vd2VuL0RvY3VtZW50cy9NYW51L251cnVsL0ppdHVtZS1WdWUvUmVhY3Qvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgLy8gY29tbWVudGVkIHRoaXMgdG8gYnJpbmcgYmFjayBsaXZlIHNpdGUgXG4gIC8vIGJ1aWxkOiB7XG4gIC8vICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAyMDAwLCAvLyBJbmNyZWFzZSB0aGUgbGltaXRcbiAgLy8gICByb2xsdXBPcHRpb25zOiB7XG4gIC8vICAgICBvdXRwdXQ6IHtcbiAgLy8gICAgICAgbWFudWFsQ2h1bmtzKGlkKSB7XG4gIC8vICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoXCJub2RlX21vZHVsZXNcIikpIHtcbiAgLy8gICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKFwicmVhY3RcIikpIHJldHVybiBcInJlYWN0XCI7IFxuICAvLyAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoXCJsb2Rhc2hcIikpIHJldHVybiBcImxvZGFzaFwiOyAvLyBTZXBhcmF0ZSBMb2Rhc2hcbiAgLy8gICAgICAgICAgICAgcmV0dXJuIFwidmVuZG9yXCI7IC8vIE90aGVyIGxpYnJhcmllc1xuICAvLyAgICAgICAgICAgfVxuICAvLyAgICAgICB9LFxuICAvLyAgICAgfSxcbiAgLy8gICB9LFxuICAvLyB9LFxuICBzZXJ2ZXI6e1xuICBcdGhvc3Q6dHJ1ZSxcbiAgXHQvL3BvcnQ6ODAsXG4gICAgcG9ydDo4MSxcbiAgfSxcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICBcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWtVLFNBQVMsb0JBQW9CO0FBQy9WLE9BQU8sV0FBVztBQUdsQixJQUFPLHNCQUFRLGFBQWE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQWdCMUIsUUFBTztBQUFBLElBQ04sTUFBSztBQUFBO0FBQUEsSUFFSixNQUFLO0FBQUEsRUFDUDtBQUFBLEVBQ0EsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUVuQixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
