# Delta de especificación

## Purpose

Permitir que la socia consulte clases grupales próximas, reserve cupos y gestione cancelaciones locales respetando la disponibilidad y las reglas temporales del MVP ClaseFit.

## ADDED Requirements

### Requirement: Catálogo de clases próximas (HU-01)
El sistema DEBE (`MUST`) mostrar las clases del día actual, del día siguiente y del segundo día siguiente, calculando cada fecha desde `diaOffset` en `America/Bogota`, excluyendo las clases que ya comenzaron y ordenando las restantes por fecha y hora ascendentes.

#### Scenario: Cálculo de fecha mediante diaOffset
- **WHEN** el dispositivo se encuentra en una fecha dada en `America/Bogota` y una clase del archivo fuente tiene `diaOffset` 0, 1 o 2
- **THEN** el sistema asigna a la clase, respectivamente, la fecha local de hoy, mañana o pasado mañana sin interpretar `diaOffset` como una fecha UTC

#### Scenario: Exclusión de una clase que ya comenzó
- **WHEN** la hora actual de `America/Bogota` es posterior o igual a la fecha y hora de inicio de una clase
- **THEN** el sistema no muestra esa clase en el catálogo de próximas clases

#### Scenario: Inclusión de una clase futura del día actual
- **WHEN** una clase con `diaOffset` 0 inicia después de la hora actual de `America/Bogota`
- **THEN** el sistema muestra esa clase en el catálogo

#### Scenario: Orden cronológico
- **WHEN** existen varias clases futuras entre hoy y pasado mañana
- **THEN** el sistema las muestra por fecha ascendente y, para una misma fecha, por hora ascendente

### Requirement: Información y disponibilidad de una clase (HU-01)
El sistema DEBE (`MUST`) mostrar para cada clase próxima su nombre, día, hora, instructor y cupos disponibles respecto al cupo total. Los cupos disponibles DEBEN descontar tanto `ocupados` como las reservas activas de la socia.

#### Scenario: Clase con disponibilidad
- **WHEN** una clase de 20 cupos tiene 14 ocupados y una reserva activa de la socia
- **THEN** el sistema muestra los datos de la clase y la disponibilidad "5 de 20 cupos"

#### Scenario: Clase llena
- **WHEN** la cantidad de ocupados más las reservas activas alcanza el cupo total de una clase
- **THEN** el sistema muestra "Llena" y no ofrece una acción habilitada para reservarla

### Requirement: Reserva exitosa (HU-02)
El sistema DEBE (`MUST`) crear en memoria una reserva para la clase seleccionada cuando todas las reglas de reserva se cumplen, disminuir en uno el cupo disponible mostrado y presentar el mensaje "¡Listo! Tu cupo está reservado".

#### Scenario: Reserva de una clase disponible
- **WHEN** la socia reserva una clase con cupos, no reservada previamente y sin haber alcanzado dos reservas para esa fecha de clase
- **THEN** el sistema agrega una única reserva activa en memoria, reduce en uno la disponibilidad y muestra "¡Listo! Tu cupo está reservado"

#### Scenario: Reinicio de la aplicación
- **WHEN** la aplicación se reinicia después de crear reservas
- **THEN** el sistema vuelve a iniciar sin reservas de la socia y conserva los valores originales de `ocupados` del archivo fuente

### Requirement: Retroalimentación flotante por severidad
El sistema DEBE (`MUST`) presentar todos los mensajes operativos definidos por el MVP como mensajes flotantes accesibles, visibles sin depender de la posición del scroll. La presentación DEBE distinguir éxito en verde, advertencia en amarillo y error en rojo, y NO DEBE (`MUST NOT`) depender únicamente del color para comunicar la severidad.

#### Scenario: Reserva exitosa mostrada como éxito
- **WHEN** una reserva se crea correctamente
- **THEN** el sistema muestra "¡Listo! Tu cupo está reservado" en un mensaje flotante con severidad de éxito y tratamiento visual verde

#### Scenario: Resultado informativo mostrado como advertencia
- **WHEN** una operación devuelve `ALREADY_BOOKED` o `CANCELLATION_WINDOW`
- **THEN** el sistema muestra el mensaje funcional correspondiente en un mensaje flotante con severidad de advertencia y tratamiento visual amarillo

#### Scenario: Reserva rechazada mostrada como error
- **WHEN** una operación devuelve `NO_CAPACITY` o `DAILY_LIMIT`
- **THEN** el sistema muestra el mensaje funcional correspondiente en un mensaje flotante con severidad de error y tratamiento visual rojo

#### Scenario: Severidad perceptible sin color
- **WHEN** se presenta cualquier mensaje flotante de éxito, advertencia o error
- **THEN** el sistema comunica también su severidad mediante texto o semántica accesible y mantiene el mensaje visible independientemente de la posición del scroll

### Requirement: RN-01 - Impedir reserva sin cupos
El sistema NO DEBE (`MUST NOT`) crear una reserva cuando la clase no tiene cupos disponibles y DEBE mostrar "Esta clase ya no tiene cupos.".

#### Scenario: Intento de reservar una clase llena desde el origen
- **WHEN** la socia intenta reservar una clase cuyo valor `ocupados` es igual al cupo total
- **THEN** el sistema no crea la reserva, no modifica la disponibilidad y muestra "Esta clase ya no tiene cupos."

