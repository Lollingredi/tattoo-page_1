import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // <--- AGGIUNGI QUESTA RIGA
    port: 5173, // <--- AGGIUNGI QUESTA RIGA
  },
})