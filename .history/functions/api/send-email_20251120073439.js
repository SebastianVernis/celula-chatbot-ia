/**
 * API de Email para Grupo Musical La Célula
 * Usa Resend API para enviar emails
 * Endpoint: /api/send-email
 */

export async function onRequest(context) {
  // Manejar CORS
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      },
      status: 204,
    });
  }

  if (context.request.method !== "POST") {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Método no permitido",
      }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  try {
    const data = await context.request.json();
    const { type, leadData, conversationData, formData } = data;

    // Verificar configuración
    const resendApiKey = context.env.RESEND_API_KEY;
    const contactEmail =
      context.env.CONTACT_EMAIL || "contacto@grupomusicalcelula.pages.dev";

    if (!resendApiKey) {
      console.error("RESEND_API_KEY no configurada");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Configuración de email no disponible",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Rate limiting con KV
    if (context.env.EMAIL_RATE_LIMIT) {
      const clientIP =
        context.request.headers.get("CF-Connecting-IP") || "unknown";
      const rateLimitKey = `email_limit_${clientIP}`;
      const now = Date.now();
      const limitWindow = 60 * 60 * 1000; // 1 hora
      const maxEmails = 5; // máximo 5 emails por hora

      try {
        const rateLimitData = await context.env.EMAIL_RATE_LIMIT.get(
          rateLimitKey,
          "json"
        );

        if (rateLimitData) {
          const { count, firstRequest } = rateLimitData;

          if (now - firstRequest < limitWindow && count >= maxEmails) {
            return new Response(
              JSON.stringify({
                success: false,
                error:
                  "Límite de emails alcanzado. Por favor intenta más tarde.",
              }),
              {
                status: 429,
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
              }
            );
          }

          if (now - firstRequest >= limitWindow) {
            await context.env.EMAIL_RATE_LIMIT.put(
              rateLimitKey,
              JSON.stringify({
                count: 1,
                firstRequest: now,
              }),
              { expirationTtl: 3600 }
            );
          } else {
            await context.env.EMAIL_RATE_LIMIT.put(
              rateLimitKey,
              JSON.stringify({
                count: count + 1,
                firstRequest,
              }),
              { expirationTtl: 3600 }
            );
          }
        } else {
          await context.env.EMAIL_RATE_LIMIT.put(
            rateLimitKey,
            JSON.stringify({
              count: 1,
              firstRequest: now,
            }),
            { expirationTtl: 3600 }
          );
        }
      } catch (kvError) {
        console.error("KV error:", kvError);
      }
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
      return new Response(
        JSON.stringify({
          success: false,
          error: "Tipo no reconocido",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
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
      return new Response(
        JSON.stringify({
          success: true,
          message: "Email enviado",
          emailId: result.id,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } else {
      throw new Error(result.message || "Error al enviar");
    }
  } catch (error) {
    console.error("Error send-email:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

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
  <div class='footer'><p>Formulario de grupomusicalcelula.pages.dev</p></div>
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
  const userMessages = (conversationData.user_messages || [])
    .join(" ")
    .toLowerCase();

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
      if (userMessages.includes(keyword)) score++;
    }
    scores[pkg] = score;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  if (sorted[0][1] === 0) {
    return "Paquete Party (recomendación predeterminada)";
  }

  return sorted[0][0];
}
