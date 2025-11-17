/**
 * Chatbot API para Grupo Musical La Célula usando Cloudflare Pages Functions
 * Este archivo debe colocarse en /functions/api/chatbot.js para funcionar con Cloudflare Pages
 */

// Función para llamar a la API de Gemini
async function callGeminiService(history, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  // Ajustar el historial para que coincida con el formato de la API de Gemini
  const contents = history.map(item => {
    // Asegurarse de que 'parts' sea siempre un array
    const parts = Array.isArray(item.parts) ? item.parts : [{ text: item.parts[0]?.text || '' }];
    return {
      role: item.role,
      parts: parts
    };
  });

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

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error en la API de Gemini:", errorData);
      throw new Error(`Error ${response.status}: ${errorData.error?.message || 'Error desconocido'}`);
    }

    const data = await response.json();
    
    // Devolver la respuesta en el formato esperado, con un fallback
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 
           "Lo siento, no pude generar una respuesta. Por favor, intenta de nuevo.";

  } catch (error) {
    console.error("Error al llamar a la API de Gemini:", error.message);
    // Devolver un mensaje de error claro para depuración en el frontend
    return `Error al contactar al asistente. Por favor, contacta por WhatsApp al 55 3541 2631. (Detalle: ${error.message})`;
  }
}


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
    if (!requestData || !requestData.history) {
      return new Response(JSON.stringify({ error: "Datos inválidos" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Obtener la clave API desde Cloudflare Secret
    const apiKey = context.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API Key no configurada" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // 1. Llamar a la API de Gemini
    const botResponse = await callGeminiService(requestData.history, apiKey);
    
    // Devolver la respuesta en el formato esperado por el frontend
    return new Response(JSON.stringify({
      candidates: [
        {
          content: {
            parts: [
              { text: botResponse }
            ]
          }
        }
      ]
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: `Error al procesar la solicitud: ${error.message}` }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}

/**
 * Función para generar respuestas locales basadas en reglas (dejada como referencia)
 */
function generateLocalResponse(history) {
  // ... (el resto de la función se puede dejar aquí por si se necesita en el futuro o eliminar)
  const fallbackResponses = [
    "Respuesta de fallback: No se pudo conectar con el servicio de IA.",
    "Respuesta de fallback: Por favor contacta a soporte."
  ];
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}"El **Paquete Live** está diseñado especialmente para eventos corporativos grandes. ¿Podría contarme más sobre el tipo de evento que está organizando?"
    ],
    
    // Preguntas sobre disponibilidad o fechas
    'disponib|fecha|día|agenda|cuando|cuándo': [
      "Para verificar nuestra **disponibilidad** para tu fecha, necesitamos que nos indiques:\n\n" +
      "- ¿Qué día específico estás considerando?\n" +
      "- ¿En qué horario sería tu evento?\n" +
      "- ¿Qué tipo de evento estás planeando?\n\n" +
      "Te recomendamos reservar con 2-3 meses de anticipación, especialmente para temporada alta (diciembre-enero y mayo-junio). Puedes consultar disponibilidad inmediata por WhatsApp al **55 3541 2631** 📱"
    ],
    
    // Preguntas sobre el proceso de contratación
    'contrat|reserv|anticipo|apartado|proceso': [
      "El **proceso de contratación** es muy sencillo: 🎵📝\n\n" +
      "1. **Cotización personalizada** según tus necesidades\n" +
      "2. **Reserva** con un anticipo del 30%\n" +
      "3. **Confirmación** de detalles (horario, playlist especial, etc.)\n" +
      "4. **Pago** del saldo restante antes del evento\n" +
      "5. **¡Disfruta tu evento!** Nosotros nos encargamos de todo\n\n" +
      "Para comenzar, puedes usar nuestro cotizador en línea o contactarnos directamente por WhatsApp al **55 3541 2631**. ¿Te gustaría iniciar el proceso ahora?"
    ],
    
    // Preguntas sobre equipo/instrumentos/montaje
    'equipo|instrument|sonido|montaje': [
      "Contamos con **equipo profesional** para eventos de cualquier tamaño: 🎧🎚️\n\n" +
      "- Sistemas de sonido de alta fidelidad\n" +
      "- Iluminación profesional robotizada y láser\n" +
      "- Pantallas LED (según el paquete)\n" +
      "- Instrumentos profesionales\n" +
      "- Efectos especiales\n\n" +
      "Realizamos el **montaje completo** con anticipación para garantizar que todo funcione perfectamente. El tiempo de montaje varía según el paquete, pero generalmente necesitamos 2-3 horas antes del evento. ¿Tienes alguna necesidad técnica específica para tu evento?"
    ],
    
    // Saludos o inicios de conversación
    'hola|buenos dias|buenas tardes|buenas noches|saludos|buen día': [
      "¡Hola! 👋 Bienvenido al asistente virtual de **Grupo Musical Versátil La Célula**. Estoy aquí para ayudarte a encontrar la música perfecta para tu evento. ¿En qué puedo ayudarte hoy? ¿Buscas información sobre nuestros paquetes, disponibilidad o tienes alguna duda específica?"
    ],
    
    // Despedidas o agradecimientos
    'gracias|adios|adiós|hasta luego|bye|chao': [
      "¡Gracias por contactarnos! 🎵 Ha sido un placer ayudarte. Si tienes más preguntas, no dudes en escribirnos por WhatsApp al **55 3541 2631** o usar nuestro cotizador en línea. ¡Esperamos ser parte de tu evento especial! 🎉"
    ]
  };
  
  // Buscar coincidencias en los patrones
  for (const pattern in patterns) {
    const regex = new RegExp(`\\b(${pattern})\\b`, 'i');
    if (regex.test(userMessageLower)) {
      // Elegir una respuesta aleatoria dentro de las posibles para ese patrón
      const responses = patterns[pattern];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  // Si no hay coincidencia específica, usar respuestas genéricas
  const fallbackResponses = [
    "Gracias por tu mensaje. En **Grupo Musical La Célula** nos especializamos en hacer tu evento inolvidable con nuestra música versátil. 🎵\n\n¿Podrías contarme más sobre el tipo de evento que estás planeando? Así podré brindarte información más específica sobre nuestros paquetes.",
    
    "¡Qué interesante! Para ofrecerte la mejor recomendación, me gustaría saber: ¿estás planeando una boda 💍, XV años 🎂, evento corporativo 🏢 u otro tipo de celebración? Cada evento tiene necesidades específicas que podemos atender.",
    
    "Entiendo. Para ayudarte mejor, ¿podrías indicarme aproximadamente cuántas personas asistirán a tu evento? Esto me ayudará a recomendarte el paquete musical más adecuado para tus necesidades.",
    
    "Gracias por compartir esa información. 😊 Si quieres una **cotización personalizada**, puedes contactarnos directamente por WhatsApp al **55 3541 2631** o proporcionarme más detalles sobre tu evento aquí mismo.",
    
    "**Grupo Musical Versátil La Célula** tiene más de 10 años de experiencia creando ambientes musicales perfectos. ¿Hay algún género musical en particular que te gustaría incluir en tu evento?",
    
    "Me encantaría ayudarte a hacer tu evento especial. ¿Ya tienes una fecha definida? Podemos verificar nuestra disponibilidad y comenzar a planificar la música perfecta para tu celebración."
  ];
  
  // Elegir una respuesta genérica aleatoria
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}