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
    const { nombre, telefono, fecha, comentarios, campaignTitle, campaignName } = req.body;

    // Validar datos requeridos
    if (!nombre || !telefono || !fecha) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'nombre, telefono y fecha son requeridos'
      });
    }

    // Configuración para el primer destino (La Célula)
    const resendApiKey1 = process.env.RESEND_API_KEY_1;
    const contactEmail1 = process.env.CONTACT_EMAIL_1;

    // Configuración para el segundo destino
    const resendApiKey2 = process.env.RESEND_API_KEY_2;
    const contactEmail2 = process.env.CONTACT_EMAIL_2;

    // Validar que al menos una configuración esté completa
    const hasConfig1 = resendApiKey1 && contactEmail1;
    const hasConfig2 = resendApiKey2 && contactEmail2;

    if (!hasConfig1 && !hasConfig2) {
      console.error('Missing environment variables for both configurations');
      return res.status(500).json({ 
        error: 'Email configuration error',
        message: 'At least one complete email configuration is required'
      });
    }

    // Formatear fecha legible
    const formattedDate = new Date(fecha).toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Crear contenido del email
    const emailData = {
      from: 'Marketing La Célula <onboarding@resend.dev>',
      subject: `🎉 Nueva Solicitud - ${campaignTitle || 'Campaña Marketing'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎵 ${campaignTitle || 'Nueva Solicitud'}</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">Solicitud desde campaña de marketing</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 0;">👤 Datos del Cliente</h2>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Nombre:</td>
                  <td style="padding: 8px 0; color: #111827;">${nombre}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Teléfono:</td>
                  <td style="padding: 8px 0; color: #111827;">${telefono}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Tipo de Evento:</td>
                  <td style="padding: 8px 0; color: #111827;">${campaignName || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Fecha del Evento:</td>
                  <td style="padding: 8px 0; color: #111827;">${formattedDate}</td>
                </tr>
                ${comentarios ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Comentarios:</td>
                  <td style="padding: 8px 0; color: #111827;">${comentarios}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Campaña:</td>
                  <td style="padding: 8px 0; color: #111827;">${campaignTitle || 'General'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Fecha de solicitud:</td>
                  <td style="padding: 8px 0; color: #111827;">${new Date().toLocaleString('es-MX', { dateStyle: 'full', timeStyle: 'short' })}</td>
                </tr>
              </table>
            </div>

            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-top: 20px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                ⚡ <strong>Acción requerida:</strong> Cliente interesado en cotización con descuento especial. Contactar lo antes posible.
              </p>
            </div>
          </div>

          <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="margin: 0; color: #6b7280; font-size: 12px;">
              Este correo fue generado automáticamente desde la campaña de marketing de La Célula
            </p>
          </div>
        </div>
      `
    };

    // Enviar a ambos destinos de forma paralela
    const sendPromises = [];

    if (hasConfig1) {
      const resend1 = new Resend(resendApiKey1);
      sendPromises.push(
        resend1.emails.send({ ...emailData, to: contactEmail1 })
          .then(result => ({ 
            success: true, 
            emailId: result.data?.id, 
            destination: 1,
            email: contactEmail1 
          }))
          .catch(error => ({ 
            success: false, 
            error: error.message, 
            destination: 1,
            email: contactEmail1 
          }))
      );
    }

    if (hasConfig2) {
      const resend2 = new Resend(resendApiKey2);
      sendPromises.push(
        resend2.emails.send({ ...emailData, to: contactEmail2 })
          .then(result => ({ 
            success: true, 
            emailId: result.data?.id, 
            destination: 2,
            email: contactEmail2 
          }))
          .catch(error => ({ 
            success: false, 
            error: error.message, 
            destination: 2,
            email: contactEmail2 
          }))
      );
    }

    const sendResults = await Promise.all(sendPromises);

    // Verificar si al menos uno fue exitoso
    const anySuccess = sendResults.some(r => r.success);
    const allSuccess = sendResults.every(r => r.success);

    console.log('Marketing form email send results:', sendResults);

    // Preparar evento GTM para tracking
    const gtmEvent = {
      event: 'marketing_form_submitted',
      formName: campaignName || 'general',
      campaignTitle: campaignTitle || 'General',
      eventDate: fecha,
      emailSuccess: anySuccess
    };

    return res.status(200).json({ 
      success: anySuccess,
      allSuccess,
      results: sendResults,
      gtmEvent,
      message: allSuccess 
        ? 'Emails enviados exitosamente' 
        : anySuccess 
          ? 'Algunos emails enviados exitosamente' 
          : 'Error al enviar emails'
    });

  } catch (error) {
    console.error('Marketing form handler error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to send email',
      message: error.message 
    });
  }
}
