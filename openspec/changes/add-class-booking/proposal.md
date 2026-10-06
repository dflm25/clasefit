# Propuesta

## Por qué

ClaseFit necesita reemplazar la gestión manual de reservas por WhatsApp, que hoy provoca sobrecupos y reservas olvidadas. Este cambio define el MVP móvil para que la socia consulte clases próximas, reserve cupos y administre sus reservas localmente.

## Qué cambia

- Mostrar las clases de hoy, mañana y pasado mañana que aún no han empezado, ordenadas cronológicamente y calculadas desde `diaOffset` en la zona horaria `America/Bogota`.
- Mostrar nombre, día, hora, instructor y cupos disponibles en formato "5 de 20 cupos"; identificar las clases sin cupo como "Llena" e impedir su reserva.
- Permitir reservar con estado en memoria, actualizando inmediatamente los cupos disponibles y aplicando RN-01, RN-02 y RN-03 con sus mensajes funcionales exactos.
- Mostrar las reservas de Laura Gómez ordenadas desde la más próxima y el estado vacío "Aún no tienes reservas".
- Permitir cancelar con confirmación, liberar el cupo y aplicar RN-04, incluido el límite exacto de dos horas antes del inicio.
- Separar las reglas de negocio y el manejo temporal de la interfaz para permitir pruebas unitarias con Jest.
- Usar `docs/insumo-funcional/mock-data/clases.json` como única fuente de clases, sin persistencia inicial.
- Mantener el alcance exclusivamente local y de frontend: sin autenticación, backend, pagos, notificaciones, instructores ni administración.

## Capacidades

### Capacidades nuevas

- `class-booking`: Consulta de clases próximas, reserva de cupos y consulta/cancelación de reservas según las reglas del MVP ClaseFit.

### Capacidades modificadas

Ninguna.

## Impacto

- Reemplazo de las pantallas de ejemplo por una experiencia móvil mínima con Expo Router, React Native y TypeScript, compatible con modo claro y oscuro.
- Incorporación de un estado de reservas en memoria y de módulos puros para fechas, disponibilidad, reserva y cancelación.
- Incorporación de configuración y pruebas unitarias con Jest para reglas de negocio y casos límite.
- No se agregan APIs, servicios remotos, almacenamiento persistente ni módulos nativos adicionales.
