#!/usr/bin/env node

import fetch from 'node-fetch';

async function getGroqModels() {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
        console.error('❌ GROQ_API_KEY no está configurada');
        return;
    }

    console.log('🔍 Obteniendo modelos disponibles en Groq...\n');

    try {
        const response = await fetch('https://api.groq.com/openai/v1/models', {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            
            console.log('✅ Modelos disponibles en Groq:');
            console.log('=====================================\n');
            
            data.data.forEach(model => {
                console.log(`📋 ${model.id}`);
                if (model.context_window) {
                    console.log(`   Context: ${model.context_window} tokens`);
                }
                console.log('');
            });

            // Filtrar modelos recomendados para chatbot
            console.log('🎯 Recomendados para chatbot:');
            console.log('============================');
            
            const recommended = data.data.filter(model => 
                model.id.includes('llama') || 
                model.id.includes('gemma') || 
                model.id.includes('mixtral')
            );

            recommended.forEach(model => {
                let emoji = '🤖';
                if (model.id.includes('llama-3.3')) emoji = '🚀'; // Más nuevo
                if (model.id.includes('llama-3.1')) emoji = '⭐'; // Balanceado
                if (model.id.includes('gemma')) emoji = '🇪🇸'; // Bueno en español
                if (model.id.includes('mixtral')) emoji = '🧠'; // Inteligente
                
                console.log(`${emoji} ${model.id}`);
            });

        } else {
            const error = await response.json();
            console.error('❌ Error:', response.status, error);
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
    }
}

getGroqModels().catch(console.error);