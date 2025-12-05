#!/usr/bin/env node

import fetch from 'node-fetch';

async function testGeminiAPI() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY no está configurada');
        return;
    }

    console.log('✅ API Key encontrada (longitud:', apiKey.length, ')');
    
    // Test 1: Verificar modelos disponibles
    console.log('\n🔍 Verificando modelos disponibles...');
    try {
        const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const modelsData = await modelsResponse.json();
        
        if (modelsResponse.ok) {
            console.log('✅ Conexión a API exitosa');
            console.log('📋 Modelos disponibles:');
            modelsData.models?.forEach(model => {
                console.log(`   - ${model.name} (${model.displayName})`);
            });
        } else {
            console.error('❌ Error al obtener modelos:', modelsData);
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
    }

    // Test 2: Verificar límites de cuota
    console.log('\n🔍 Probando generación de contenido...');
    try {
        const generateResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: 'Hola, responde brevemente' }]
                    }]
                })
            }
        );
        
        const generateData = await generateResponse.json();
        
        if (generateResponse.ok) {
            console.log('✅ Generación exitosa');
            console.log('📝 Respuesta:', generateData.candidates?.[0]?.content?.parts?.[0]?.text);
        } else {
            console.error('❌ Error en generación:');
            console.error('Status:', generateResponse.status, generateResponse.statusText);
            console.error('Detalles:', JSON.stringify(generateData, null, 2));
            
            if (generateResponse.status === 429) {
                console.log('\n⚠️  ERROR 429: Rate limit excedido');
                console.log('🕐 Posibles causas:');
                console.log('   - Cuota diaria agotada');
                console.log('   - Demasiadas requests por minuto');
                console.log('   - API key suspendida temporalmente');
            }
        }
    } catch (error) {
        console.error('❌ Error de red:', error.message);
    }

    // Test 3: Verificar con modelo alternativo
    console.log('\n🔍 Probando con modelo alternativo (gemini-1.5-flash)...');
    try {
        const altResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: 'Test' }]
                    }]
                })
            }
        );
        
        const altData = await altResponse.json();
        
        if (altResponse.ok) {
            console.log('✅ Modelo alternativo funciona');
        } else {
            console.log('❌ Modelo alternativo también falla:', altResponse.status);
        }
    } catch (error) {
        console.error('❌ Error con modelo alternativo:', error.message);
    }
}

testGeminiAPI().catch(console.error);