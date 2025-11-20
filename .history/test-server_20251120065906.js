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
