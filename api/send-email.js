import { Resend } from 'resend';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, leadData, conversationData, formData } = req.body;

    const resendApiKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL;

    if (!resendApiKey || !contactEmail) {
      console.error('Missing environment variables');
      return res.status(500).json({ error: 'Configuration error' });
    }

    const resend = new Resend(resendApiKey);
    let emailData;

    switch (type) {
      case 'chatbot_summary':
        // Validate conversation data exists
        const hasConversation = conversationData?.full_conversation && conversationData.full_conversation.trim().length > 0;
        const conversationHtml = hasConversation 
          ? conversationData.full_conversation
              .split('\n\n')
              .map(line => {
                if (line.startsWith('Cliente:')) {
                  return `<p style="margin: 10px 0;"><strong style="color: #2563eb;">Cliente:</strong> ${line.replace('Cliente:', '').trim()}</p>`;
                } else if (line.startsWith('Asistente:')) {
                  return `<p style="margin: 10px 0;"><strong style="color: #059669;">Asistente:</strong> ${line.replace('Asistente:', '').trim()}</p>`;
                }
                return line ? `<p style="margin: 10px 0;">${line}</p>` : '';
              })
              .join('')
          : '<p style="color: #dc2626;">No se registró conversación</p>';

        emailData = {
          from: 'Chatbot La Célula <onboarding@resend.dev>',
          to: contactEmail,
          subject: '📊 Resumen de Conversación - Chatbot',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Resumen de Conversación con Cliente</h2>
              
              <h3 style="color: #374151; margin-top: 20px;">📋 Información del Lead:</h3>
              <ul style="background: #f9fafb; padding: 15px; border-radius: 5px; list-style: none;">
                <li style="margin: 8px 0;"><strong>Nombre:</strong> ${leadData?.name || 'No proporcionado'}</li>
                <li style="margin: 8px 0;"><strong>Email:</strong> ${leadData?.email || 'No proporcionado'}</li>
                <li style="margin: 8px 0;"><strong>Teléfono:</strong> ${leadData?.phone || 'No proporcionado'}</li>
                <li style="margin: 8px 0;"><strong>Tipo de Evento:</strong> ${leadData?.eventType || 'No especificado'}</li>
              </ul>

              <h3 style="color: #374151; margin-top: 20px;">💬 Conversación (${conversationData?.conversation_length || 0} mensajes):</h3>
              <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; border-left: 4px solid #3b82f6;">
                ${conversationHtml}
              </div>

              <div style="margin-top: 20px; padding: 10px; background: #eff6ff; border-radius: 5px; font-size: 12px; color: #1e40af;">
                <strong>📅 Sesión iniciada:</strong> ${conversationData?.session_start ? new Date(conversationData.session_start).toLocaleString('es-MX') : 'No disponible'}
              </div>
            </div>
          `
        };
        break;

      case 'chatbot_lead':
        emailData = {
          from: 'Chatbot La Célula <onboarding@resend.dev>',
          to: contactEmail,
          subject: '🎯 Nuevo Lead Capturado - Chatbot',
          html: `
            <h2>Nuevo Lead desde el Chatbot</h2>
            <ul>
              <li><strong>Nombre:</strong> ${leadData.name}</li>
              <li><strong>Email:</strong> ${leadData.email}</li>
              <li><strong>Teléfono:</strong> ${leadData.phone}</li>
              <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-MX')}</li>
            </ul>
            <p><em>Este cliente inició una conversación en el chatbot.</em></p>
          `
        };
        break;

      case 'form_cotizador':
        emailData = {
          from: 'Formulario La Célula <onboarding@resend.dev>',
          to: contactEmail,
          subject: '💰 Nueva Solicitud de Cotización',
          html: `
            <h2>Solicitud de Cotización</h2>
            <h3>Datos del Cliente:</h3>
            <ul>
              <li><strong>Nombre:</strong> ${formData.nombre}</li>
              <li><strong>Email:</strong> ${formData.email}</li>
              <li><strong>Teléfono:</strong> ${formData.telefono}</li>
            </ul>
            <h3>Detalles del Evento:</h3>
            <ul>
              <li><strong>Tipo de Evento:</strong> ${formData.tipoEvento}</li>
              <li><strong>Fecha:</strong> ${formData.fecha}</li>
              <li><strong>Ubicación:</strong> ${formData.ubicacion}</li>
              <li><strong>Número de Invitados:</strong> ${formData.invitados}</li>
              <li><strong>Duración:</strong> ${formData.duracion}</li>
            </ul>
            ${formData.mensaje ? `<h3>Mensaje:</h3><p>${formData.mensaje}</p>` : ''}
          `
        };
        break;

      default:
        return res.status(400).json({ error: 'Invalid email type' });
    }

    const result = await resend.emails.send(emailData);

    return res.status(200).json({ 
      success: true, 
      emailId: result.data?.id 
    });

  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ 
      error: 'Failed to send email',
      message: error.message 
    });
  }
}
