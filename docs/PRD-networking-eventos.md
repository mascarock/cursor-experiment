# Product Requirements Document (PRD)
# Aplicación de Networking para Eventos de Tecnología

**Versión:** 1.0  
**Fecha:** 11 de febrero de 2025  
**Estado:** Borrador

---

## 1. Resumen ejecutivo

### 1.1 Visión del producto
Una aplicación que facilita el networking en eventos de tecnología permitiendo que los asistentes describan su perfil profesional, sus intereses y reciban recomendaciones de personas con las que vale la pena conectar, con la posibilidad de iniciar conversaciones directamente desde la app.

### 1.2 Problema que resuelve
- En eventos tech es difícil identificar rápidamente a quién conviene acercarse.
- Las presentaciones breves (“elevator pitch”) son repetitivas y no escalan.
- No hay un canal claro para seguir la conversación después del evento.
- La información de LinkedIn está dispersa y no está contextualizada al evento.

### 1.3 Propuesta de valor
- **Para asistentes:** Perfil claro y recomendaciones personalizadas de personas relevantes; mensajería integrada para conectar sin depender de LinkedIn o email.
- **Para organizadores:** Mayor engagement y satisfacción del evento; datos agregados sobre perfiles e intereses para futuras ediciones.

---

## 2. Usuarios y contexto

### 2.1 Usuario principal
- **Perfil:** Profesionales de tecnología que asisten a eventos (conferencias, meetups, hackathons).
- **Objetivo:** Conocer a personas afines (mismo stack, mismo tipo de rol, intereses complementarios).
- **Dolor:** No saber por dónde empezar o perder tiempo con conexiones poco relevantes.

### 2.2 Usuario secundario
- **Organizador del evento:** Quiere que los asistentes generen más valor entre sí y que el evento sea recordado.

### 2.3 Contexto de uso
- Antes del evento: completar o actualizar perfil.
- Durante el evento: consultar recomendaciones y enviar mensajes.
- Después del evento: seguir conversaciones iniciadas en la app.

---

## 3. Alcance y fases

### Fase 1 — MVP (Core)
Enfocada en perfil y descubrimiento sin dependencias externas pesadas.

### Fase 2 — Integración y enriquecimiento
LinkedIn y LLM para mejorar el perfil y las recomendaciones.

### Fase 3 — Crecimiento y engagement
Mensajería, notificaciones y métricas para organizadores.

---

## 4. Requisitos funcionales

### 4.1 Perfil del usuario (Fase 1)

#### FR-1.1 Formulario de perfil simple e intuitivo
- **Descripción:** Un único formulario (o flujo corto de pasos) donde el usuario indica “a qué se dedica” y sus intereses.
- **Campos sugeridos (mínimo):**
  - **A qué me dedico:** texto libre (1–3 oraciones) + opción de campos estructurados opcionales (rol, empresa, tecnologías).
  - **Intereses:** tags o texto libre (ej.: “ML”, “startups”, “contratación”, “open source”).
  - **En qué busco conectar:** opcional (ej.: “cofundadores”, “clientes”, “mentores”).
- **Criterios de aceptación:**
  - Formulario accesible y usable en móvil y desktop.
  - Validación mínima (longitud, caracteres permitidos).
  - Posibilidad de guardar borrador y editar después.
  - El usuario puede agregar **su propia información** en la descripción (no limitado a opciones predefinidas).

#### FR-1.2 Visualización del propio perfil
- El usuario puede ver cómo se muestra su perfil a otros (vista previa “pública”).

#### FR-1.3 Edición y actualización
- Editar perfil en cualquier momento; cambios reflejados de inmediato en recomendaciones.

---

### 4.2 Enriquecimiento del perfil (Fase 2)

#### FR-2.1 Conexión con LinkedIn (futuro)
- **Descripción:** Opción de conectar cuenta de LinkedIn para **extraer** información del perfil (cargo, empresa, resumen, habilidades).
- **Comportamiento esperado:**
  - Flujo OAuth seguro (LinkedIn como proveedor).
  - Importación de campos seleccionados (no sobrescribir todo: el usuario elige qué usar).
  - La descripción escrita en la app sigue siendo editable; la info de LinkedIn se usa como base o sugerencia.
