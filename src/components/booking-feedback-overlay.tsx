import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingFeedback } from './booking-feedback';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import type { FeedbackSeverity } from '@/features/class-booking/types';

type BookingFeedbackOverlayProps = {
  message: string | null;
  severity: FeedbackSeverity | null;
  onDismiss: () => void;
};

export function BookingFeedbackOverlay({
  message,
  severity,
  onDismiss,
}: BookingFeedbackOverlayProps) {
  const insets = useSafeAreaInsets();

  if (!message || !severity) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.layer, { bottom: insets.bottom + BottomTabInset + Spacing.three }]}>
      <View style={styles.toast}>
        <BookingFeedback message={message} severity={severity} onDismiss={onDismiss} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
    elevation: 4,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },
  toast: {
    width: '100%',
    maxWidth: MaxContentWidth,
  },
});
