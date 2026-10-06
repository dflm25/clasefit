import type { ScheduledClass, SourceClass } from './types';

export const BOGOTA_TIME_ZONE = 'America/Bogota';

const bogotaDateTimeFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: BOGOTA_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

type DateParts = {
  year: number;
  month: number;
  day: number;
};

function getBogotaDateParts(date: Date): DateParts {
  const values = Object.fromEntries(
    bogotaDateTimeFormatter
      .formatToParts(date)
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, Number(value)]),
  );

  return {
    year: values.year,
    month: values.month,
    day: values.day,
  };
}

function addCalendarDays(parts: DateParts, days: number): DateParts {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days));

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

function toDateKey({ year, month, day }: DateParts): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function createBogotaInstant(parts: DateParts, time: string): Date {
  const [hour, minute] = time.split(':').map(Number);

  // Bogotá usa UTC-5 sin horario de verano; sumar cinco horas convierte la hora local en UTC.
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, hour + 5, minute));
}

export function scheduleClass(sourceClass: SourceClass, now: Date): ScheduledClass {
  const dateParts = addCalendarDays(getBogotaDateParts(now), sourceClass.diaOffset);

  return {
    ...sourceClass,
    startAt: createBogotaInstant(dateParts, sourceClass.hora),
    dateKey: toDateKey(dateParts),
  };
}

export function sortScheduledClasses(classes: ScheduledClass[]): ScheduledClass[] {
  return [...classes].sort((left, right) => left.startAt.getTime() - right.startAt.getTime());
}

export function getUpcomingClasses(classes: SourceClass[], now: Date): ScheduledClass[] {
  return sortScheduledClasses(classes.map((item) => scheduleClass(item, now))).filter(
    (item) => item.startAt.getTime() > now.getTime(),
  );
}

export function formatClassDay(date: Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    timeZone: BOGOTA_TIME_ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  }).format(date);
}
