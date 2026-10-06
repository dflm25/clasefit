# Diseño

## Contexto

El proyecto es una aplicación Expo SDK 57 con React Native 0.86, TypeScript y Expo Router. Actualmente conserva las pantallas de ejemplo y componentes de tema claro/oscuro; no tiene dominio de reservas ni infraestructura de pruebas. Véanse `proposal.md` para la motivación y `specs/class-booking/spec.md` para el contrato funcional.

Las clases provienen exclusivamente de `docs/insumo-funcional/mock-data/clases.json`. `diaOffset` debe resolverse contra la fecha actual en `America/Bogota`; `ocupados` representa cupos tomados por otras personas y no debe mutarse. Las reservas de Laura Gómez solo viven durante la sesión.

## Objetivos / No objetivos

**Objetivos:**

- Separar dominio, estado de sesión y presentación para probar las reglas sin renderizar UI.
- Mantener una única fuente de verdad en memoria para que catálogo y reservas reflejen inmediatamente la misma disponibilidad.
- Hacer deterministas las reglas temporales inyectando el instante actual en las funciones de dominio y en las pruebas.
- Conservar navegación móvil simple, accesibilidad básica y estilos compatibles con modo claro y oscuro.

**No objetivos:**

- Persistencia con AsyncStorage, sincronización o recuperación de reservas al reiniciar.
- Backend, autenticación, pagos, notificaciones, administración o gestión de instructores.
- Modificar `ios/` o `android/`, agregar servicios remotos o diseñar comportamiento fuera del documento funcional.

## Decisiones

### 1. Dominio funcional puro separado de React

Se crearán tipos TypeScript para clase fuente, clase programada, reserva y resultado de operación. Funciones puras resolverán fechas, filtrarán/ordenarán clases, calcularán disponibilidad y evaluarán RN-01 a RN-04. Recibirán datos, reservas e instante actual como argumentos y devolverán resultados explícitos sin mostrar UI ni mutar el JSON.

Esto permite probar reglas y bordes con Jest sin montar componentes. Se descarta colocar las validaciones dentro de pantallas o callbacks porque duplicaría lógica entre el catálogo y “Mis reservas” y dificultaría fijar el reloj en pruebas.

### 2. Resolución temporal centralizada en America/Bogota

Un adaptador temporal construirá el inicio local de cada clase combinando la fecha actual de Bogotá, `diaOffset` y `hora`. Las comparaciones, agrupación diaria y orden usarán ese valor resuelto. La cancelación será válida cuando `inicio - ahora >= 2 horas`; por lo tanto, exactamente dos horas es válido y cualquier diferencia menor se rechaza.

El reloj se inyectará (por ejemplo, como `now: Date`) en selectores y comandos. Se descarta dispersar llamadas a `new Date()` porque genera resultados inconsistentes cerca de cambios de minuto o de día y hace frágiles las pruebas. Antes de implementar, se verificará en la documentación vigente de Expo SDK 57 cualquier API de plataforma que llegue a utilizarse; el cálculo de negocio no dependerá de una API nativa.

### 3. Estado de sesión mediante un proveedor React liviano

Un proveedor de reservas en memoria mantendrá solo identificadores de clases reservadas y expondrá operaciones de reservar y cancelar. El JSON y `ocupados` permanecerán inmutables; la disponibilidad se derivará como `cupoTotal - ocupados - reservaActivaDeLaura`. Catálogo y reservas consumirán el mismo estado derivado.

Se elige Context más reducer/hooks por ser suficiente para un único dominio y dos vistas. Se descartan AsyncStorage por alcance y una librería de estado global por complejidad innecesaria.

### 4. Resultados de operación tipados y mensajes centralizados

Las operaciones devolverán éxito o un código de error de dominio (`NO_CAPACITY`, `ALREADY_BOOKED`, `DAILY_LIMIT`, `CANCELLATION_WINDOW`). Una tabla única traducirá esos códigos a los mensajes exactos del documento funcional. La UI solo presentará el resultado.

Esto evita variaciones de texto y permite afirmar en pruebas tanto el código como el mensaje. Si varias precondiciones fallan simultáneamente, la implementación tendrá un orden de evaluación estable y documentado en pruebas; la especificación solo exige el mensaje correspondiente al caso aislado de cada regla.

### 5. Dos destinos de navegación con Expo Router

La aplicación tendrá acceso directo al catálogo de clases y a “Mis reservas” dentro del enrutamiento existente. Las pantallas se limitarán a composición y eventos; tarjetas, estados vacíos y confirmación serán componentes fuera de `src/app/`. La confirmación de cancelación usará una interacción nativa/multiplataforma compatible con la versión instalada, verificada contra la documentación de Expo SDK 57 durante la implementación.

Se conserva Expo Router en lugar de introducir otro navegador. La interfaz reutilizará los tokens y componentes temáticos existentes cuando sean adecuados y mantendrá contraste, áreas táctiles y etiquetas accesibles en ambos temas.

### 6. Pruebas unitarias enfocadas en contrato funcional

Se configurará Jest de forma compatible con Expo SDK 57 y se probarán las funciones de dominio con fechas fijas. La matriz cubrirá HU-01 a HU-03, RN-01 a RN-04, mensajes exactos, clases llenas, un solo cupo, duplicados, tercera reserva diaria, días distintos, cancelación y los bordes de más de dos horas, exactamente dos horas, menos de dos horas e inicio pasado.

Se priorizan pruebas unitarias de dominio; pruebas end-to-end y servicios de reloj simulado en UI quedan fuera del MVP.

## Riesgos / Compensaciones

- **Riesgo: interpretar `diaOffset` en UTC desplaza el día local.** -> Centralizar la conversión en Bogotá y probar cerca de medianoche con fechas fijas.
- **Riesgo: el tiempo avanza mientras una pantalla permanece abierta.** -> Evaluar el instante actual al ejecutar reservar/cancelar y recalcular los selectores al entrar o actualizar la vista, sin almacenar fechas derivadas como estado permanente.
- **Riesgo: catálogo y reservas divergen en cupos.** -> Derivar ambos desde el JSON inmutable y el único conjunto de reservas activas.
- **Riesgo: mensajes funcionales cambian por copias en componentes.** -> Centralizar literales y cubrirlos con pruebas exactas.
- **Compensación: las reservas se pierden al reiniciar.** -> Es una decisión intencional del MVP; AsyncStorage queda fuera de la primera implementación.

## Plan de migración

1. Incorporar el dominio, adaptador temporal y pruebas sin alterar datos nativos.
2. Incorporar el proveedor de sesión y componentes de presentación.
3. Sustituir las pantallas de ejemplo por catálogo y reservas dentro de Expo Router.
4. Verificar lint, TypeScript, pruebas y comportamiento manual en temas claro y oscuro.

La reversión consiste en restaurar las rutas/pantallas anteriores; no existe migración de datos porque el estado es solo en memoria.
