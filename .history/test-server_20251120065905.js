/**
 * Servidor de prueba local para testear el chatbot y sistema de emails
 * Simula los endpoints de Cloudflare Pages Functions
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

