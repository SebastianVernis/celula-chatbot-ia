#!/usr/bin/env node

/**
 * Servidor de desarrollo independiente para Grupo Musical La Célula
 * Reemplaza wrangler pages dev con un servidor Node.js/Express
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8788;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(__dirname));

// Rutas API - adaptadas de Cloudflare Pages Functions
app.use('/api', express.static(path.join(__dirname, 'functions/api')));

// Endpoint de email
app.post('/api/send-email', async (req, res) => {
  try {
    const data = req.body;
    const { type, leadData, conversationData, formData } = data;

    // Verificar configuración
    const resendApiKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL || "contacto@grupomusicalcelula.pages.dev";

    console.log('📧 Send-email API called');
    console.log('📋 Type:', type);
    console.log('🔑 RESEND_API_KEY available:', !!resendApiKey);
    console.log('📮 Contact email:', contactEmail);

    if (!resendApiKey) {
      console.error("❌ RESEND_API_KEY no configurada");
      return res.status(500).json({
        success: false,
        error: "Configuración de email no disponible. Por favor, configura RESEND_API_KEY.",
      });
    }

    // Rate limiting simple (en memoria - para desarrollo)
    const clientIP = req.ip || req.connection.remoteAddress;
    const rateLimitKey = `email_limit_${clientIP}`;

    // Para desarrollo, limitamos a 10 emails por hora
    const now = Date.now();
    const limitWindow = 60 * 60 * 1000; // 1 hora
    const maxEmails = 10;

    // Nota: En producción usarías Redis o similar
    if (!global.rateLimits) global.rateLimits = {};
    const rateLimitData = global.rateLimits[rateLimitKey];

    if (rateLimitData) {
      const { count, firstRequest } = rateLimitData;
      if (now - firstRequest < limitWindow && count >= maxEmails) {
        return res.status(429).json({
          success: false,
          error: "Límite de emails alcanzado. Por favor intenta más tarde.",
        });
      }

      if (now - firstRequest >= limitWindow) {
        global.rateLimits[rateLimitKey] = { count: 1, firstRequest: now };
      } else {
        global.rateLimits[rateLimitKey] = { count: count + 1, firstRequest };
      }
    } else {
      global.rateLimits[rateLimitKey] = { count: 1, firstRequest: now };
    }

    let emailHtml, subject;

    // Determinar tipo de email
    if (type === "chatbot_summary") {
      emailHtml = createChatbotSummaryEmail(leadData, conversationData);
      subject = `🎵 Nueva consulta musical - ${leadData.name}`;
    } else if (type === "form_cotizador") {
      emailHtml = createCotizadorEmail(formData);
      subject = `📝 Nueva cotización - ${formData.nombre}`;
    } else if (type === "chatbot_lead") {
      emailHtml = createLeadCaptureEmail(leadData);
      subject = `👤 Nuevo lead - ${leadData.name}`;
    } else {
      return res.status(400).json({
        success: false,
        error: "Tipo no reconocido",
      });
    }

    // Enviar con Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Grupo La Célula <onboarding@resend.dev>",
        to: [contactEmail],
        subject: subject,
        html: emailHtml,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      return res.json({
        success: true,
        message: "Email enviado",
        emailId: result.id,
      });
    } else {
      throw new Error(result.message || "Error al enviar");
    }
  } catch (error) {
    console.error("Error send-email:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Endpoint de chat (placeholder - necesitarías implementar la lógica completa)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    // Aquí iría la lógica del chatbot usando Gemini API
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY no configurada",
      });
    }

    // Placeholder response - implementar lógica completa del chatbot
    const response = {
      message: "¡Hola! Soy el asistente de Grupo Musical La Célula. ¿En qué puedo ayudarte?",
      timestamp: new Date().toISOString(),
    };

    res.json({
      success: true,
      response: response,
    });
  } catch (error) {
    console.error("Error chat:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Manejar rutas SPA (Single Page Application)
app.get('*', (req, res) => {
  // Para rutas que no existen como archivos, servir index.html
  const filePath = path.join(__dirname, req.path);
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }

  // Verificar si es un archivo existente
  const fs = await import('fs');
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }

  // Para SPA routing, servir index.html
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Funciones auxiliares para emails (copiadas del original)
function createChatbotSummaryEmail(leadData, conversationData) {
  const date = new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const eventType = leadData.eventType || "No especificado";
  const conversationLength = conversationData.conversation_length || 0;
  const fullConversation = conversationData.full_conversation || 'No hay conversación disponible';
  const sessionStart = conversationData.session_start || date;

  // Formatear la conversación completa para HTML
  const conversationHtml = fullConversation
    .split('\n\n')
    .filter(line => line.trim())
    .map(line => {
      if (line.startsWith('Cliente:')) {
        return `<div style='margin:10px 0;padding:10px;background:#e3f2fd;border-left:3px solid #2196F3;border-radius:4px'><strong>Cliente:</strong> ${line.substring(8)}</div>`;
      } else if (line.startsWith('Asistente:')) {
        return `<div style='margin:10px 0;padding:10px;background:#f5f5f5;border-left:3px solid #666;border-radius:4px'><strong>Asistente:</strong> ${line.substring(10)}</div>`;
      }
      return `<div style='margin:10px 0;padding:10px'>${line}</div>`;
    })
    .join('');

  const recommendedPackage = determineRecommendedPackage(conversationData);

  return `<!DOCTYPE html>
<html><head><style>
body{font-family:'Open Sans',Arial,sans-serif;line-height:1.6;color:#333;background:#f4f4f4}
.container{max-width:700px;margin:20px auto;background:#fff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.1)}
.header{background:#000;color:#fff;padding:20px;text-align:center}
.section{padding:20px;border-bottom:1px solid #eee}
.info-row{margin:10px 0;padding:8px;background:#f9f9f9;border-radius:4px}
.highlight{font-weight:bold}
.conversation{margin:15px 0;padding:15px;background:#fff;border-radius:5px;max-height:500px;overflow-y:auto}
.package{background:#e6f7ff;padding:20px;border-left:4px solid #3D9BE9;margin:15px 0}
.actions{background:#fff3cd;padding:15px}
.footer{background:#f8f9fa;padding:15px;text-align:center;font-size:12px;color:#666}
</style></head><body>
<div class='container'>
  <div class='header'><h1>🎵 Nueva Consulta Musical</h1><p>${date}</p></div>
  <div class='section'><h2>📋 Información del Cliente</h2>
    <div class='info-row'><span class='highlight'>Nombre:</span> ${leadData.name}</div>
    <div class='info-row'><span class='highlight'>Email:</span> ${leadData.email}</div>
    <div class='info-row'><span class='highlight'>Teléfono:</span> ${leadData.phone}</div>
    <div class='info-row'><span class='highlight'>Evento:</span> ${eventType}</div>
    <div class='info-row'><span class='highlight'>Inicio de sesión:</span> ${new Date(sessionStart).toLocaleString('es-MX')}</div>
  </div>
  <div class='package'><h2>💡 Paquete Recomendado</h2><p>${recommendedPackage}</p></div>
  <div class='section'><h2>💬 Conversación Completa (${conversationLength} mensajes)</h2>
    <div class='conversation'>${conversationHtml}</div>
  </div>
  <div class='actions'><h2>⚡ Acciones Sugeridas</h2>
    <p>✅ 1. Contactar al cliente en las próximas 2 horas</p>
    <p>📱 2. WhatsApp al <a href="https://wa.me/52${leadData.phone.replace(/\s/g, '')}" style="color:#25D366;text-decoration:none">${leadData.phone}</a></p>
    <p>📧 3. Enviar cotización personalizada a ${leadData.email}</p>
  </div>
  <div class='footer'><p>🎵 Chatbot Grupo Musical Versátil La Célula</p><p style='font-size:11px;color:#999'>Este email fue generado automáticamente desde el servidor local</p></div>
</div></body></html>`;
}

function createCotizadorEmail(formData) {
  const date = new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `<!DOCTYPE html>
<html><head><style>
body{font-family:Arial,sans-serif;line-height:1.6;color:#333;background:#f4f4f4}
.container{max-width:600px;margin:20px auto;background:#fff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.1)}
.header{background:#000;color:#fff;padding:20px;text-align:center}
.section{padding:20px;border-bottom:1px solid #eee}
.info-row{margin:10px 0;padding:8px;background:#f9f9f9;border-radius:4px}
.highlight{font-weight:bold}
.footer{background:#f8f9fa;padding:15px;text-align:center;font-size:12px;color:#666}
</style></head><body>
<div class='container'>
  <div class='header'><h1>📝 Nueva Cotización</h1><p>${date}</p></div>
  <div class='section'><h2>Cliente</h2>
    <div class='info-row'><span class='highlight'>Nombre:</span> ${formData.nombre}</div>
    <div class='info-row'><span class='highlight'>Email:</span> ${formData.email}</div>
    <div class='info-row'><span class='highlight'>Teléfono:</span> ${formData.telefono}</div>
  </div>
  <div class='section'><h2>Evento</h2>
    <div class='info-row'><span class='highlight'>Tipo:</span> ${formData.tipoEvento}</div>
    <div class='info-row'><span class='highlight'>Fecha:</span> ${formData.fechaEvento}</div>
    <div class='info-row'><span class='highlight'>Lugar:</span> ${formData.lugar}</div>
    <div class='info-row'><span class='highlight'>Invitados:</span> ${formData.numeroInvitados}</div>
    <div class='info-row'><span class='highlight'>Paquete:</span> ${formData.paquete}</div>
  </div>
  ${formData.mensaje ? `<div class='section'><h2>Mensaje</h2><p style='background:#f9f9f9;padding:15px;border-radius:4px'>${formData.mensaje}</p></div>` : ""}
  <div class='footer'><p>Formulario del servidor local</p></div>
</div></body></html>`;
}

function createLeadCaptureEmail(leadData) {
  const date = new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `<!DOCTYPE html>
<html><head><style>
body{font-family:Arial,sans-serif;line-height:1.6;color:#333;background:#f4f4f4}
.container{max-width:600px;margin:20px auto;background:#fff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.1)}
.header{background:#000;color:#fff;padding:20px;text-align:center}
.section{padding:20px}
.info-row{margin:10px 0;padding:8px;background:#f9f9f9;border-radius:4px}
.highlight{font-weight:bold}
.footer{background:#f8f9fa;padding:15px;text-align:center;font-size:12px;color:#666}
</style></head><body>
<div class='container'>
  <div class='header'><h1>👤 Nuevo Lead</h1><p>${date}</p></div>
  <div class='section'>
    <div class='info-row'><span class='highlight'>Nombre:</span> ${leadData.name}</div>
    <div class='info-row'><span class='highlight'>Email:</span> ${leadData.email}</div>
    <div class='info-row'><span class='highlight'>Teléfono:</span> ${leadData.phone}</div>
    <div class='info-row'><span class='highlight'>Evento:</span> ${leadData.eventType || "No especificado"}</div>
  </div>
  <div class='footer'><p>Lead capturado del chatbot</p></div>
</div></body></html>`;
}

function determineRecommendedPackage(conversationData) {
  const fullConversation = (conversationData.full_conversation || '').toLowerCase();

  const patterns = {
    "Paquete Event Plus": [
      "boda",
      "matrimonio",
      "grande",
      "100",
      "200",
      "salon",
      "graduación",
      "xv años",
    ],
    "Paquete Party": [
      "fiesta",
      "celebración",
      "pequeña",
      "privada",
      "cumpleaños",
      "casa",
    ],
    "Paquete Live": [
      "corporativo",
      "empresa",
      "masivo",
      "promoción",
      "500",
      "1000",
    ],
  };

  const scores = {};
  for (const pkg in patterns) {
    let score = 0;
    for (const keyword of patterns[pkg]) {
      if (fullConversation.includes(keyword)) score++;
    }
    scores[pkg] = score;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  if (sorted[0][1] === 0) {
    return "Paquete Party (recomendación predeterminada)";
  }

  return sorted[0][0];
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de desarrollo iniciado en http://localhost:${PORT}`);
  console.log(`📧 Email API: http://localhost:${PORT}/api/send-email`);
  console.log(`💬 Chat API: http://localhost:${PORT}/api/chat`);
  console.log(`📁 Sirviendo archivos desde: ${__dirname}`);
  console.log(`🔧 Ambiente: Desarrollo (Node.js/Express)`);
});