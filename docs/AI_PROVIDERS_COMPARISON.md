# 🤖 Alternativas de APIs de IA Gratuitas para Chatbot

## Opciones Recomendadas (Gratis/Freemium)

### 1. **Groq** ⭐ RECOMENDADO
- **Modelo**: llama-3.2-3b-preview, llama-3.1-8b-instant
- **Límite gratuito**: 14,400 requests/día
- **Velocidad**: Extremadamente rápida (~500 tokens/sec)
- **Contexto**: 8K tokens (suficiente para chatbot)
- **Setup**: API key gratuita, compatible con OpenAI SDK

```javascript
// Implementación simple
import OpenAI from 'openai';

const groq = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY
});
```

### 2. **Together AI**
- **Modelos**: llama-3.2-3b, mistral-7b, qwen-2.5-7b
- **Límite gratuito**: $25 créditos iniciales
- **Contexto**: 4K-32K según modelo
- **Velocidad**: Muy buena
- **Ventaja**: Muchos modelos open-source

### 3. **Hugging Face Inference API**
- **Modelos**: microsoft/DialoGPT, facebook/blenderbot
- **Límite**: 1000 requests/mes gratis
- **Ventaja**: Especializado en conversación
- **Desventaja**: Límite bajo

### 4. **Cohere**
- **Modelo**: command-light
- **Límite gratuito**: 100 requests/min, 1000/mes
- **Contexto**: 4K tokens
- **Ventaja**: Diseñado para apps conversacionales

### 5. **Anthropic Claude (Haiku)**
- **Límite**: $5 créditos gratis
- **Modelo**: claude-3-haiku
- **Contexto**: 200K (overkill para tu caso)
- **Velocidad**: Buena, menor costo por token

## Implementación Rápida - Groq

```javascript
// api/chatbot.js - Versión Groq
import OpenAI from 'openai';

const groq = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { history } = req.body;
    
    // Convertir formato Gemini a OpenAI
    const messages = history.map(msg => ({
      role: msg.role === 'model' ? 'assistant' : msg.role,
      content: msg.parts[0].text
    }));

    const completion = await groq.chat.completions.create({
      model: "llama-3.2-3b-preview", // Rápido y eficiente
      messages,
      temperature: 0.7,
      max_tokens: 1024
    });

    // Convertir respuesta a formato Gemini
    return res.status(200).json({
      candidates: [{
        content: {
          parts: [{ text: completion.choices[0].message.content }],
          role: 'model'
        }
      }]
    });

  } catch (error) {
    console.error('Groq error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
```

## Comparación Rápida

| Proveedor | Límite Gratis | Velocidad | Setup | Recomendación |
|-----------|---------------|-----------|-------|---------------|
| **Groq** | 14,400/día | ⚡ Muy rápida | Fácil | ⭐ Mejor opción |
| Together AI | $25 créditos | 🚀 Rápida | Fácil | ⭐ Buena alternativa |
| Cohere | 1000/mes | 🏃 Buena | Medio | ✅ Para bajo tráfico |
| HF Inference | 1000/mes | 🐌 Lenta | Difícil | ⚠️ Muy limitado |
| Claude Haiku | $5 créditos | 🏃 Buena | Fácil | ✅ Calidad alta |

## ⚡ Migración Inmediata - Groq

1. **Registrarse**: https://console.groq.com/
2. **Obtener API key gratuita**
3. **Instalar dependencia**:
   ```bash
   npm install openai
   ```
4. **Actualizar variables de entorno**:
   ```
   GROQ_API_KEY=gsk_xxxxxxxxxxxxx
   ```

## Ventajas de Groq para tu caso:
- ✅ **Gratis** con límites altos
- ✅ **Velocidad extrema** (mejor UX)
- ✅ **Fácil migración** (compatible OpenAI)
- ✅ **Stable** y confiable
- ✅ **Buena calidad** de respuestas

¿Quieres que implemente la migración a Groq ahora mismo?