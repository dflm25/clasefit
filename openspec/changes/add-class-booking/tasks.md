# Tareas

## 1. Base de dominio y pruebas

- [x] 1.1 Consultar la documentación versionada de Expo SDK 57 y `llms.txt` para confirmar la configuración vigente de Jest y cualquier API Expo/React Native que vaya a usarse; verificar que las decisiones y comandos elegidos correspondan a esa versión antes de escribir código.
- [x] 1.2 Instalar con `npx expo install` las dependencias de prueba compatibles con SDK 57, agregar scripts/configuración de Jest y verificar que una prueba mínima TypeScript se ejecute correctamente.
- [x] 1.3 Definir los tipos de clase fuente, clase programada, reserva y resultado de operación, además de cargar `docs/insumo-funcional/mock-data/clases.json` sin modificarlo; verificar con TypeScript que los datos satisfacen el modelo.
- [x] 1.4 Implementar funciones puras para resolver `diaOffset` y `hora` en `America/Bogota`, excluir clases iniciadas y ordenar clases/reservas; verificar con Jest hoy/mañana/pasado mañana, orden cronológico, inicio exacto, clase futura y cercanía a medianoche.
- [x] 1.5 Implementar el cálculo derivado de disponibilidad usando `ocupados` más reservas activas; verificar con Jest clases disponibles, llenas y con un solo cupo sin mutar los datos fuente.

## 2. Reglas de reserva

- [x] 2.1 Implementar la reserva exitosa en memoria y los resultados tipados de dominio; verificar con Jest que se crea una sola reserva, baja un cupo y se devuelve "¡Listo! Tu cupo está reservado".
- [x] 2.2 Implementar RN-01 y RN-02 con mensajes centralizados; verificar con Jest clase llena de origen, último cupo ocupado localmente, intento duplicado y nueva reserva posterior a una cancelación válida, incluidos los textos exactos.
- [x] 2.3 Implementar RN-03 contando reservas por fecha local de clase; verificar con Jest primera/segunda reserva, tercera rechazada con "Solo puedes reservar 2 clases por día.", fechas distintas y cupo diario liberado tras cancelar.

## 3. Reglas de cancelación y estado compartido

- [x] 3.1 Implementar RN-04 con reloj inyectable y comparación `inicio - ahora >= 2 horas`; verificar con Jest más de dos horas, exactamente dos horas, un instante por debajo del límite, hora de inicio y clase pasada, incluido "Ya no puedes cancelar: faltan menos de 2 horas.".
- [x] 3.2 Implementar el proveedor/reducer de reservas en memoria que comparta una única fuente de verdad entre vistas; verificar con pruebas que reservar/cancelar actualiza listados y cupos, que rechazos no mutan estado y que una nueva inicialización comienza sin reservas.
- [x] 3.3 Implementar selectores de reservas activas y estado vacío; verificar con Jest orden de la más próxima a la más lejana y la condición que activa "Aún no tienes reservas".

## 4. Interfaz móvil y navegación

- [x] 4.1 Configurar con Expo Router los destinos de catálogo y “Mis reservas” y montar el proveedor en el layout común; verificar navegación en iOS, Android y web sin colocar código no-route dentro de `src/app/`.
- [x] 4.2 Implementar el catálogo móvil con tarjetas que muestren nombre, día, hora, instructor, cupos disponibles en formato "5 de 20 cupos" o "Llena", y acciones de reserva deshabilitadas cuando corresponda; verificar manualmente el contenido y orden usando todos los casos del JSON.
- [x] 4.3 Conectar la acción de reservar a los resultados de dominio y presentar los mensajes exactos de éxito, RN-01, RN-02 y RN-03; verificar manualmente que cada resultado se muestra y que solo el éxito modifica cupos y reservas.
- [x] 4.4 Implementar “Mis reservas” con orden cronológico, estado vacío y confirmación de cancelación; verificar manualmente que descartar conserva la reserva, confirmar aplica RN-04 y una cancelación válida libera el cupo.
- [x] 4.5 Aplicar estilos mínimos, responsivos y accesibles usando el tema existente; verificar contraste, etiquetas/roles, áreas táctiles y legibilidad en modos claro y oscuro en plataformas móviles.

## 5. Verificación integral

- [x] 5.1 Ejecutar la suite Jest completa y confirmar cobertura de HU-01, HU-02, HU-03, RN-01, RN-02, RN-03, RN-04, mensajes literales y bordes temporales descritos en la especificación.
- [x] 5.2 Ejecutar `npx expo lint` y `npx tsc --noEmit`, corregir todos los hallazgos dentro del alcance y verificar que ambos comandos finalicen sin errores.
- [x] 5.3 Recorrer manualmente el flujo catálogo -> reservar -> mis reservas -> cancelar con el mock oficial y verificar que no exista autenticación, backend, pagos, notificaciones, AsyncStorage ni funcionalidades adicionales.
