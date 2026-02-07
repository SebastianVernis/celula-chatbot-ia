/**
 * Form Handling logic for Marketing campaign pages
 */

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('eventoForm');
    if (form) {
        let isSubmitting = false;

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (isSubmitting) return;

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

                // Basic validation
                if (!data.nombre || !data.telefono || !data.fecha) {
                    throw new Error('Por favor completa todos los campos requeridos');
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

                // Get campaign info from form data attributes
                const campaignTitle = this.getAttribute('data-campaign-title') || 'Campaña';
                const campaignName = this.getAttribute('data-campaign-name') || 'general';

                const formattedDate = new Date(data.fecha).toLocaleDateString('es-MX', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                // Enviar datos a la API para email
                try {
                    const apiResponse = await fetch('/api/send-form', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            nombre: data.nombre,
                            telefono: phoneDigits,
                            fecha: data.fecha,
                            comentarios: data.comentarios || '',
                            campaignTitle: campaignTitle,
                            campaignName: campaignName
                        })
                    });

                    const apiResult = await apiResponse.json();
                    
                    // Push GTM event si la API lo devuelve
                    if (apiResult.gtmEvent && window.dataLayer) {
                        window.dataLayer.push(apiResult.gtmEvent);
                    }
                } catch (apiError) {
                    console.error('Error al enviar email:', apiError);
                    // Continuar aunque falle el email
                }

                const mensaje = `Hola, me interesa cotizar mi evento con 10% de descuento:\n\n🎵 *Cotización de Evento Musical*\n👤 *Nombre:* ${data.nombre}\n📞 *Teléfono:* ${phoneDigits}\n🎉 *Tipo de evento:* ${campaignName}\n📅 *Fecha:* ${formattedDate}\n💬 *Comentarios:* ${data.comentarios || 'Ninguno'}\n\n¡Espero su respuesta!`;

                // Push event to GTM dataLayer - GTM handles all tracking
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: 'form_submission',
                    formName: campaignName,
                    eventDate: data.fecha,
                    formValue: 5.0
                });

                const whatsappUrl = `https://wa.me/525535412631?text=${encodeURIComponent(mensaje)}`;
                window.open(whatsappUrl, '_blank');
                this.reset();

            } catch (error) {
                alert(error.message);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
                isSubmitting = false;
            }
        });

        // Real-time phone validation
        const phoneInput = form.querySelector('input[name="telefono"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', function () {
                this.value = this.value.replace(/[^\d]/g, '');
                if (this.value.length > 10) {
                    this.value = this.value.slice(0, 10);
                }
            });
        }
    }
});
