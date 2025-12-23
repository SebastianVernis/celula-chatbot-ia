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

    // Validar configuración de Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL;

    if (!resendApiKey || !contactEmail) {
      console.error('Missing RESEND_API_KEY or CONTACT_EMAIL environment variables');
      return res.status(500).json({ 
        error: 'Email configuration error',
        message: 'Missing required environment variables'
      });
    }

    // Inicializar Resend
    const resend = new Resend(resendApiKey);

    let emailData;

    switch (type) {
      case 'chatbot_summary': {
        // Validar que exista conversación
        const hasConversation = conversationData?.full_conversation && 
                               conversationData.full_conversation.trim().length > 0;
        
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
          subject: '📊 Resumen de Conversación - Chatbot La Célula',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🎵 Grupo Musical La Célula</h1>
                <p style="color: #f0f0f0; margin: 10px 0 0 0;">Resumen de Conversación con Cliente</p>
              </div>
              
              <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
                <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 0;">📋 Información del Lead</h2>
                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Nombre:</td>
                      <td style="padding: 8px 0; color: #111827;">${leadData?.name || 'No proporcionado'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Email:</td>
                      <td style="padding: 8px 0; color: #111827;">${leadData?.email || 'No proporcionado'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Teléfono:</td>
                      <td style="padding: 8px 0; color: #111827;">${leadData?.phone || 'No proporcionado'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Tipo de Evento:</td>
                      <td style="padding: 8px 0; color: #111827;">${leadData?.eventType || 'No especificado'}</td>
                    </tr>
                  </table>
                </div>

                <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 30px;">💬 Conversación Completa</h2>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                  <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px;">
                    <strong>Total de mensajes:</strong> ${conversationData?.conversation_length || 0}
                  </p>
                  ${conversationHtml}
                </div>

                <div style="margin-top: 30px; padding: 15px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
                  <p style="margin: 0; font-size: 14px; color: #1e40af;">
                    <strong>📅 Sesión iniciada:</strong> ${conversationData?.session_start ? new Date(conversationData.session_start).toLocaleString('es-MX', { dateStyle: 'full', timeStyle: 'short' }) : 'No disponible'}
                  </p>
                </div>
              </div>

              <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
                <p style="margin: 0; color: #6b7280; font-size: 12px;">
                  Este correo fue generado automáticamente por el sistema de chatbot de La Célula
                </p>
              </div>
            </div>
          `
        };
        break;
      }

      case 'chatbot_lead': {
        emailData = {
          from: 'Chatbot La Célula <onboarding@resend.dev>',
          to: contactEmail,
          subject: '🎯 Nuevo Lead Capturado - Chatbot La Célula',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🎵 Nuevo Lead Capturado</h1>
                <p style="color: #f0f0f0; margin: 10px 0 0 0;">Un cliente ha iniciado conversación en el chatbot</p>
              </div>
              
              <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
                <h2 style="color: #1f2937; margin-top: 0;">📋 Datos del Cliente</h2>
                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Nombre:</td>
                      <td style="padding: 8px 0; color: #111827;">${leadData.name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Email:</td>
                      <td style="padding: 8px 0; color: #111827;">${leadData.email}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Teléfono:</td>
                      <td style="padding: 8px 0; color: #111827;">${leadData.phone}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Tipo de Evento:</td>
                      <td style="padding: 8px 0; color: #111827;">${leadData.eventType || 'No especificado'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Fecha:</td>
                      <td style="padding: 8px 0; color: #111827;">${new Date().toLocaleString('es-MX', { dateStyle: 'full', timeStyle: 'short' })}</td>
                    </tr>
                  </table>
                </div>

                <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-top: 20px;">
                  <p style="margin: 0; color: #92400e; font-size: 14px;">
                    ⚡ <strong>Acción requerida:</strong> Este cliente está esperando información. Responde lo antes posible para no perder la oportunidad.
                  </p>
                </div>
              </div>

              <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
                <p style="margin: 0; color: #6b7280; font-size: 12px;">
                  Este correo fue generado automáticamente por el sistema de chatbot de La Célula
                </p>
              </div>
            </div>
          `
        };
        break;
      }

      case 'form_cotizador': {
        emailData = {
          from: 'Formulario La Célula <onboarding@resend.dev>',
          to: contactEmail,
          subject: '💰 Nueva Solicitud de Cotización - La Célula',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">💰 Nueva Cotización</h1>
                <p style="color: #f0f0f0; margin: 10px 0 0 0;">Solicitud desde el formulario web</p>
              </div>
              
              <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
                <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 0;">👤 Datos del Cliente</h2>
                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Nombre:</td>
                      <td style="padding: 8px 0; color: #111827;">${formData.nombre}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Email:</td>
                      <td style="padding: 8px 0; color: #111827;">${formData.email}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Teléfono:</td>
                      <td style="padding: 8px 0; color: #111827;">${formData.telefono}</td>
                    </tr>
                  </table>
                </div>

                <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 30px;">🎉 Detalles del Evento</h2>
                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Tipo de Evento:</td>
                      <td style="padding: 8px 0; color: #111827;">${formData.tipoEvento}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Fecha:</td>
                      <td style="padding: 8px 0; color: #111827;">${formData.fecha}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Ubicación:</td>
                      <td style="padding: 8px 0; color: #111827;">${formData.ubicacion}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Número de Invitados:</td>
                      <td style="padding: 8px 0; color: #111827;">${formData.invitados}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Duración:</td>
                      <td style="padding: 8px 0; color: #111827;">${formData.duracion}</td>
                    </tr>
                  </table>
                </div>

                ${formData.mensaje ? `
                  <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 30px;">💬 Mensaje del Cliente</h2>
                  <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                    <p style="margin: 0; color: #374151; line-height: 1.6;">${formData.mensaje}</p>
                  </div>
                ` : ''}

                <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-top: 20px;">
                  <p style="margin: 0; color: #92400e; font-size: 14px;">
                    ⚡ <strong>Acción requerida:</strong> Responde a esta solicitud lo antes posible para cerrar la venta.
                  </p>
                </div>
              </div>

              <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
                <p style="margin: 0; color: #6b7280; font-size: 12px;">
                  Este correo fue generado automáticamente desde el formulario de cotización de La Célula
                </p>
              </div>
            </div>
          `
        };
        break;
      }

      default:
        return res.status(400).json({ 
          error: 'Invalid email type',
          message: `Type "${type}" is not supported. Valid types: chatbot_summary, chatbot_lead, form_cotizador`
        });
    }

    // Enviar email con Resend
    const result = await resend.emails.send(emailData);

    if (result.error) {
      console.error('Resend API error:', result.error);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to send email',
        message: result.error.message 
      });
    }

    console.log('Email sent successfully:', result.data?.id);
    
    return res.status(200).json({ 
      success: true,
      emailId: result.data?.id,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Email handler error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to send email',
      message: error.message 
    });
  }
}
