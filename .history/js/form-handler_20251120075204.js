/**
 * Manejador del Formulario de Cotización - Grupo Musical La Célula
 * Envía solicitudes de cotización por email y redirige a WhatsApp
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.cotizador-form');
    if (form) {
        let isSubmitting = false;

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (isSubmitting) {
                console.log('Formulario ya está siendo procesado...');
                return;
            }

            isSubmitting = true;
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.textContent : '';
            
            try {
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Enviando...';
                }

                const formData = new FormData(this);
                const data = Object.fromEntries(formData);

                if (!data.nombre || !data.email || !data.telefono || !data.evento || !data.fecha || !data.ubicacion || !data.invitados) {
                    throw new Error('Por favor completa todos los campos requeridos');
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    throw new Error('Por favor ingresa un email válido');
                }

                const phoneDigits = data.telefono.replace(/\D/g, '');
                if (phoneDigits.length !== 10) {
                    throw new Error('El teléfono debe tener 10 dígitos');
                }

                const eventDate = new Date(data.fecha);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (eventDate < today) {
                    throw new Error('La fecha del evento debe ser futura');
                }

                const guestCount = parseInt(data.invitados);
                if (isNaN(guestCount) || guestCount < 1 || guestCount > 1000) {
                    throw new Error('El número de invitados debe estar entre 1 y 1000');
                }

                const emailData = {
                    type: 'form_cotizador',
                    formData: {
                        nombre: data.nombre.trim(),
                        email: data.email.trim(),
                        telefono: phoneDigits,
                        tipoEvento: data.evento.trim(),
                        fechaEvento: data.fecha,
                        lugar: data.ubicacion.trim(),
                        numeroInvitados: guestCount,
                        paquete: 'Por definir',
                        mensaje: data.comentarios ? data.comentarios.trim() : ''
                    }
                };

                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(emailData)
                });

                const result = await response.json();

                if (result.success) {
                    console.log('✅ Cotización enviada por email exitosamente');
                    showNotification('✅ Tu solicitud ha sido enviada. Te contactaremos pronto.', 'success');
                } else {
                    console.warn('No se pudo enviar el email:', result.error);
                    showNotification(`⚠️ ${result.error || 'No se pudo enviar el email'}. Te redirigiremos a WhatsApp.`, 'warning');
                }

                const mensaje = `Hola, me interesa cotizar mi evento:\n\n🎵 *Cotización de Evento Musical*\n👤 *Nombre:* ${data.nombre}\n📞 *Teléfono:* ${data.telefono}\n📧 *Email:* ${data.email}\n🎉 *Tipo de evento:* ${data.evento}\n📅 *Fecha:* ${new Date(data.fecha).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n📍 *Ubicación:* ${data.ubicacion}\n👥 *Invitados:* ${data.invitados} personas\n💬 *Comentarios:* ${data.comentarios || 'Ninguno'}\n\n¡Espero su respuesta!`;

                await new Promise(resolve => setTimeout(resolve, 1500));

                const whatsappUrl = `https://wa.me/525535412631?text=${encodeURIComponent(mensaje)}`;
                window.open(whatsappUrl, '_blank');
                this.reset();

                setTimeout(() => {
                    showNotification('📱 Te hemos redirigido a WhatsApp para atención inmediata.', 'info');
                }, 2000);

            } catch (error) {
                console.error('Error al procesar el formulario:', error);
                showNotification(`❌ ${error.message}. Por favor intenta de nuevo.`, 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
                isSubmitting = false;
            }
        });

        // Validaciones en tiempo real
        const emailInput = form.querySelector('input[name="email"]');
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (this.value && !emailRegex.test(this.value)) {
                    this.setCustomValidity('Por favor ingresa un email válido');
                    this.reportValidity();
                } else {
                    this.setCustomValidity('');
                }
            });
        }

        const phoneInput = form.querySelector('input[name="telefono"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                this.value = this.value.replace(/[^\d]/g, '');
                if (this.value.length > 10) {
                    this.value = this.value.slice(0, 10);
                }
            });
        }
    }

    console.log('✅ Cotizador cargado correctamente');
});

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `form-notification form-notification-${type}`;
    
    const styles = {
        success: 'background: #d4edda; color: #155724; border-left: 4px solid #28a745;',
        error: 'background: #f8d7da; color: #721c24; border-left: 4px solid #dc3545;',
        warning: 'background: #fff3cd; color: #856404; border-left: 4px solid #ffc107;',
        info: 'background: #d1ecf1; color: #0c5460; border-left: 4px solid #17a2b8;'
    };
    
    notification.style.cssText = `
        ${styles[type]}
        padding: 15px 20px;
        margin: 20px 0;
        border-radius: 5px;
        font-size: 14px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    `;
    
    notification.textContent = message;
    
    const form = document.querySelector('.cotizador-form');
    if (form) {
        document.querySelectorAll('.form-notification').forEach(n => n.remove());
        form.parentNode.insertBefore(notification, form);
        setTimeout(() => notification.remove(), 5000);
    }
}
