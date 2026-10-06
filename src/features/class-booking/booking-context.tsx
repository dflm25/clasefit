import { createContext, type PropsWithChildren, useContext, useMemo, useReducer } from 'react';

import { bookClass, cancelReservation } from './booking';
import { classData } from './data';
import { getReservedClasses } from './selectors';
import { bookingReducer, initialBookingState } from './state';
import { getUpcomingClasses, scheduleClass } from './time';
import type { ScheduledClass } from './types';

type BookingContextValue = {
  gymName: string;
  memberName: string;
  upcomingClasses: ScheduledClass[];
  reservedClasses: ScheduledClass[];
  reservations: { classId: string }[];
  feedback: string | null;
  book: (classId: string) => void;
  cancel: (classId: string) => void;
  clearFeedback: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(bookingReducer, initialBookingState);
  const now = new Date();
  const allClasses = classData.clases.map((item) => scheduleClass(item, now));
  const upcomingClasses = getUpcomingClasses(classData.clases, now);
  const reservedClasses = getReservedClasses(allClasses, state.reservations);

  const value = useMemo<BookingContextValue>(
    () => ({
      gymName: classData.gimnasio,
      memberName: classData.socio.nombre,
      upcomingClasses,
      reservedClasses,
      reservations: state.reservations,
      feedback: state.feedback,
      book(classId) {
        const selectedClass = allClasses.find(({ id }) => id === classId);
        if (!selectedClass) return;
        dispatch({
          type: 'operationCompleted',
          result: bookClass(selectedClass, allClasses, state.reservations),
        });
      },
      cancel(classId) {
        const selectedClass = allClasses.find(({ id }) => id === classId);
        if (!selectedClass) return;
        dispatch({
          type: 'operationCompleted',
          result: cancelReservation(selectedClass, state.reservations, new Date()),
        });
      },
      clearFeedback() {
        dispatch({ type: 'clearFeedback' });
      },
    }),
    [allClasses, upcomingClasses, reservedClasses, state.feedback, state.reservations],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextValue {
  const value = useContext(BookingContext);
  if (!value) {
    throw new Error('useBooking debe usarse dentro de BookingProvider');
  }
  return value;
}
