import type { BookingErrorCode } from './types';

export const BOOKING_SUCCESS_MESSAGE = '¡Listo! Tu cupo está reservado';
export const EMPTY_RESERVATIONS_MESSAGE = 'Aún no tienes reservas';

export const BOOKING_ERROR_MESSAGES: Record<BookingErrorCode, string> = {
  NO_CAPACITY: 'Esta clase ya no tiene cupos.',
  ALREADY_BOOKED: 'Ya reservaste esta clase.',
  DAILY_LIMIT: 'Solo puedes reservar 2 clases por día.',
  CANCELLATION_WINDOW: 'Ya no puedes cancelar: faltan menos de 2 horas.',
};
