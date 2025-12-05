#!/usr/bin/env node

import fetch from 'node-fetch';

// Test para el nuevo sistema multi-provider
async function testMultiProvider() {
    const testMessage = {
        history: [
            {
                role: 'user',
                parts: [{ text: 'Hola, soy un cliente interesado en contratar un grupo musical para una boda. ¿Qué servicios ofrecen?' }]
            }
        ]
    };

    console.log('🧪 Testing Multi-Provider Chatbot System\n');

    // Test local (desarrollo)
    console.log('📍 Testing Local Development...');
    try {
        const localResponse = await fetch('http://localhost:3000/api/chatbot-multi-provider', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testMessage)
        });

        if (localResponse.ok) {
            const data = await localResponse.json();
            console.log('✅ Local test successful');
            console.log('📝 Response:', data.candidates?.[0]?.content?.parts?.[0]?.text?.substring(0, 100) + '...');
        } else {
            const error = await localResponse.json();
            console.log('❌ Local test failed:', localResponse.status, error);
        }
    } catch (error) {
        console.log('⚠️ Local server not running:', error.message);
    }

    // Test directo a APIs
    console.log('\n🔍 Testing Direct API Access...');
    
    // Test OpenRouter
    if (process.env.OPENROUTER_API_KEY) {
        console.log('🌐 Testing OpenRouter...');
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'Célula Chatbot Test'
                },
                body: JSON.stringify({
                    model: 'meta-llama/llama-3.2-3b-instruct:free',
                    messages: [
                        { role: 'user', content: 'Hola, responde brevemente.' }
                    ],
                    temperature: 0.7,
                    max_tokens: 100
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ OpenRouter working');
                console.log('📝 Response:', data.choices[0].message.content);
            } else {
                const error = await response.json();
                console.log('❌ OpenRouter error:', response.status, error);
            }
        } catch (error) {
            console.log('❌ OpenRouter connection error:', error.message);
        }
    } else {
        console.log('⚠️ OPENROUTER_API_KEY not found');
    }

    // Test Groq
    if (process.env.GROQ_API_KEY) {
        console.log('\n⚡ Testing Groq...');
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'llama-3.2-3b-preview',
                    messages: [
                        { role: 'user', content: 'Hola, responde brevemente.' }
                    ],
                    temperature: 0.7,
                    max_tokens: 100
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Groq working');
                console.log('📝 Response:', data.choices[0].message.content);
                console.log('⚡ Speed: VERY FAST');
            } else {
                const error = await response.json();
                console.log('❌ Groq error:', response.status, error);
            }
        } catch (error) {
            console.log('❌ Groq connection error:', error.message);
        }
    } else {
        console.log('⚠️ GROQ_API_KEY not found');
    }

    // Mostrar configuración recomendada
    console.log('\n🎯 Recommended Setup:');
    console.log('1. Get OpenRouter API Key: https://openrouter.ai/keys');
    console.log('2. Get Groq API Key: https://console.groq.com/keys');
    console.log('3. Set environment variables:');
    console.log('   export OPENROUTER_API_KEY=your_key_here');
    console.log('   export GROQ_API_KEY=your_key_here');

    // Mostrar configuración de Vercel
    console.log('\n🔧 Vercel Environment Variables:');
    console.log('vercel env add OPENROUTER_API_KEY');
    console.log('vercel env add GROQ_API_KEY');
}

testMultiProvider().catch(console.error);