- **Criterios de aceptación:**
  - Consentimiento explícito y transparencia sobre qué datos se leen.
  - Cumplimiento de políticas de LinkedIn (API, uso de datos).
  - Manejo de errores (cuenta no conectada, token expirado).

#### FR-2.2 Expansión de descripción con LLM
- **Descripción:** Después de que el usuario escribe una descripción breve, puede pedir a la aplicación que **expanda** o mejore el texto mediante una llamada a un LLM.
- **Comportamiento esperado:**
  - Botón o acción tipo “Expandir con IA” / “Mejorar descripción”.
  - El LLM recibe el texto actual y devuelve una versión más elaborada (manteniendo tono profesional y hechos).
  - El usuario puede aceptar, rechazar o editar la propuesta antes de guardar.
- **Criterios de aceptación:**
  - Respuesta en tiempo razonable (< 5–10 s).
  - No inventar datos que el usuario no haya indicado.
  - Opcional: no obligatorio para usar la app.
  - Considerar coste por llamada y límites de uso si aplica.

---

### 4.3 Recomendaciones y conexión (Fase 1 + 3)

#### FR-3.1 Recomendación de personas
- **Descripción:** El usuario puede **pedir a la aplicación** que le recomiende personas con las que conectar (ej.: “Recomiéndame personas”, “Quién podría interesarme”).
- **Comportamiento esperado:**
  - Lista o tarjetas de perfiles recomendados según: descripción, intereses, rol, contexto del evento.
  - Criterios de matching definidos (similitud de intereses, complementariedad, diversidad).
  - Ordenación por relevancia; posibilidad de filtrar (ej.: por rol, por tecnología).
- **Criterios de aceptación:**
  - Solo se muestran usuarios que hayan completado perfil y aceptado ser visibles en el evento.
  - Explicación breve opcional del porqué de la recomendación (“Intereses en común: ML, startups”).

#### FR-3.2 Envío de mensaje
- **Descripción:** Desde la ficha de una persona recomendada (o desde la lista), el usuario puede **enviarle un mensaje**.
- **Comportamiento esperado:**
  - Flujo: elegir destinatario → redactar mensaje (con o sin plantillas) → enviar.
  - El destinatario recibe notificación (in-app y/o email según configuración).
  - Historial de conversaciones (hilos por contacto).
- **Criterios de aceptación:**
  - Límites anti-spam (ej.: máx. mensajes por día a desconocidos).
  - Opción de “no recibir mensajes” o solo de organizadores.
  - Mensajes solo entre usuarios del mismo evento (o regla clara de visibilidad).

---

## 5. Requisitos no funcionales

### 5.1 Usabilidad
- Formulario de perfil completable en **menos de 2 minutos** (sin LLM ni LinkedIn).
- Lenguaje claro, sin jerga técnica innecesaria en labels e instrucciones.
- Diseño responsive; uso principal esperado en móvil durante el evento.

### 5.2 Rendimiento
- Carga inicial de la app < 3 s en conexión 4G.
- Recomendaciones generadas en < 5 s (con algoritmo en backend; si se usa LLM para ranking, definir SLA).

### 5.3 Seguridad y privacidad
- Datos de perfil visibles solo en el contexto del evento (o según preferencia del usuario).
- No compartir email/telefono sin consentimiento; mensajería in-app primero.
- Cumplimiento de GDPR/CCPA según audiencia (consent, derecho de supresión, portabilidad).
- LinkedIn: almacenar solo tokens necesarios; no guardar copias completas del perfil sin base legal clara.

### 5.4 Escalabilidad
- Arquitectura que permita múltiples eventos (multi-tenant por evento o por organización).
- Recomendaciones calculables con un volumen de cientos a miles de asistentes por evento.

### 5.5 Disponibilidad
- Objetivo de disponibilidad 99 % durante fechas críticas del evento (pre-evento, día del evento, 24 h después).

---

## 6. Supuestos y dependencias

