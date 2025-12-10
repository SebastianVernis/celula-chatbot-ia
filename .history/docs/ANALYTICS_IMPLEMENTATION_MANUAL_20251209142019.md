
# Manual de Implementación y Gestión de Google Analytics (GA4)

Este manual documenta la instrumentación de eventos para los flujos de creación de leads en el Cotizador y el Chatbot del sitio. Incluye el catálogo de eventos, parámetros, puntos de disparo en el código y procedimientos de QA y mantenimiento.

## 1) Requisitos y etiqueta base

- GA4 ya está cargado con gtag.js en el `<head>` (por ejemplo, en cotizador.html):
  - ID de propiedad usado: G-VKRHM9YWLY
- No se requieren librerías adicionales.

## 2) Estándar de nomenclatura y parámetros

- Nombres de eventos: snake_case.
- Eventos de resultado: generate_lead (marcar como Conversión en GA4).
- Parámetros comunes en todos los eventos:
  - flow: 'cotizador' | 'chatbot'
  - step: open | start | select | update | summary | message | success | error
  - source: 'web'
  - page_location: location.href
  - page_referrer: document.referrer
  - Opcionales según contexto: lead_type, value, currency, contact_method, conversation_length, error_type, error_message

## 3) Catálogo de eventos Cotizador

Implementados en js/form-handler.js

- cotizador_open
  - Disparo: al detectar el formulario .cotizador-form en la página.
  - Params: step='open'

- cotizador_start
  - Disparo: primer intento de envío del formulario.
  - Params: step='start'

- cotizador_select_service
  - Disparo: al leer el campo "evento" durante el envío.
  - Params: step='select', service_name, lead_type

- cotizador_update_quote
  - Disparo: onChange de #evento, #fecha, #invitados, #ubicacion, #comentarios.
  - Params: step='update', attendees, date_selected

- cotizador_view_summary
  - Disparo: previo al POST del formulario (antes de enviar a backend).
  - Params: step='summary', value?, currency='MXN'

- generate_lead
  - Disparo: respuesta exitosa del backend (result.success === true).
  - Params: step='success', lead_type, contact_method='form', value?, currency='MXN', form_fields_filled

- cotizador_submit_error
  - Disparo: validación fallida, error de servidor o excepción.
  - Params: step='error', error_type ('validation'|'server'|'exception'), error_message

## 4) Catálogo de eventos Chatbot

Implementados en js/chatbot.js

- chatbot_open
  - Disparo: click en el botón flotante del chatbot.
  - Params: step='open', open_method='click'

- chatbot_start
  - Disparo: inicio del chat tras envío del formulario de contacto.
  - Params: step='start', first_intent? (usa eventType si existe)

- chatbot_request_contact
  - Disparo: submit del formulario inicial del chatbot.
  - Params: step='request_contact', requested_fields

- chatbot_collect_contact
  - Disparo: validación exitosa de nombre, email y teléfono.
  - Params: step='collect', collected_fields_count, contact_method='chatbot', lead_type?

- chatbot_intent_detected
  - Disparo: heurística local sobre el texto del usuario (cotizacion/disponibilidad/contacto).
  - Params: step='intent', intent_name, confidence

- chatbot_message_sent
  - Disparo: cada vez que el usuario envía un mensaje.
  - Params: step='message', conversation_length

- generate_lead
  - Disparo: envío OK a /api/send-email con type='chatbot_lead'.
  - Params: step='success', lead_type?, value?, currency='MXN', contact_method='chatbot', conversation_length, resolution='automated'

- chatbot_submit_error
  - Disparo: error de servidor o excepción en el envío.
  - Params: step='error', error_type ('server'|'exception'), error_message

## 5) Utilidades globales de tracking

- Cotizador: window.__gaLeadTrack(eventName, params)
- Chatbot: window.__gaChatTrack(eventName, params)

Ambas funciones envuelven gtag('event', ...), agregan parámetros comunes y son tolerantes a entornos donde gtag aún no está disponible (loguean en consola en ese caso).

## 6) Dónde está el código

- Cotizador (HTML + Form):
  - Página: cotizador.html
  - Lógica: js/form-handler.js (instrumentado)

- Chatbot:
  - Lógica UI/estado: js/chatbot.js (instrumentado)
  - Backend APIs: /api/* (envío de email)

## 7) QA y validación

- DebugView en GA4:
  1. Abre Chrome en modo normal.
  2. Entra a GA4 > Administrar > DebugView.
  3. Navega a /cotizador y realiza:
     - Abrir la página: ver cotizador_open.
     - Interactuar con campos: ver cotizador_update_quote.
     - Enviar form válido: ver cotizador_start, cotizador_view_summary y generate_lead.
     - Forzar errores (email inválido): ver cotizador_submit_error.
  4. Interactúa con el chatbot:
     - Click botón: ver chatbot_open.
     - Enviar formulario de contacto: ver chatbot_request_contact y chatbot_collect_contact.
     - Enviar mensajes con palabras clave: ver chatbot_intent_detected y chatbot_message_sent.
     - Confirmar generate_lead si API responde OK; si falla, ver chatbot_submit_error.

- Marcar conversión:
  - En GA4 > Configurar > Eventos: marca generate_lead como Conversión.

- Verificación de duplicidad:
  - generate_lead se emite una vez por envío exitoso; no debe duplicarse por recargas.

## 8) Buenas prácticas y mantenimiento

- No enviar PII en campos libres hacia GA (email/telefono solo en backend). Aquí se envían metadatos no sensibles.
- Registrar value/currency solo cuando exista un monto real.
- Mantener nombres y parámetros constantes.
- Ante nuevas variantes del flujo, extender con eventos nuevos manteniendo flow y step.
- Cualquier cambio en el formulario del cotizador o campos del chatbot: actualizar los parámetros en __gaLeadTrack/__gaChatTrack.

## 9) Troubleshooting

- No ves eventos: valida que gtag esté disponible (revisa consola). La función wrapper hará console.debug si gtag no existe.
- DebugView vacío: deshabilita bloqueadores, prueba en Chrome normal y verifica ID de medición.
- Excesivos eventos: reduce cotizador_update_quote si es necesario (debounce) o limita a eventos onBlur.

## 10) Cambios realizados

- js/form-handler.js: agregado wrapper GA y eventos cotizador_* + generate_lead.
- js/chatbot.js: agregado wrapper GA y eventos chatbot_* + generate_lead.
- Este documento: docs/ANALYTICS_IMPLEMENTATION_MANUAL.md.

## 11) Ejemplos de disparo manual (consola)

- gtag('event', 'generate_lead', { flow: 'cotizador', step: 'success' });
- window.__gaLeadTrack('cotizador_open', { step: 'open' });
- window.__gaChatTrack('chatbot_open', { step: 'open', open_method: 'click' });

Con esto queda instrumentada la medición de leads para cotizador y chatbot, y listo para QA en GA4 DebugView y activación de la conversión generate_lead.