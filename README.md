# <img src="icons/WhatsappSender.svg" alt="WhatsApp Sender Icon" width="32" height="32"> WhatsApp Sender

Extensión de navegador para Chrome y navegadores basados en Chromium que facilita la gestión y envío de mensajes por WhatsApp de forma eficiente y controlada.

### ⚠️ **Por favor, lee completamente las advertencias antes de usar esta extensión.**

---

## 📚 Documentación Adicional

- **[CHANGELOG.md](CHANGELOG.md)** - Historial de cambios y actualizaciones
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guía para contribuyentes

## 📋 Descripción

WhatsApp Sender es una extensión de navegador diseñada para facilitar la gestión de contactos y el envío de mensajes mediante WhatsApp Web. Proporciona una interfaz intuitiva y fácil de usar directamente en tu navegador para organizar contactos y comunicarte de manera más efectiva.

### 🌐 Compatibilidad

✅ **Navegadores soportados:**

- Google Chrome
- Microsoft Edge (basado en Chromium)
- Brave
- Opera
- Vivaldi
- Otros navegadores basados en Chromium

❌ **No soportado:**

- Firefox
- Safari
- Internet Explorer

## ⚠️ ADVERTENCIAS IMPORTANTES

### Cumplimiento Legal y de Términos de Servicio

**ANTES de usar esta extensión, debes entender completamente las siguientes restricciones y consecuencias:**

#### 1. **Violación de Términos de Servicio de WhatsApp**