### Supuestos
- Los asistentes están dispuestos a dedicar 1–2 minutos a completar el perfil si el valor (recomendaciones y mensajes) es claro.
- Los organizadores pueden proporcionar una lista de participantes (emails o enlace de registro) para dar de alta el “evento” en la app.
- El uso de LLM para expandir descripción se considera un diferenciador, no un bloqueante para el MVP.

### Dependencias
- **LinkedIn:** API y políticas actuales de LinkedIn (OAuth 2.0, campos disponibles); posibles costes según uso.
- **LLM:** Proveedor elegido (OpenAI, Anthropic, etc.), coste por solicitud y límites de rate.
- **Evento:** Definición de “evento” en el sistema (una instancia con fecha, nombre, lista de participantes o enlace de registro).

---

## 7. Restricciones y exclusiones (fuera de alcance v1)

- **Fuera de alcance inicial:**  
  - Calendario de charlas y agenda del evento (integrar después si aplica).  
  - Gamificación (badges, puntos) en la primera versión.  
  - App nativa (MVP como web responsive o PWA).  
- **Restricciones:**  
  - No reemplazar LinkedIn; complementar (perfil ligero + mensajería in-app).  
  - No usar datos de perfil para publicidad sin consentimiento explícito.

---

## 8. Métricas de éxito

### 8.1 MVP (Fase 1)
- **Adopción:** % de asistentes registrados que completan el perfil (objetivo ej.: > 40 %).
- **Engagement:** % de usuarios que abren la lista de recomendaciones al menos una vez (objetivo ej.: > 50 % de quienes completan perfil).
- **Satisfacción:** NPS o encuesta corta post-evento (“¿encontraste personas relevantes?”).

### 8.2 Fase 2
- Uso de “Expandir con IA” (número de veces usado y % de veces que el usuario guarda la sugerencia).
- % de perfiles enriquecidos con LinkedIn entre los que tienen la opción disponible.

### 8.3 Fase 3
- Número de mensajes enviados por evento y ratio de respuestas.
- Retención: % de usuarios que vuelven a abrir la app después del evento (seguimiento de conversaciones).

---

## 9. Riesgos y mitigación

| Riesgo | Impacto | Mitigación |
|--------|--------|------------|
| Baja adopción del formulario | Alto | Onboarding muy corto; valor claro en primera pantalla; recordatorios pre-evento |
| API de LinkedIn restrictiva o costosa | Medio | MVP sin LinkedIn; diseño de perfil que funcione bien solo con datos manuales + LLM |
| Recomendaciones poco relevantes | Alto | Empezar con reglas simples (matching por tags/intereses); iterar con feedback e incorporar LLM en Fase 2 si hace falta |
| Spam en mensajería | Medio | Límites por usuario, reportar/bloquear, opción de desactivar mensajes |

---

## 10. Resumen de features por fase

| Feature | Fase | Prioridad |
|--------|------|------------|
| Formulario simple “a qué te dedicas” + intereses (con info propia) | 1 | P0 |
| Ver y editar mi perfil | 1 | P0 |
| Pedir recomendaciones de personas | 1 | P0 |
| Enviar mensaje a persona recomendada | 1 o 3 | P0 |
| Expandir descripción con LLM | 2 | P1 |
| Conexión con LinkedIn para extraer perfil | 2 | P1 |
| Notificaciones y historial de conversaciones | 3 | P1 |
| Filtros y explicación de recomendaciones | 1–2 | P2 |

---

## 11. Próximos pasos sugeridos

1. **Validar** con 1–2 organizadores de eventos y 5–10 asistentes tipo: ¿completarían el formulario? ¿qué campos añadirían o quitarían?
2. **Definir** modelo de datos mínimo: Usuario, Evento, Perfil (descripción, intereses), Mensaje, Recomendación (cache o en tiempo real).
3. **Diseñar** wireframes del flujo: registro/entrada al evento → formulario de perfil → pantalla de recomendaciones → envío de mensaje.
4. **Elegir** stack (frontend, backend, BD, hosting) y plan de implementación por sprints según las fases anteriores.
5. **Documentar** criterios de matching para recomendaciones (v1 sin LLM) y después enriquecer con LLM si se incluye en Fase 2.

---

*Documento vivo: se actualizará según decisiones de producto y feedback de stakeholders.*
