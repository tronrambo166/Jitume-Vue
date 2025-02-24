import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
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
  server:{
  	host:true,
  	port:80,
    //port:81,
  },
  plugins: [react()],
  
})
