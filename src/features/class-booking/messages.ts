import type { BookingErrorCode, FeedbackSeverity, OperationResult } from './types';

export const BOOKING_SUCCESS_MESSAGE = '¡Listo! Tu cupo está reservado';
export const EMPTY_RESERVATIONS_MESSAGE = 'Aún no tienes reservas';

export const BOOKING_ERROR_MESSAGES: Record<BookingErrorCode, string> = {
  NO_CAPACITY: 'Esta clase ya no tiene cupos.',
  ALREADY_BOOKED: 'Ya reservaste esta clase.',
  DAILY_LIMIT: 'Solo puedes reservar 2 clases por día.',
  CANCELLATION_WINDOW: 'Ya no puedes cancelar: faltan menos de 2 horas.',
};

export const BOOKING_ERROR_SEVERITIES: Record<BookingErrorCode, FeedbackSeverity> = {
  NO_CAPACITY: 'error',
  ALREADY_BOOKED: 'warning',
  DAILY_LIMIT: 'error',
  CANCELLATION_WINDOW: 'warning',
};

export function getFeedbackSeverity(result: OperationResult): FeedbackSeverity | null {
  if (!result.message) return null;
  return result.ok ? 'success' : BOOKING_ERROR_SEVERITIES[result.code];
}
