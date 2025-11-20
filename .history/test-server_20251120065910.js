/**
 * Servidor de prueba local para testear el chatbot y sistema de emails
 * Simula los endpoints de Cloudflare Pages Functions
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuración de API keys (puedes modificar estas variables)
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_67m23uAi_Cxey8XRQeZRy3UBXcSzUzSXE';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'contacto@grupomusicalcelula.pages.dev';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Servir archivos estáticos desde la raíz

console.log('🔧 Configuración del servidor:');
console.log('- RESEND_API_KEY:', RESEND_API_KEY ? '✓ Configurada' : '✗ Faltante');
console.log('- GEMINI_API_KEY:', GEMINI_API_KEY ? '✓ Configurada' : '✗ Faltante');
console.log('- CONTACT_EMAIL:', CONTACT_EMAIL);

// Endpoint para enviar emails con Resend
app.post('/api/send-email', async (req, res) => {
  console.log('📧 Petición recibida en /api/send-email');
  console.log('📦 Datos recibidos:', JSON.stringify(req.body, null, 2));

