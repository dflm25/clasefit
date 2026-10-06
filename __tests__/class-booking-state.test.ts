import { BOOKING_ERROR_MESSAGES, EMPTY_RESERVATIONS_MESSAGE } from '@/features/class-booking/messages';
import { getReservedClasses } from '@/features/class-booking/selectors';
import { bookingReducer, initialBookingState } from '@/features/class-booking/state';
import { scheduleClass } from '@/features/class-booking/time';
import type { SourceClass } from '@/features/class-booking/types';

const now = new Date('2026-10-06T12:00:00.000Z');

function makeClass(id: string, diaOffset: number, hora: string) {
  const source: SourceClass = {
    id,
    nombre: 'Prueba',
    instructor: 'Instructora',
    diaOffset,
    hora,
    duracionMin: 45,
    cupoTotal: 10,
    ocupados: 0,
  };
  return scheduleClass(source, now);
}

describe('estado de reservas en memoria', () => {
  it('inicia sin reservas ni feedback', () => {
    expect(initialBookingState).toEqual({ reservations: [], feedback: null });
  });

  it('aplica una reserva o cancelación exitosa al estado compartido', () => {
    const reservations = [{ classId: 'C-01' }];
    const next = bookingReducer(initialBookingState, {
      type: 'operationCompleted',
      result: { ok: true, message: 'éxito', reservations },
    });

    expect(next).toEqual({ reservations, feedback: 'éxito' });
  });

  it('conserva las reservas ante un rechazo y expone su mensaje', () => {
    const reservations = [{ classId: 'C-01' }];
    const state = { reservations, feedback: null };
    const next = bookingReducer(state, {
      type: 'operationCompleted',
      result: {
        ok: false,
        code: 'ALREADY_BOOKED',
        message: BOOKING_ERROR_MESSAGES.ALREADY_BOOKED,
        reservations,
      },
    });

    expect(next.reservations).toBe(reservations);
    expect(next.feedback).toBe(BOOKING_ERROR_MESSAGES.ALREADY_BOOKED);
  });
});

describe('selector de Mis reservas', () => {
  const first = makeClass('first', 0, '10:00');
  const second = makeClass('second', 1, '08:00');
  const third = makeClass('third', 2, '06:00');

  it('devuelve solo reservas activas con la más próxima primero', () => {
    const result = getReservedClasses(
      [third, second, first],
      [{ classId: third.id }, { classId: first.id }],
    );

    expect(result.map(({ id }) => id)).toEqual(['first', 'third']);
  });

  it('devuelve una lista vacía que activa el mensaje funcional', () => {
    expect(getReservedClasses([first], [])).toEqual([]);
    expect(EMPTY_RESERVATIONS_MESSAGE).toBe('Aún no tienes reservas');
  });
});
