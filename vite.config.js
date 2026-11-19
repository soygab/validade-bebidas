// Configuração do Vite (o servidor de desenvolvimento e o build).
// Só ligo o plugin do React. Quase nunca preciso mexer aqui.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/validade-bebidas/',
})
