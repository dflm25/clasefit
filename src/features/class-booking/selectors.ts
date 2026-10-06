import type { Reservation, ScheduledClass } from './types';

export function hasReservation(classId: string, reservations: Reservation[]): boolean {
  return reservations.some((reservation) => reservation.classId === classId);
}

export function getAvailableSpots(
  scheduledClass: ScheduledClass,
  reservations: Reservation[],
): number {
  const memberSpot = hasReservation(scheduledClass.id, reservations) ? 1 : 0;
  return Math.max(0, scheduledClass.cupoTotal - scheduledClass.ocupados - memberSpot);
}

export function formatAvailability(
  scheduledClass: ScheduledClass,
  reservations: Reservation[],
): string {
  const available = getAvailableSpots(scheduledClass, reservations);
  return available === 0 ? 'Llena' : `${available} de ${scheduledClass.cupoTotal} cupos`;
}

export function getReservedClasses(
  classes: ScheduledClass[],
  reservations: Reservation[],
): ScheduledClass[] {
  const reservedIds = new Set(reservations.map(({ classId }) => classId));
  return classes
    .filter(({ id }) => reservedIds.has(id))
    .sort((left, right) => left.startAt.getTime() - right.startAt.getTime());
}
