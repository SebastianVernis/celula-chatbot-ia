/**
 * Chatbot API para Grupo Musical La Célula usando Cloudflare Pages Functions
 * Este archivo debe colocarse en /functions/api/chatbot.js para funcionar con Cloudflare Pages
 */

// Función para llamar a la API de Gemini
async function callGeminiService(history, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

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