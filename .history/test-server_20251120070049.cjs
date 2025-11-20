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

  const { type, leadData, conversationData, formData } = req.body;

  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY no configurada');
    return res.status(500).json({
      success: false,
      error: 'Configuración de email no disponible'
    });
  }

  let emailHtml, subject;

  // Determinar tipo de email
  if (type === 'chatbot_summary') {
    emailHtml = createChatbotSummaryEmail(leadData, conversationData);
    subject = `🎵 Nueva consulta musical - ${leadData.name}`;
  } else if (type === 'form_cotizador') {
    emailHtml = createCotizadorEmail(formData);
    subject = `📝 Nueva cotización - ${formData.nombre}`;
  } else if (type === 'chatbot_lead') {
    emailHtml = createLeadCaptureEmail(leadData);
    subject = `👤 Nuevo lead - ${leadData.name}`;
  } else {
    return res.status(400).json({
      success: false,
      error: 'Tipo no reconocido'
    });
  }

  console.log('📨 Intentando enviar email...');
  console.log('- Asunto:', subject);
  console.log('- Para:', CONTACT_EMAIL);

  try {
    // Enviar con Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Grupo La Célula <onboarding@resend.dev>',
        to: [CONTACT_EMAIL],
        subject: subject,
        html: emailHtml
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Email enviado exitosamente');
      console.log('- ID del email:', result.id);
      res.json({
        success: true,
        message: 'Email enviado',
        emailId: result.id
      });
    } else {
      console.error('❌ Error de Resend:', result);
      throw new Error(result.message || 'Error al enviar');
    }
  } catch (error) {
    console.error('❌ Error al enviar email:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint para el chatbot (Gemini AI)
app.post('/api/chatbot', async (req, res) => {
  console.log('🤖 Petición recibida en /api/chatbot');

  const { history } = req.body;

  if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY no configurada');
    return res.status(500).json({
      error: 'GEMINI_API_KEY no configurada. Configúrala como variable de entorno.'
    });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const contents = history.map(item => ({
      role: item.role,
      parts: Array.isArray(item.parts) ? item.parts : [{ text: item.parts[0]?.text || '' }]
    }));

    const payload = {
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error en Gemini API:', errorData);
      throw new Error(`Error ${response.status}: ${errorData.error?.message || 'Error desconocido'}`);
    }

    const data = await response.json();
    console.log('✅ Respuesta de Gemini recibida');
    
    res.json(data);

  } catch (error) {
    console.error('❌ Error en chatbot:', error.message);
    res.status(500).json({
      error: error.message
    });
  }
});

// Funciones para crear los emails HTML
function createChatbotSummaryEmail(leadData, conversationData) {
  const date = new Date().toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const eventType = leadData.eventType || 'No especificado';
  const userMessages = conversationData.user_messages || [];
  const conversationLength = conversationData.conversation_length || userMessages.length;

  let conversationExcerpt = '';
  userMessages.slice(-5).forEach(msg => {
    conversationExcerpt += `• ${msg}<br>`;
  });

  const recommendedPackage = determineRecommendedPackage(conversationData);

  return `<!DOCTYPE html>
<html><head><style>
body{font-family:'Open Sans',Arial,sans-serif;line-height:1.6;color:#333;background:#f4f4f4}
.container{max-width:600px;margin:20px auto;background:#fff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.1)}
.header{background:#000;color:#fff;padding:20px;text-align:center}
.section{padding:20px;border-bottom:1px solid #eee}
.info-row{margin:10px 0;padding:8px;background:#f9f9f9;border-radius:4px}
.highlight{font-weight:bold}
.conversation{margin:15px 0;padding:15px;background:#f5f5f5;border-radius:5px}
.package{background:#e6f7ff;padding:20px;border-left:4px solid #3D9BE9}
.actions{background:#fff3cd;padding:15px}
.footer{background:#f8f9fa;padding:15px;text-align:center;font-size:12px;color:#666}
</style></head><body>
<div class='container'>
  <div class='header'><h1>🎵 Nueva Consulta Musical</h1><p>${date}</p></div>
  <div class='section'><h2>📋 Cliente</h2>
    <div class='info-row'><span class='highlight'>Nombre:</span> ${leadData.name}</div>
    <div class='info-row'><span class='highlight'>Email:</span> ${leadData.email}</div>
    <div class='info-row'><span class='highlight'>Teléfono:</span> ${leadData.phone}</div>
    <div class='info-row'><span class='highlight'>Evento:</span> ${eventType}</div>
  </div>
  <div class='package'><h2>💡 Recomendación</h2><p>${recommendedPackage}</p></div>
  <div class='section'><h2>💬 Conversación</h2>
    <div class='conversation'>${conversationExcerpt}</div>
    <p style='font-size:13px;color:#666'>Total: ${conversationLength} mensajes</p>
  </div>
  <div class='actions'><h2>⚡ Acciones</h2>
    <p>1. Contactar en las próximas 2 horas</p>
    <p>2. WhatsApp al ${leadData.phone}</p>
  </div>
  <div class='footer'><p>Chatbot Grupo Musical La Célula</p></div>
</div></body></html>`;
}

function createCotizadorEmail(formData) {
  const date = new Date().toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
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
  ${formData.mensaje ? `<div class='section'><h2>Mensaje</h2><p style='background:#f9f9f9;padding:15px;border-radius:4px'>${formData.mensaje}</p></div>` : ''}
  <div class='footer'><p>Formulario de grupomusicalcelula.pages.dev</p></div>
</div></body></html>`;
}

function createLeadCaptureEmail(leadData) {
  const date = new Date().toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
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
    <div class='info-row'><span class='highlight'>Evento:</span> ${leadData.eventType || 'No especificado'}</div>
  </div>
  <div class='footer'><p>Lead capturado del chatbot</p></div>
</div></body></html>`;
}

function determineRecommendedPackage(conversationData) {
  const userMessages = (conversationData.user_messages || []).join(' ').toLowerCase();

  const patterns = {
    'Paquete Event Plus': ['boda', 'matrimonio', 'grande', '100', '200', 'salon', 'graduación', 'xv años'],
    'Paquete Party': ['fiesta', 'celebración', 'pequeña', 'privada', 'cumpleaños', 'casa'],
    'Paquete Live': ['corporativo', 'empresa', 'masivo', 'promoción', '500', '1000']
  };

  const scores = {};
  for (const pkg in patterns) {
    let score = 0;
    for (const keyword of patterns[pkg]) {
      if (userMessages.includes(keyword)) score++;
    }
    scores[pkg] = score;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  if (sorted[0][1] === 0) {
    return 'Paquete Party (recomendación predeterminada)';
  }

  return sorted[0][0];
}

// Iniciar el servidor
app.listen(PORT, () => {
  console.log('\n🎵 ========================================');
  console.log('   SERVIDOR DE PRUEBA - LA CÉLULA');
  console.log('========================================');
  console.log(`\n✅ Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`\n📱 Para probar el chatbot:`);
  console.log(`   1. Abre: http://localhost:${PORT}/index.html`);
  console.log(`   2. Haz clic en el botón del chatbot`);
  console.log(`   3. Llena el formulario de contacto`);
  console.log(`   4. Envía mensajes en el chat`);
  console.log(`   5. Revisa la consola del servidor para ver los logs`);
  console.log(`\n📧 Emails se enviarán a: ${CONTACT_EMAIL}`);
  console.log(`\n🛑 Para detener: Ctrl+C\n`);
});