- WhatsApp **prohíbe explícitamente** el envío masivo de mensajes sin consentimiento previo
- Usar herramientas de automatización como esta para enviar mensajes no solicitados viola directamente los [Términos de Servicio de WhatsApp](https://www.whatsapp.com/legal/terms-of-service)
- WhatsApp se reserva el derecho de suspender o eliminar tu cuenta permanentemente

#### 2. **Riesgos de Suspensión de Cuenta**

- **Suspensión Temporal**: Tu cuenta puede ser bloqueada temporalmente (24-72 horas) después de varios avisos
- **Suspensión Permanente**: El uso repetido resultará en la eliminación permanente de tu cuenta de WhatsApp
- **Pérdida de Datos**: Perderás acceso a todos tus chats, contactos y datos asociados
- **Bloqueo de Dispositivo**: Puede afectar otros servicios vinculados a tu número de teléfono

#### 3. **Responsabilidad Legal**

- **Leyes Anti-Spam**: En muchos países (UE, USA, etc.), enviar mensajes masivos sin consentimiento es ilegal bajo leyes de protección del consumidor
- **GDPR y Privacidad**: En la UE, esto viola la Regulación General de Protección de Datos
- **Demandas Civiles**: Los destinatarios pueden interponer acciones legales
- **Responsabilidad Penal**: En algunos casos, esto puede constituir acoso o delito cibernético

#### 4. **Impacto en Privacidad de Terceros**

- **Consentimiento Informado**: Debes tener consentimiento explícito de cada persona antes de enviarle mensajes
- **Revelación de Contactos**: Compartir listas de contactos sin consentimiento viola derechos de privacidad
- **Datos Personales**: Manejar datos de terceros trae responsabilidades legales serias

#### 5. **Sanciones Específicas de WhatsApp**

- Detección de patrones de envío masivo
- Detección de múltiples números usando la misma herramienta
- Cierre de acceso a WhatsApp Web
- Reporte a autoridades competentes

#### 6. **Uso Permitido**

Esta herramienta debe usarse ÚNICAMENTE para:

- ✅ Enviar mensajes personalizados a contactos conocidos
- ✅ Comunicación empresarial con clientes que han dado consentimiento
- ✅ Notificaciones a usuarios que han optado por recibirlas
- ✅ Propósitos de demostración en ambiente controlado

### 🚫 Lo que NO debes hacer

- ❌ Enviar mensajes de spam o promocionales masivos
- ❌ Usar sin consentimiento de los destinatarios
- ❌ Rescraping de números de teléfono
- ❌ Eludir mecanismos de seguridad de WhatsApp
- ❌ Usar múltiples cuentas para masificar
- ❌ Vender o compartir datos de contactos

## Descargo de Responsabilidad

**El desarrollador de esta extensión no se responsabiliza por:**

- Pérdida o suspensión de tu cuenta de WhatsApp
- Sanciones legales o multas impuestas
- Demandas civiles de terceros
- Violaciones de privacidad
- Cualquier daño resultante del uso de esta extensión

**Al usar esta extensión, aceptas explícitamente:**

- Cumplir con todos los términos de servicio de WhatsApp
- Respetar todas las leyes aplicables en tu jurisdicción
- Usar la extensión de manera responsable y ética
- Asumir toda la responsabilidad legal y civil

---

## ✨ Características

- 📱 Interfaz intuitiva y moderna
- 👥 Gestión completa de contactos
- 💬 Composición de mensajes personalizados
- 🎯 Envío controlado de mensajes
- 🔒 Respeto por la privacidad del usuario
- 🌐 Integración con WhatsApp Web

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Extensión del navegador**: Chrome Manifest V3
- **Runtime**: Content Scripts + Service Workers

## 📋 Requerimientos Técnicos

### Para Usar la Extensión

- **Sistema Operativo**: Windows, macOS, Linux
- **Navegador**: Chrome 88+ o compatible con Chromium
- **Conexión**: Internet (para acceder a WhatsApp Web)
- **Memoria**: Mínimo 512MB RAM disponible
- **Espacio**: Aproximadamente 15-20MB

### Para Desarrollar

- Node.js 16.0.0 o superior
- pnpm 7.0.0 o superior
- Git 2.0.0 o superior
- Navegador Chrome/Chromium para pruebas

## 📦 Instalación

### Para Usuarios Finales

1. Descarga `WhatsappSender.zip` desde [Releases](https://github.com/yourusername/WhatsappSender/releases)
2. Abre tu navegador basado en Chrome y ve a `chrome://extensions/`
3. Activa el **"Modo de desarrollador"** en la esquina superior derecha
4. Arrastra y suelta el archivo `WhatsappSender.zip` en la ventana de extensiones
5. ¡La extensión está lista para usar!

### Para Desarrolladores

Para instrucciones detalladas sobre cómo configurar el entorno, compilar la extensión y ejecutar en modo desarrollo, consulta la sección **"3. Enviar Pull Requests"** en [CONTRIBUTING.md](CONTRIBUTING.md).

Aquí está el resumen rápido:

```bash
git clone https://github.com/yourusername/WhatsappSender.git
cd WhatsappSender
pnpm install
pnpm dev
```

Luego carga la carpeta `dist/` en `chrome://extensions/` con el Modo de Desarrollador activado.

## 🚀 Uso

### Primer Uso

1. Instala la extensión en tu navegador Chrome
2. Ve a [WhatsApp Web](https://web.whatsapp.com) e inicia sesión con tu teléfono
3. Haz clic en el icono de la extensión en la barra de herramientas del navegador
4. Se abrirá el panel de control de WhatsApp Sender

### Workflow Básico

1. **Cargar Contactos**: Importa tu lista de contactos
2. **Componer Mensaje**: Escribe tu mensaje personalizado con variables si lo deseas
3. **Seleccionar Destinatarios**: Elige a quién deseas enviar el mensaje
4. **Enviar**: Haz clic en enviar y la extensión facilitará el proceso

⚠️ **Nota Importante**: La extensión funciona como ayudante de WhatsApp Web. Cada mensaje se envía a través de WhatsApp Web, manteniendo el control en tus manos.

## 📂 Estructura del Proyecto

```
├── src/
│   ├── components/        # Componentes React de la extensión
│   ├── pages/            # Páginas de la extensión
│   ├── utils/            # Funciones utilitarias
│   ├── hooks/            # React hooks
│   ├── lib/              # Librerías auxiliares
│   ├── App.tsx           # Componente principal
│   └── main.tsx          # Punto de entrada
├── public/               # Archivos públicos y archivos de la extensión
│   ├── manifest.json     # Configuración de la extensión Chrome
│   ├── background.js     # Service Worker de la extensión
│   ├── content.js        # Content Script para inyectar en WhatsApp Web
│   └── robots.txt        # Configuración de robots
├── dist/                 # Carpeta compilada (cargable en Chrome)
├── vite.config.ts        # Configuración de Vite
└── tailwind.config.ts    # Configuración de Tailwind CSS
```

## 🔐 Privacidad y Seguridad

- **No almacenamos** tus contactos en nuestros servidores
- **No compartimos** datos con terceros
- **Todos los datos** se procesan localmente en tu dispositivo
- **Respetamos** la privacidad de tus contactos

## 📝 Licencia

Este proyecto está disponible bajo licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, lee [CONTRIBUTING.md](CONTRIBUTING.md) para ver las directrices completas sobre:

- Cómo reportar errores
- Proponer características nuevas
- Enviar Pull Requests
- Estándares de código
- Proceso de revisión

## 📞 Contacto y Soporte

Para reportar problemas, sugerencias o preguntas sobre el desarrollo, abre un issue en el [repositorio](https://github.com/SystemAlex/WhatsappSender/issues).

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para obtener instrucciones detalladas sobre cómo reportar errores o proponer características nuevas.

## 👨‍💼 Autor

**WhatsApp Sender** fue desarrollado por **[SystemAlex](https://github.com/SystemAlex)**.

### Desarrolladores Contribuidores

- [SystemAlex](https://github.com/SystemAlex) (Desarrollador Principal)

Si deseas contribuir o tienes preguntas sobre el desarrollo, contacta a través de los issues del repositorio.

---

### Preguntas Frecuentes

**P: ¿Es seguro usar esta extensión?**
R: Sí, con las advertencias descritas anteriormente. Asegúrate de cumplir con los términos de servicio de WhatsApp.

**P: ¿Mis contactos se guardan en algún servidor?**
R: No. Todos los datos se procesan localmente en tu dispositivo.

**P: ¿Puedo usar esto en Firefox?**
R: Actualmente no. La extensión está optimizada solo para navegadores basados en Chromium.

**P: ¿Cuál es la velocidad máxima de envío?**
R: Para evitar detección por WhatsApp, recomendamos enviar máximo 30-40 mensajes por hora.

## 📌 Resumen de Responsabilidades del Usuario

| Aspecto            | Responsabilidad                        |
| ------------------ | -------------------------------------- |
| Consentimiento     | Obtener explícitamente antes de enviar |
| Cumplimiento Legal | Seguir leyes locales e internacionales |
| Términos WhatsApp  | Respetar los términos de servicio      |
| Privacidad         | Proteger datos de terceros             |
| Uso Ético          | Usar la herramienta responsablemente   |

**Última actualización**: Abril 2026

---

## 📊 Información de Versión

| Campo                     | Valor                                       |
| ------------------------- | ------------------------------------------- |
| **Versión Actual**        | 1.1.0                                       |
| **Versión Mínima Chrome** | 88+                                         |
| **Estado del Proyecto**   | Activo ✅                                   |
| **Licencia**              | MIT                                         |
| **Lenguaje**              | Español (ES)                                |
| **Última Actualización**  | 26 de Abril de 2026                         |
| **Desarrollador**         | [SystemAlex](https://github.com/SystemAlex) |

### ⚠️ **Por favor, lee completamente las advertencias antes de usar esta extensión.**
