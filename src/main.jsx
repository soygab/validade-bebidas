// Ponto de entrada: pega a div #root do index.html e coloca o <App /> dentro.
// Também importa o CSS global (Tailwind + paleta). Não preciso mexer aqui.
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
