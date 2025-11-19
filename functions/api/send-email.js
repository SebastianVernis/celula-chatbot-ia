/**
 * Cloudflare Worker - Endpoint Unificado de Envío de Emails
 * Maneja solicitudes del chatbot y cotizador con validación y rate limiting
 */

import { Resend } from 'resend';

// Configuración
const CONFIG = {
  RATE_LIMIT: {
    MAX_REQUESTS: 5,
    WINDOW_HOURS: 1,
  },
  EMAIL: {
    FROM: 'Grupo La Célula <contacto@grupolacelula.com>',
    REPLY_TO: 'contacto@grupolacelula.com',
  },
  CORS: {
    ALLOWED_ORIGINS: [
      'https://grupolacelula.com',
      'https://www.grupolacelula.com',
      'https://grupomusicalcelula.pages.dev',
      'http://localhost:8788', // Para desarrollo local
    ],
  },
};

/**
 * Valida el email según el tipo de formulario
 */
function validateEmail(data, type) {
  const errors = [];

  // Validaciones comunes
  if (!data.name || data.name.length < 2 || data.name.length > 100) {
    errors.push('Nombre debe tener entre 2 y 100 caracteres');
  }

  const emailRegex = /^[^S@]+@[^S@]+\.[^S@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push('Email inválido');
  }

  if (type === 'chatbot') {
    // Validaciones específicas del chatbot
    if (!data.message || data.message.length < 10 || data.message.length > 1000) {
      errors.push('Mensaje debe tener entre 10 y 1000 caracteres');
    }

    const phoneRegex = /^S\d{10}$/;
    if (data.phone && !phoneRegex.test(data.phone.replace(/\D/g, '')))
 {
      errors.push('Teléfono debe tener 10 dígitos');
    }
  } else if (type === 'cotizador') {
    // Validaciones específicas del cotizador
    const phoneRegex = /^S\d{10}$/;
    if (!data.phone || !phoneRegex.test(data.phone.replace(/\D/g, '')))
 {
      errors.push('Teléfono es requerido y debe tener 10 dígitos');
    }

    if (!data.eventType || data.eventType.length < 2) {
      errors.push('Tipo de evento es requerido');
    }

    if (!data.eventDate) {
      errors.push('Fecha del evento es requerida');
    } else {
      const eventDate = new Date(data.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        errors.push('La fecha del evento debe ser futura');
      }
    }

    if (!data.guestCount || data.guestCount < 1 || data.guestCount > 1000) {
      errors.push('Número de invitados debe estar entre 1 y 1000');
    }

    if (!data.location || data.location.length < 3) {
      errors.push('Ubicación es requerida');
    }
  } else {
    errors.push('Tipo de formulario inválido');
  }

  return errors;
}

/**
 * Sanitiza el input para prevenir XSS
 */
function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Verifica el rate limit usando Cloudflare KV
 */
async function checkRateLimit(ip, env) {
  if (!env.EMAIL_RATE_LIMIT) {
    console.warn('KV namespace EMAIL_RATE_LIMIT no configurado');
    return { allowed: true, remaining: CONFIG.RATE_LIMIT.MAX_REQUESTS };
  }

  const key = `rate_limit:${ip}`;
  const now = Date.now();
  const windowMs = CONFIG.RATE_LIMIT.WINDOW_HOURS * 60 * 60 * 1000;

  try {
    // Obtener datos existentes
    const data = await env.EMAIL_RATE_LIMIT.get(key, { type: 'json' });

    if (!data) {
      // Primera solicitud
      await env.EMAIL_RATE_LIMIT.put(
        key,
        JSON.stringify({ count: 1, resetAt: now + windowMs }),
        { expirationTtl: CONFIG.RATE_LIMIT.WINDOW_HOURS * 3600 }
      );
      return { allowed: true, remaining: CONFIG.RATE_LIMIT.MAX_REQUESTS - 1 };
    }

    // Verificar si la ventana expiró
    if (now > data.resetAt) {
      await env.EMAIL_RATE_LIMIT.put(
        key,
        JSON.stringify({ count: 1, resetAt: now + windowMs }),
        { expirationTtl: CONFIG.RATE_LIMIT.WINDOW_HOURS * 3600 }
      );
      return { allowed: true, remaining: CONFIG.RATE_LIMIT.MAX_REQUESTS - 1 };
    }

    // Verificar límite
    if (data.count >= CONFIG.RATE_LIMIT.MAX_REQUESTS) {
      const resetInMinutes = Math.ceil((data.resetAt - now) / 60000);
      return {
        allowed: false,
        remaining: 0,
        resetInMinutes,
      };
    }

    // Incrementar contador
    await env.EMAIL_RATE_LIMIT.put(
      key,
      JSON.stringify({ count: data.count + 1, resetAt: data.resetAt }),
      { expirationTtl: CONFIG.RATE_LIMIT.WINDOW_HOURS * 3600 }
    );

    return {
      allowed: true,
      remaining: CONFIG.RATE_LIMIT.MAX_REQUESTS - data.count - 1,
    };
  } catch (error) {
    console.error('Error en rate limiting:', error);
    // En caso de error, permitir la solicitud pero loggear
    return { allowed: true, remaining: CONFIG.RATE_LIMIT.MAX_REQUESTS };
  }
}

