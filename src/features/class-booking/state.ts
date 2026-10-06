import { getFeedbackSeverity } from './messages';
import type {
  FeedbackSeverity,
  OperationResult,
  Reservation,
} from './types';

export type BookingState = {
  reservations: Reservation[];
  feedback: string | null;
  feedbackSeverity: FeedbackSeverity | null;
};

export type BookingAction =
  | { type: 'operationCompleted'; result: OperationResult }
  | { type: 'clearFeedback' };

export const initialBookingState: BookingState = {
  reservations: [],
  feedback: null,
  feedbackSeverity: null,
};

export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  if (action.type === 'clearFeedback') {
    return { ...state, feedback: null, feedbackSeverity: null };
  }

  return {
    reservations: action.result.reservations,
    feedback: action.result.message || null,
    feedbackSeverity: getFeedbackSeverity(action.result),
  };
}
