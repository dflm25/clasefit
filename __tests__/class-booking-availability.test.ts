import {
  formatAvailability,
  getAvailableSpots,
} from '@/features/class-booking/selectors';
import { scheduleClass } from '@/features/class-booking/time';
import type { SourceClass } from '@/features/class-booking/types';

const now = new Date('2026-10-06T10:00:00.000Z');

function scheduled(overrides: Partial<SourceClass>) {
  return scheduleClass(
    {
      id: 'C-TEST',
      nombre: 'Prueba',
      instructor: 'Instructora',
      diaOffset: 1,
      hora: '10:00',
      duracionMin: 45,
      cupoTotal: 20,
      ocupados: 14,
      ...overrides,
    },
    now,
  );
}

describe('disponibilidad derivada', () => {
  it('descuenta ocupados y la reserva activa de Laura', () => {
    const item = scheduled({});

    expect(getAvailableSpots(item, [{ classId: item.id }])).toBe(5);
    expect(formatAvailability(item, [{ classId: item.id }])).toBe('5 de 20 cupos');
  });

  it('muestra Llena y nunca produce disponibilidad negativa', () => {
    const item = scheduled({ cupoTotal: 12, ocupados: 12 });

    expect(getAvailableSpots(item, [])).toBe(0);
    expect(formatAvailability(item, [])).toBe('Llena');
  });

  it('representa una clase con un solo cupo', () => {
    const item = scheduled({ cupoTotal: 15, ocupados: 14 });

    expect(formatAvailability(item, [])).toBe('1 de 15 cupos');
  });

  it('no muta la clase ni las reservas de entrada', () => {
    const item = scheduled({});
    const reservations = [{ classId: item.id }];
    const originalClass = { ...item };
    const originalReservations = [...reservations];

    getAvailableSpots(item, reservations);

    expect(item).toEqual(originalClass);
    expect(reservations).toEqual(originalReservations);
  });
});