/**
 * Genera el contenido del email según el tipo
 */
function generateEmailContent(data, type) {
  const sanitizedData = {};
  for (const [key, value] of Object.entries(data)) {
    sanitizedData[key] = sanitizeInput(value);
  }

  if (type === 'chatbot') {
    return {
      subject: `Nuevo mensaje de ${sanitizedData.name} - Chatbot`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #667eea; }
            .value { margin-top: 5px; padding: 10px; background: white; border-radius: 3px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>💬 Nuevo Mensaje del Chatbot</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Nombre:</div>
                <div class="value">${sanitizedData.name}</div>
              </div>
              <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value">${sanitizedData.email}</div>
              </div>
              ${sanitizedData.phone ? `
              <div class="field">
                <div class="label">📱 Teléfono:</div>
                <div class="value">${sanitizedData.phone}</div>
              </div>
              ` : ''}
              <div class="field">
                <div class="label">💬 Mensaje:</div>
                <div class="value">${sanitizedData.message}</div>
              </div>
              <div class="footer">
                <p>📅 Recibido: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</p>
                <p>🌐 Fuente: Chatbot del sitio web</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  } else {
    // cotizador
    const eventDate = new Date(sanitizedData.eventDate);
    const formattedDate = eventDate.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return {
      subject: `Nueva Solicitud de Cotización - ${sanitizedData.eventType} - ${sanitizedData.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #f5576c; }
            .value { margin-top: 5px; padding: 10px; background: white; border-radius: 3px; }
            .highlight { background: #fff3cd; border-left: 4px solid #f5576c; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🎉 Nueva Solicitud de Cotización</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Nombre:</div>
                <div class="value">${sanitizedData.name}</div>
              </div>
              <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value">${sanitizedData.email}</div>
              </div>
              <div class="field">
                <div class="label">📱 Teléfono:</div>
                <div class="value">${sanitizedData.phone}</div>
              </div>
              <div class="field highlight">
                <div class="label">🎊 Tipo de Evento:</div>
                <div class="value">${sanitizedData.eventType}</div>
              </div>
              <div class="field highlight">
                <div class="label">📅 Fecha del Evento:</div>
                <div class="value">${formattedDate}</div>
              </div>
              <div class="field">
                <div class="label">👥 Número de Invitados:</div>
                <div class="value">${sanitizedData.guestCount} personas</div>
              </div>
              <div class="field">
                <div class="label">📍 Ubicación:</div>
                <div class="value">${sanitizedData.location}</div>
              </div>
              ${sanitizedData.additionalDetails ? `
              <div class="field">
                <div class="label">📝 Detalles Adicionales:</div>
                <div class="value">${sanitizedData.additionalDetails}</div>
              </div>
              ` : ''}
              <div class="footer">
                <p>📅 Recibido: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</p>
                <p>🌐 Fuente: Cotizador del sitio web</p>
                <p>⚡ Responder lo antes posible para no perder la oportunidad</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }
}

/**
 * Maneja las respuestas CORS
 */
function corsHeaders(origin) {
  const allowedOrigin = CONFIG.CORS.ALLOWED_ORIGINS.includes(origin)
    ? origin
    : CONFIG.CORS.ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Handler principal
 */
export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin') || '';

  // Manejar preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(origin),
    });
  }

  try {
    // Obtener IP del cliente
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

    // Verificar rate limit
    const rateLimitResult = await checkRateLimit(ip, env);
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Límite de solicitudes excedido. Intenta de nuevo en ${rateLimitResult.resetInMinutes} minutos.`,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin),
          },
        }
      );
    }

    // Parsear datos
    let data;
    try {
      data = await request.json();
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Datos inválidos',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin),
          },
        }
      );
    }

    // Detectar tipo de formulario
    const type = data.type || (data.message ? 'chatbot' : 'cotizador');

    // Validar datos
    const validationErrors = validateEmail(data, type);
    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Errores de validación',
          errors: validationErrors,
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin),
          },
        }
      );
    }

    // Verificar que las variables de entorno estén configuradas
    if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL) {
      console.error('Variables de entorno no configuradas');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Configuración del servidor incompleta',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin),
          },
        }
      );
    }

    // Inicializar Resend
    const resend = new Resend(env.RESEND_API_KEY);

    // Generar contenido del email
    const emailContent = generateEmailContent(data, type);

    // Enviar email
    try {
      const result = await resend.emails.send({
        from: CONFIG.EMAIL.FROM,
        to: env.CONTACT_EMAIL,
        replyTo: data.email,
        subject: emailContent.subject,
        html: emailContent.html,
      });

      // Log exitoso
      console.log('Email enviado exitosamente:', {
        id: result.id,
        type,
        from: data.email,
        ip,
        timestamp: new Date().toISOString(),
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Email enviado exitosamente',
          remaining: rateLimitResult.remaining,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin),
          },
        }
      );
    } catch (emailError) {
      console.error('Error al enviar email:', emailError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Error al enviar el email. Por favor intenta más tarde.',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin),
          },
        }
      );
    }
  } catch (error) {
    console.error('Error general:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error del servidor',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(origin),
        },
      }
    );
  }
}

// También manejar OPTIONS para CORS preflight
export async function onRequestOptions({ request }) {
  const origin = request.headers.get('Origin') || '';
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}