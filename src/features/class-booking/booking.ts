import { BOOKING_ERROR_MESSAGES, BOOKING_SUCCESS_MESSAGE } from './messages';
import { getAvailableSpots, hasReservation } from './selectors';
import type {
  BookingErrorCode,
  OperationResult,
  Reservation,
  ScheduledClass,
} from './types';

const CANCELLATION_LIMIT_MS = 2 * 60 * 60 * 1000;

function failure(
  code: BookingErrorCode,
  reservations: Reservation[],
): OperationResult {
  return {
    ok: false,
    code,
    message: BOOKING_ERROR_MESSAGES[code],
    reservations,
  };
}

export function bookClass(
  selectedClass: ScheduledClass,
  classes: ScheduledClass[],
  reservations: Reservation[],
): OperationResult {
  if (hasReservation(selectedClass.id, reservations)) {
    return failure('ALREADY_BOOKED', reservations);
  }

  if (getAvailableSpots(selectedClass, reservations) === 0) {
    return failure('NO_CAPACITY', reservations);
  }

  const classesById = new Map(classes.map((item) => [item.id, item]));
  const reservationsThatDay = reservations.filter(
    ({ classId }) => classesById.get(classId)?.dateKey === selectedClass.dateKey,
  ).length;

  if (reservationsThatDay >= 2) {
    return failure('DAILY_LIMIT', reservations);
  }

  return {
    ok: true,
    message: BOOKING_SUCCESS_MESSAGE,
    reservations: [...reservations, { classId: selectedClass.id }],
  };
}

export function cancelReservation(
  selectedClass: ScheduledClass,
  reservations: Reservation[],
  now: Date,
): OperationResult {
  if (selectedClass.startAt.getTime() - now.getTime() < CANCELLATION_LIMIT_MS) {
    return failure('CANCELLATION_WINDOW', reservations);
  }

  return {
    ok: true,
    message: '',
    reservations: reservations.filter(({ classId }) => classId !== selectedClass.id),
  };
}
