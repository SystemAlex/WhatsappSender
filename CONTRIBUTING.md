# Guía de Contribución

¡Gracias por tu interés en contribuir a **WhatsApp Sender**! 🎉

## Código de Conducta

Todos los contribuyentes se comprometen a mantener un ambiente respetuoso y profesional. Esperamos que:

- Seas respetuoso con otros colaboradores
- No hagas comentarios discriminatorios o inapropiados
- Respetes las decisiones del equipo principal
- Sigas los estándares de código establecidos

## Cómo Contribuir

### 1. Reportar Errores (Bugs)

Antes de reportar un error:

- Verifica si ya existe un reporte en [Issues](https://github.com/SystemAlex/WhatsappSender/issues)
- Actualiza tu navegador Chrome a la última versión
- Limpia el caché de la extensión

**Para reportar un error, incluye:**

- Sistema operativo (Windows, macOS, Linux)
- Versión de Chrome
- Pasos para reproducir el error
- Comportamiento esperado vs. actual
- Screenshots o video (si es posible)
- Mensaje de error completo

### 2. Proponer Características Nuevas

1. Abre un nuevo issue con la etiqueta `enhancement`
2. Describe claramente:
   - Qué característica propones
   - Por qué es importante
   - Caso de uso
   - Ejemplos o mockups (opcional)

### 3. Enviar Pull Requests

#### Antes de empezar:

```bash
# 1. Fork el repositorio
# 2. Clona tu fork
git clone https://github.com/tuusuario/WhatsappSender.git
cd WhatsappSender

# 3. Crea una rama nueva
git checkout -b feature/tu-caracteristica
# o para errores
git checkout -b fix/nombre-del-error
```

#### Configurar el entorno:

```bash
# Instala dependencias
pnpm install

# Inicia modo desarrollo
pnpm dev

# Verifica estilos
pnpm lint

# Verifica tipos
pnpm check

# Formatea código
pnpm format
```

#### Hacer cambios:

1. **Crea commits atómicos:**

   ```bash
   git commit -m "feat: agregar nueva característica X"
   git commit -m "fix: corregir error en módulo Y"
   ```

2. **Sigue la convención de commits:**
   - `feat:` nueva característica
   - `fix:` corrección de error
   - `docs:` cambios de documentación
   - `style:` cambios de formato (no afectan el código)
   - `refactor:` refactorización de código
   - `test:` agregar o actualizar tests
   - `chore:` actualizaciones de dependencias

3. **Asegúrate de:**
   - El código pase `pnpm lint`
   - El código pase `pnpm check`
   - Tu rama esté actualizada con `main`
   - Incluyas cambios en documentación si es necesario

#### Enviar Pull Request:

1. Push a tu rama:

   ```bash
   git push origin feature/tu-caracteristica
   ```

2. Abre un Pull Request en GitHub con:
   - Título claro y descriptivo
   - Descripción de los cambios
   - Referencia a issues relacionados (Closes #123)
   - Screenshots o videos si aplica

3. Responde a los comentarios del revisor

## Estándares de Código

### TypeScript

- Usa tipos estrictos (`strict: true`)
- No uses `any` a menos que sea absolutamente necesario
- Incluye comentarios JSDoc para funciones públicas

### React

- Usa functional components
- Preferiblemente hooks en lugar de state
- Mantén los componentes pequeños y reutilizables
- Usa nombres descriptivos

### CSS/Tailwind

- Utiliza solo Tailwind CSS
- Evita CSS custom cuando sea posible
- Sigue el diseño existente

### Ejemplo de código bien escrito:

```typescript
/**
 * Envía un mensaje a través de WhatsApp Web
 * @param contactId - ID del contacto
 * @param message - Texto del mensaje a enviar
 * @throws Error si WhatsApp Web no está disponible
 */
export async function sendMessage(
  contactId: string,
  message: string,
): Promise<void> {
  if (!contactId || !message) {
    throw new Error("Contact ID y mensaje son requeridos");
  }

  // Tu lógica aquí
}
```

## Directrices de Seguridad

- **Nunca** commitees credenciales o tokens
- **Nunca** accedas a datos del usuario sin consentimiento
- Sigue las políticas de privacidad de WhatsApp
- Revisa dos veces cualquier código que interactúe con WhatsApp

## Proceso de Revisión

1. Un mantenedor revisará tu PR dentro de 3-7 días
2. Se pueden solicitar cambios
3. Una vez aprobado, tu PR será mergeado
4. Tu nombre se añadirá a la lista de contribuyentes

## Preguntas o Dudas

- Abre un issue con la etiqueta `question`
- Comenta en issues relacionados
- Se respetuoso y claro

## Licencia

Al contribuir, aceptas que tus cambios se licencien bajo la licencia MIT del proyecto.

---

**¡Gracias por ayudar a mejorar WhatsApp Sender!** 🚀

Última actualización: Abril 2026
