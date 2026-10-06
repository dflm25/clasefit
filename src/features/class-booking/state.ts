import type { OperationResult, Reservation } from './types';

export type BookingState = {
  reservations: Reservation[];
  feedback: string | null;
};

export type BookingAction =
  | { type: 'operationCompleted'; result: OperationResult }
  | { type: 'clearFeedback' };

export const initialBookingState: BookingState = {
  reservations: [],
  feedback: null,
};

export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  if (action.type === 'clearFeedback') {
    return { ...state, feedback: null };
  }

  return {
    reservations: action.result.reservations,
    feedback: action.result.message || null,
  };
}
