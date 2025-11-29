/**
 * AWS Lambda Handler for Chatbot
 * Converts Cloudflare Pages format to AWS Lambda format
 */

// Función para llamar a la API de Gemini
async function callGeminiService(history, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`;

  const contents = history.map(item => {
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
      maxOutputTokens: 800,
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
    
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 
           "Lo siento, no pude generar una respuesta. Por favor, intenta de nuevo.";

  } catch (error) {
    console.error("Error al llamar a la API de Gemini:", error.message);
    return `Error al contactar al asistente. Por favor, contacta por WhatsApp al 55 3541 2631. (Detalle: ${error.message})`;
  }
}

export const handler = async (event) => {
  console.log('🤖 Lambda Chatbot called');
  console.log('Event:', JSON.stringify(event, null, 2));

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS" || event.requestContext?.http?.method === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400"
      },
      body: ""
    };
  }

  // Only accept POST
  const method = event.httpMethod || event.requestContext?.http?.method;
  if (method !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: "Método no permitido" })
    };
  }

  try {
    // Parse request body
    const requestData = typeof event.body === 'string' 
      ? JSON.parse(event.body) 
      : event.body;
    
    console.log('📊 History length:', requestData?.history?.length || 0);
    
    if (!requestData || !requestData.history) {
      console.error('❌ Invalid request data');
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: "Datos inválidos" })
      };
    }

    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    
    console.log('🔑 GEMINI_API_KEY available:', !!apiKey);
    
    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY no configurada');
      console.error('Available env keys:', Object.keys(process.env));
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ 
          error: "API Key no configurada. Por favor, configura GEMINI_API_KEY en AWS Amplify Environment Variables." 
        })
      };
    }

    // Call Gemini API
    const botResponse = await callGeminiService(requestData.history, apiKey);
    
    // Return response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        candidates: [
          {
            content: {
              parts: [
                { text: botResponse }
              ]
            }
          }
        ]
      })
    };
    
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ 
        error: `Error al procesar la solicitud: ${error.message}` 
      })
    };
  }
};
