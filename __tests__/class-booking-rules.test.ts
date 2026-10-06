import { bookClass, cancelReservation } from '@/features/class-booking/booking';
import {
  BOOKING_ERROR_MESSAGES,
  BOOKING_SUCCESS_MESSAGE,
} from '@/features/class-booking/messages';
import { getAvailableSpots } from '@/features/class-booking/selectors';
import { scheduleClass } from '@/features/class-booking/time';
import type { Reservation, SourceClass } from '@/features/class-booking/types';

const baseNow = new Date('2026-10-06T12:00:00.000Z'); // 07:00 en Bogotá

function makeClass(overrides: Partial<SourceClass> = {}) {
  return scheduleClass(
    {
      id: 'C-TEST',
      nombre: 'Prueba',
      instructor: 'Instructora',
      diaOffset: 1,
      hora: '10:00',
      duracionMin: 45,
      cupoTotal: 10,
      ocupados: 5,
      ...overrides,
    },
    baseNow,
  );
}

describe('reserva exitosa', () => {
  it('crea una reserva, reduce un cupo y devuelve el mensaje funcional', () => {
    const selected = makeClass();
    const result = bookClass(selected, [selected], []);

    expect(result).toEqual({
      ok: true,
      message: BOOKING_SUCCESS_MESSAGE,
      reservations: [{ classId: selected.id }],
    });
    expect(getAvailableSpots(selected, result.reservations)).toBe(4);
  });
});

describe('RN-01 y RN-02', () => {
  it('rechaza una clase llena sin mutar reservas', () => {
    const selected = makeClass({ cupoTotal: 10, ocupados: 10 });
    const reservations: Reservation[] = [];
    const result = bookClass(selected, [selected], reservations);

    expect(result).toMatchObject({
      ok: false,
      code: 'NO_CAPACITY',
      message: BOOKING_ERROR_MESSAGES.NO_CAPACITY,
    });
    expect(result.reservations).toBe(reservations);
  });

  it('no reduce disponibilidad por debajo de cero', () => {
    const selected = makeClass({ cupoTotal: 1, ocupados: 1 });
    expect(getAvailableSpots(selected, [])).toBe(0);
    expect(bookClass(selected, [selected], [])).toMatchObject({ code: 'NO_CAPACITY' });
  });

  it('rechaza una reserva duplicada con su mensaje exacto', () => {
    const selected = makeClass();
    const reservations = [{ classId: selected.id }];

    expect(bookClass(selected, [selected], reservations)).toMatchObject({
      ok: false,
      code: 'ALREADY_BOOKED',
      message: BOOKING_ERROR_MESSAGES.ALREADY_BOOKED,
      reservations,
    });
  });

  it('permite reservar de nuevo después de cancelar', () => {
    const selected = makeClass();
    const cancelled = cancelReservation(
      selected,
      [{ classId: selected.id }],
      new Date(selected.startAt.getTime() - 3 * 60 * 60 * 1000),
    );

    expect(bookClass(selected, [selected], cancelled.reservations).ok).toBe(true);
  });
});

describe('RN-03', () => {
  const first = makeClass({ id: 'first', hora: '10:00' });
  const second = makeClass({ id: 'second', hora: '11:00' });
  const third = makeClass({ id: 'third', hora: '12:00' });
  const anotherDay = makeClass({ id: 'another-day', diaOffset: 2, hora: '10:00' });
  const classes = [first, second, third, anotherDay];

  it('permite la primera y segunda reserva del día', () => {
    const firstResult = bookClass(first, classes, []);
    const secondResult = bookClass(second, classes, firstResult.reservations);

    expect(firstResult.ok).toBe(true);
    expect(secondResult.ok).toBe(true);
    expect(secondResult.reservations).toHaveLength(2);
  });

  it('rechaza la tercera reserva del mismo día', () => {
    const reservations = [{ classId: first.id }, { classId: second.id }];

    expect(bookClass(third, classes, reservations)).toMatchObject({
      ok: false,
      code: 'DAILY_LIMIT',
      message: BOOKING_ERROR_MESSAGES.DAILY_LIMIT,
      reservations,
    });
  });

  it('mantiene límites independientes para fechas distintas', () => {
    const reservations = [{ classId: first.id }, { classId: second.id }];
    expect(bookClass(anotherDay, classes, reservations).ok).toBe(true);
  });

  it('libera el cupo diario después de cancelar', () => {
    const reservations = [{ classId: first.id }, { classId: second.id }];
    const cancelled = cancelReservation(
      first,
      reservations,
      new Date(first.startAt.getTime() - 3 * 60 * 60 * 1000),
    );

    expect(bookClass(third, classes, cancelled.reservations).ok).toBe(true);
  });
});

describe('RN-04', () => {
  const selected = makeClass();
  const reservation = [{ classId: selected.id }];

  it('permite cancelar con más de dos horas de anticipación', () => {
    const now = new Date(selected.startAt.getTime() - 2 * 60 * 60 * 1000 - 1);
    expect(cancelReservation(selected, reservation, now)).toMatchObject({
      ok: true,
      reservations: [],
    });
  });

  it('permite cancelar exactamente dos horas antes', () => {
    const now = new Date(selected.startAt.getTime() - 2 * 60 * 60 * 1000);
    expect(cancelReservation(selected, reservation, now).ok).toBe(true);
  });

  it('rechaza cancelar un milisegundo dentro de la ventana restringida', () => {
    const now = new Date(selected.startAt.getTime() - 2 * 60 * 60 * 1000 + 1);
    expect(cancelReservation(selected, reservation, now)).toMatchObject({
      ok: false,
      code: 'CANCELLATION_WINDOW',
      message: BOOKING_ERROR_MESSAGES.CANCELLATION_WINDOW,
      reservations: reservation,
    });
  });

  it.each([
    ['al inicio', new Date(selected.startAt)],
    ['después del inicio', new Date(selected.startAt.getTime() + 1)],
  ])('rechaza cancelar %s', (_label, now) => {
    expect(cancelReservation(selected, reservation, now)).toMatchObject({
      ok: false,
      code: 'CANCELLATION_WINDOW',
      message: BOOKING_ERROR_MESSAGES.CANCELLATION_WINDOW,
    });
  });
});
