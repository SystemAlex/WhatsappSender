# Historial de Cambios

Todos los cambios notables a este proyecto se documentarán en este archivo.

## [1.1.0] - 2026-04-26

### Agregado

- Nuevos componentes React:
  - `ContactFormDialog`: Diálogo para agregar/editar contactos con validación de números
  - `ExtensionStatus`: Indicador de estado de la extensión y conexión del bridge
  - `InstructionalGuide`: Guía interactiva de uso rápido con collapse en móvil
  - `ProcessingStatus`: Indicador visual del estado de procesamiento y countdown
- Nuevo hook `useWhatsAppBridge`: Gestión de comunicación con WhatsApp Web y procesamiento automático
- Nuevo hook `useWhatsAppState`: Gestión centralizada de estado (mensajes, contactos, adjuntos)
- Nuevos assets de iconos en múltiples formatos (PNG, WEBP, SVG)
- Favicon en 512x512 para web app manifest

### Mejorado

- Arquitectura de componentes más modular
- Mejor separación de responsabilidades con hooks personalizados
- Mejora en experiencia de usuario con indicadores visuales
- Gestión de estado con localStorage e IndexedDB
- Soporte para Chrome Runtime API y comunicación con extensión

## [1.0.54] - 2026-04-25

### Agregado

- Información completa de autor en manifest.json
- Sección de soporte y FAQ en README
- Requerimientos técnicos actualizados
- Tabla de información de versión
- Información de compatibilidad mejorada

### Mejorado

- Documentación completa del proyecto
- Instrucciones de instalación claras
- Warnings de términos de servicio más detalladas

## [1.0.53] - 2026-04-20

### Corregido

- Mejoras en la gestión de contactos
- Optimización de velocidad de envío

## [1.0.50] - 2026-04-10

### Agregado

- Nuevo interfaz de usuario
- Soporte para Chrome Manifest V3
- Mejoras en la privacidad de datos

## [1.0.0] - 2026-01-15

### Agregado

- Versión inicial de WhatsApp Sender
- Funcionalidad básica de envío de mensajes
- Gestión de contactos
- Integración con WhatsApp Web

---

## Notas de Actualización

### Cómo Actualizar

1. Ve a `chrome://extensions/`
2. Busca "WhatsApp Sender"
3. La extensión se actualizará automáticamente si tienes habilitadas las actualizaciones automáticas
4. Si quieres actualizar manualmente, descarga la última versión y carga la carpeta `dist/`

### Compatibilidad Hacia Atrás

Las versiones recientes mantienen compatibilidad con configuraciones anteriores. No hay cambios que rompan la funcionalidad.

---

**Última actualización**: Abril 2026
