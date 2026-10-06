import {
  getUpcomingClasses,
  scheduleClass,
  sortScheduledClasses,
} from '@/features/class-booking/time';
import type { SourceClass } from '@/features/class-booking/types';

function makeClass(overrides: Partial<SourceClass>): SourceClass {
  return {
    id: 'C-TEST',
    nombre: 'Prueba',
    instructor: 'Instructora',
    diaOffset: 0,
    hora: '10:00',
    duracionMin: 45,
    cupoTotal: 10,
    ocupados: 0,
    ...overrides,
  };
}

describe('fechas de clases en America/Bogota', () => {
  const now = new Date('2026-10-06T15:00:00.000Z'); // 10:00 en Bogotá

  it('resuelve hoy, mañana y pasado mañana desde diaOffset', () => {
    expect(scheduleClass(makeClass({ diaOffset: 0 }), now).dateKey).toBe('2026-10-06');
    expect(scheduleClass(makeClass({ diaOffset: 1 }), now).dateKey).toBe('2026-10-07');
    expect(scheduleClass(makeClass({ diaOffset: 2 }), now).dateKey).toBe('2026-10-08');
  });

  it('excluye una clase cuando ya comenzó o inicia exactamente ahora', () => {
    const classes = [
      makeClass({ id: 'past', hora: '09:59' }),
      makeClass({ id: 'now', hora: '10:00' }),
      makeClass({ id: 'future', hora: '10:01' }),
    ];

    expect(getUpcomingClasses(classes, now).map(({ id }) => id)).toEqual(['future']);
  });

  it('ordena por fecha y hora sin mutar la entrada', () => {
    const input = [
      scheduleClass(makeClass({ id: 'tomorrow', diaOffset: 1, hora: '06:00' }), now),
      scheduleClass(makeClass({ id: 'later', hora: '18:00' }), now),
      scheduleClass(makeClass({ id: 'first', hora: '11:00' }), now),
    ];

    expect(sortScheduledClasses(input).map(({ id }) => id)).toEqual(['first', 'later', 'tomorrow']);
    expect(input.map(({ id }) => id)).toEqual(['tomorrow', 'later', 'first']);
  });

  it('calcula diaOffset desde el día local cerca de medianoche', () => {
    const nearMidnight = new Date('2026-10-07T04:30:00.000Z'); // 23:30 del día anterior
    const scheduled = scheduleClass(
      makeClass({ diaOffset: 1, hora: '00:15' }),
      nearMidnight,
    );

    expect(scheduled.dateKey).toBe('2026-10-07');
    expect(scheduled.startAt.toISOString()).toBe('2026-10-07T05:15:00.000Z');
  });
});