#### Scenario: El último cupo ya fue tomado por una reserva local
- **WHEN** la suma de `ocupados` y reservas activas alcanza el cupo total antes del intento
- **THEN** el sistema no crea otra reserva, no reduce la disponibilidad por debajo de cero y muestra "Esta clase ya no tiene cupos."

### Requirement: RN-02 - Impedir reserva duplicada
El sistema NO DEBE (`MUST NOT`) permitir que la socia mantenga más de una reserva activa para la misma clase y DEBE mostrar "Ya reservaste esta clase." ante un intento duplicado.

#### Scenario: Segundo intento sobre la misma clase
- **WHEN** la socia intenta reservar una clase para la cual ya mantiene una reserva activa
- **THEN** el sistema conserva una sola reserva y no modifica de nuevo la disponibilidad
- **AND** muestra "Ya reservaste esta clase." como advertencia flotante visible sin depender de la posición del scroll

#### Scenario: Nueva reserva después de cancelar
- **WHEN** la socia canceló válidamente una reserva y vuelve a reservar la misma clase mientras todavía cumple las reglas de reserva
- **THEN** el sistema permite crear una nueva reserva porque ya no existe una reserva activa duplicada

### Requirement: RN-03 - Máximo de dos reservas por día de clase
El sistema NO DEBE (`MUST NOT`) permitir más de dos reservas activas de la socia para una misma fecha local de clase y DEBE mostrar "Solo puedes reservar 2 clases por día." cuando se exceda el límite.

#### Scenario: Primera y segunda reserva del mismo día
- **WHEN** la socia tiene menos de dos reservas activas para la fecha local de la clase seleccionada y las demás reglas se cumplen
- **THEN** el sistema permite la reserva hasta completar un máximo de dos para esa fecha

#### Scenario: Tercera reserva del mismo día
- **WHEN** la socia ya tiene dos reservas activas para la misma fecha local e intenta reservar una tercera clase de esa fecha
- **THEN** el sistema no crea la tercera reserva, no modifica su disponibilidad y muestra "Solo puedes reservar 2 clases por día."

#### Scenario: Reservas en fechas distintas
- **WHEN** la socia tiene dos reservas para una fecha e intenta reservar una clase de otra fecha
- **THEN** esas reservas no cuentan para el límite de la otra fecha y el sistema permite la nueva reserva si cumple las demás reglas

#### Scenario: Cupo diario liberado por cancelación
- **WHEN** la socia cancela válidamente una de sus dos reservas de una fecha
- **THEN** el sistema permite reservar otra clase de esa misma fecha si cumple las demás reglas

### Requirement: Listado de mis reservas (HU-03)
El sistema DEBE (`MUST`) mostrar únicamente las reservas activas de la socia, ordenadas por inicio ascendente, y DEBE presentar "Aún no tienes reservas" cuando no exista ninguna.

#### Scenario: Reservas activas ordenadas
- **WHEN** la socia tiene varias reservas activas en diferentes fechas u horas
- **THEN** el sistema las muestra con la reserva más próxima primero

#### Scenario: Estado vacío
- **WHEN** la socia no tiene reservas activas
- **THEN** el sistema muestra "Aún no tienes reservas"

### Requirement: Confirmación previa a cancelar (HU-03)
El sistema DEBE (`MUST`) solicitar confirmación antes de intentar cancelar una reserva y DEBE conservarla sin cambios si la socia no confirma.

#### Scenario: La socia descarta la cancelación
- **WHEN** la socia inicia la cancelación de una reserva y no la confirma
- **THEN** la reserva permanece activa y la disponibilidad de la clase no cambia

#### Scenario: La socia confirma la cancelación
- **WHEN** la socia confirma la cancelación de una reserva
- **THEN** el sistema evalúa RN-04 antes de modificar la reserva

### Requirement: RN-04 - Límite de cancelación de dos horas
El sistema DEBE (`MUST`) permitir cancelar hasta exactamente dos horas antes del inicio de la clase y NO DEBE permitirlo cuando falten menos de dos horas, usando la fecha y hora de `America/Bogota`. Cuando se rechace, DEBE mostrar "Ya no puedes cancelar: faltan menos de 2 horas.".

#### Scenario: Cancelación con más de dos horas de anticipación
- **WHEN** la socia confirma la cancelación y faltan más de dos horas para el inicio
- **THEN** el sistema elimina la reserva activa y aumenta en uno el cupo disponible

#### Scenario: Cancelación exactamente dos horas antes
- **WHEN** la socia confirma la cancelación exactamente 2 horas, 0 minutos y 0 segundos antes del inicio
- **THEN** el sistema permite cancelar, elimina la reserva activa y aumenta en uno el cupo disponible

#### Scenario: Cancelación un instante dentro del límite restringido
- **WHEN** la socia confirma la cancelación cuando faltan menos de 2 horas para el inicio
- **THEN** el sistema conserva la reserva y la disponibilidad y muestra "Ya no puedes cancelar: faltan menos de 2 horas."

#### Scenario: Cancelación al inicio o después del inicio
- **WHEN** la socia confirma la cancelación a la hora de inicio o después
- **THEN** el sistema conserva la reserva y la disponibilidad y muestra "Ya no puedes cancelar: faltan menos de 2 horas."
