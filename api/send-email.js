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
        emailData = {
          from: 'Chatbot La Célula <onboarding@resend.dev>',
          to: contactEmail,
          subject: '📊 Resumen de Conversación - Chatbot',
          html: `
            <h2>Resumen de Conversación con Cliente</h2>
            <h3>Información del Lead:</h3>
            <ul>
              <li><strong>Nombre:</strong> ${conversationData.leadData?.name || 'No proporcionado'}</li>
              <li><strong>Email:</strong> ${conversationData.leadData?.email || 'No proporcionado'}</li>
              <li><strong>Teléfono:</strong> ${conversationData.leadData?.phone || 'No proporcionado'}</li>
            </ul>
            <h3>Conversación:</h3>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
              ${conversationData.messages.map(msg => `
                <p><strong>${msg.role === 'user' ? 'Cliente' : 'Bot'}:</strong> ${msg.text}</p>
              `).join('')}
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
