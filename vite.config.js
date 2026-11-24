// Configuração do Vite. "base" é o caminho onde o app fica no site: codedbygab.com/validade/
// (se eu mudar o nome da pasta no portfólio, mudo aqui também).
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/validade/',
});
