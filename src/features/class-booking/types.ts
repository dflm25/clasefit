export type SourceClass = {
  id: string;
  nombre: string;
  instructor: string;
  diaOffset: number;
  hora: string;
  duracionMin: number;
  cupoTotal: number;
  ocupados: number;
};

export type Member = {
  id: string;
  nombre: string;
};

export type ClassData = {
  gimnasio: string;
  socio: Member;
  clases: SourceClass[];
  _notas?: string;
};

export type ScheduledClass = SourceClass & {
  startAt: Date;
  dateKey: string;
};

export type Reservation = {
  classId: string;
};

export type BookingErrorCode =
  | 'NO_CAPACITY'
  | 'ALREADY_BOOKED'
  | 'DAILY_LIMIT'
  | 'CANCELLATION_WINDOW';

export type FeedbackSeverity = 'success' | 'warning' | 'error';

export type OperationResult =
  | { ok: true; message: string; reservations: Reservation[] }
  | { ok: false; code: BookingErrorCode; message: string; reservations: Reservation[] };
