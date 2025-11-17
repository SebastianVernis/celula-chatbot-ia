/**
 * Servicio de email para el chatbot de Grupo Musical Versátil La Célula usando Cloudflare Pages Functions
 * Este archivo debe colocarse en /functions/api/email.js para funcionar con Cloudflare Pages
 */

export async function onRequest(context) {
  // Manejar CORS para solicitudes preflight
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400"
      },
      status: 204
    });
  }

  // Solo aceptar solicitudes POST
  if (context.request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método no permitido" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  try {
    // Obtener el cuerpo de la solicitud
    const requestData = await context.request.json();
    
    // Verificar que tenemos datos válidos
    if (!requestData || !requestData.action) {
      return new Response(JSON.stringify({ error: "Datos inválidos" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Comprobar si es una solicitud de resumen de conversación
    if (requestData.action === 'send_summary') {
      if (!requestData.leadData || !requestData.conversationData) {
        return new Response(JSON.stringify({ error: "Faltan datos del lead o la conversación" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
      
      // Enviar email usando Cloudflare Email Workers
      const sendResult = await sendEmailSummary(
        context, 
        requestData.leadData, 
        requestData.conversationData
      );
      
      return new Response(JSON.stringify(sendResult), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } else {
      return new Response(JSON.stringify({ error: "Acción no reconocida" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: `Error al procesar la solicitud: ${error.message}` 
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}

/**
 * Función para enviar un resumen de conversación por email
 * Utiliza Cloudflare Email Workers (debe configurarse previamente)
 */
async function sendEmailSummary(context, leadData, conversationData) {
  try {
    // Obtener la clave secreta para el servicio de email (configurada en Cloudflare)
    const sendGridApiKey = context.env.SENDGRID_API_KEY;
    
    if (!sendGridApiKey) {
      console.error("API Key de SendGrid no configurada");
      return { 
        success: false, 
        message: "Configuración de email no disponible" 
      };
    }
    
    // Preparar los datos para el email
    const adminEmail = 'contacto@grupomusicalcelula.com'; // Email de destino
    const date = new Date().toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Determinar tipo de evento (si existe)
    const eventType = leadData.eventType || 'No especificado';
    
    // Preparar extracto de la conversación (últimos 5 mensajes)
    let conversationExcerpt = '';
    const userMessages = conversationData.user_messages || [];
    const recentMessages = userMessages.slice(-3);
    
    recentMessages.forEach(message => {
      conversationExcerpt += `• Cliente: ${message}\n`;
    });
    
    // Determinar paquete recomendado basado en palabras clave
    const recommendedPackage = determineRecommendedPackage(conversationData);
    
    // Crear el contenido del email
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Open Sans', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #000000; color: white; padding: 15px; text-align: center; }
    .section { margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #3D9BE9; }
    .footer { font-size: 12px; text-align: center; margin-top: 30px; color: #777; }
    h2 { color: #3D9BE9; }
    .highlight { font-weight: bold; color: #000000; }
    .conversation { margin: 15px 0; padding: 10px; background-color: #f5f5f5; border-radius: 5px; }
    .package-recommendation { background-color: #e6f7ff; padding: 15px; margin: 20px 0; border-left: 4px solid #3D9BE9; }
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <h1>Nueva solicitud de información musical</h1>
      <p>${date}</p>
    </div>
    
    <div class='section'>
      <h2>Datos del cliente</h2>
      <p><span class='highlight'>Nombre:</span> ${leadData.name}</p>
      <p><span class='highlight'>Email:</span> ${leadData.email}</p>
      <p><span class='highlight'>Teléfono:</span> ${leadData.phone}</p>
      <p><span class='highlight'>Tipo de evento:</span> ${eventType}</p>
    </div>
    
    <div class='package-recommendation'>
      <h2>Paquete recomendado</h2>
      <p>Basado en la conversación, el cliente podría estar interesado en:</p>
      <p><span class='highlight'>${recommendedPackage}</span></p>
    </div>
    
    <div class='section'>
      <h2>Extracto de la conversación</h2>
      <div class='conversation'>
        <pre>${conversationExcerpt}</pre>
      </div>
      <p>Total de mensajes: ${conversationData.conversation_length}</p>
    </div>
    
    <div class='section'>
      <h2>Acciones recomendadas</h2>
      <p>1. Contactar al cliente lo antes posible (preferiblemente en las próximas 2 horas)</p>
      <p>2. Ofrecer información específica sobre los paquetes adecuados para su evento</p>
      <p>3. Verificar disponibilidad para la fecha solicitada</p>
      <p>4. Enviar propuesta personalizada o coordinar una llamada para detalles</p>
    </div>
    
    <div class='footer'>
      <p>Este email fue generado automáticamente por el chatbot de Grupo Musical Versátil La Célula.</p>
      <p>&copy; 2025 Grupo Musical Versátil La Célula. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
    `;
    
    // Crear el objeto de email para SendGrid
    const msg = {
      to: adminEmail,
      from: 'chatbot@grupomusicalcelula.com', // Debe ser un dominio verificado en SendGrid
      subject: `🎵 Nueva consulta musical - ${leadData.name}`,
      html: emailContent,
    };
    
    // Llamar a la API de SendGrid para enviar el email
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sendGridApiKey}`
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: adminEmail }] }],
        from: { email: 'chatbot@grupomusicalcelula.com', name: 'Chatbot La Célula' },
        subject: `🎵 Nueva consulta musical - ${leadData.name}`,
        content: [{ type: 'text/html', value: emailContent }],
      })
    });
    
    if (response.ok) {
      return { success: true, message: 'Email enviado correctamente' };
    } else {
      const errorText = await response.text();
      throw new Error(`Error de SendGrid: ${errorText}`);
    }
    
  } catch (error) {
    console.error("Error al enviar email:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

/**
 * Determina el paquete recomendado basado en palabras clave
 */
function determineRecommendedPackage(conversationData) {
  const userMessages = (conversationData.user_messages || []).join(' ');
  const userMessagesLower = userMessages.toLowerCase();
  
  // Patrones para diferentes tipos de eventos
  const patterns = {
    'Paquete Event Plus': [
      'boda', 'matrimonio', 'grande', '100 invitados', '200 invitados', 'salon', 'graduación', 
      'graduacion', 'XV años', 'quinceañera', 'quinceañeros'
    ],
    'Paquete Party': [
      'fiesta', 'celebración', 'pequeña', 'privada', 'cumpleaños', 'aniversario', 
      '50 personas', 'casa', 'intima'
    ],
    'Paquete Live': [
      'corporativo', 'empresa', 'masivo', 'promoción', 'lanzamiento', 'concierto', 
      'presentación', 'evento grande', '500 personas', '1000 personas'
    ]
  };
  
  // Contar coincidencias para cada paquete
  const scores = {};
  for (const packageName in patterns) {
    let score = 0;
    for (const keyword of patterns[packageName]) {
      if (userMessagesLower.includes(keyword)) {
        score++;
      }
    }
    scores[packageName] = score;
  }
  
  // Ordenar paquetes por puntuación
  const sortedPackages = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  // Si no hay coincidencias claras, recomendar el paquete intermedio
  if (scores[sortedPackages[0]] === 0) {
    return "Paquete Party (recomendación predeterminada - contactar para confirmar necesidades)";
  }
  
  // Añadir razón de la recomendación
  const recommendedPackage = sortedPackages[0];
  let reason = "";
  
  switch (recommendedPackage) {
    case 'Paquete Event Plus':
      reason = "ideal para eventos grandes como bodas, XV años o graduaciones";
      break;
    case 'Paquete Party':
      reason = "perfecto para fiestas medianas y celebraciones privadas";
      break;
    case 'Paquete Live':
      reason = "diseñado para eventos corporativos o masivos";
      break;
  }
  
  return `${recommendedPackage} (${reason})`;
}