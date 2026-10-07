# Respuestas de reflexión · ClaseFit

## 1. ¿Qué experiencia previa tenías usando OpenSpec o SDD?

Antes de la prueba sí había tenido la oportunidad de trabajar con SDD en Adobe. Trabajé con ellos durante seis meses y dedicamos cuatro de esos meses a SDD, utilizando un framework propio desarrollado por la empresa.

También desarrollé para CompanyOn.ca un módulo de reservas en línea utilizando OpenSpec. El resultado puede consultarse en [CompanyOn](https://companyon.companyon.app).

## 2. ¿Cómo crees que cambia el rol de desarrollador React Native antes y después de conocer y aplicar este framework?

El desarrollador deja de comenzar directamente por las pantallas y pasa a aclarar primero el comportamiento esperado, los límites y los casos de error. En este proyecto, eso fue especialmente útil para separar la lógica temporal y de reservas de React Native. Después de aplicar SDD, considero que mi responsabilidad incluye mantener la trazabilidad entre la necesidad funcional, la especificación, las pruebas y la implementación. Lo único que sí noté es que, cuando no existe un mock o un diseño, pueden quedar por fuera algunos comportamientos visuales.

## 3. ¿Cómo crees que debería trabajar ahora un equipo que usa esta metodología?

El equipo debería acordar el alcance y los escenarios antes de programar, revisar los artefactos de OpenSpec en conjunto y dividir la implementación en tareas pequeñas. Cada cambio relevante debería recorrer las etapas de propuesta, validación, implementación, pruebas y archivo. También es importante conservar el historial: cuando generalicé los toasts, agregué tareas nuevas en vez de reescribir una tarea ya completada. Esto también ayuda a reducir el contexto repetido y el consumo de tokens.

## 4. ¿Qué ventajas y desventajas ves?

La principal ventaja es la trazabilidad: pude relacionar HU-01 a HU-03 y RN-01 a RN-04 con escenarios y pruebas concretas, incluido el límite exacto de dos horas. También reduce interpretaciones diferentes y ayuda a controlar el alcance. Como desventaja, exige disciplina y tiempo de documentación; para cambios mínimos puede sentirse pesado, y una spec incorrecta puede hacer que el equipo implemente con precisión una decisión equivocada.

Otra desventaja es que el equipo debe estar alineado con la metodología. Si algunas personas actualizan las especificaciones y otras modifican directamente el código, la documentación puede perder vigencia y convertirse en una fuente adicional de interpretaciones. Por eso, el proceso necesita acuerdos claros y disciplina de todo el equipo.

## 5. ¿Cuándo usarías y cuándo no usarías este método?

Lo usaría en funcionalidades con reglas de negocio, varios casos límite, decisiones compartidas o necesidad de auditoría, como reservas, pagos o permisos. También lo usaría cuando intervienen varias personas o IA, porque establece un contrato común.

No lo usaría para tareas visuales muy pequeñas. Además, en mi experiencia con Adobe, su aplicación fue un poco compleja en arquitecturas de microfrontends, ya que sincronizar cada escenario con cada pantalla resultaba bastante difícil.
