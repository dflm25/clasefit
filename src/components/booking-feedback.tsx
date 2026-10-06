import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';

import { Spacing } from '@/constants/theme';
import type { FeedbackSeverity } from '@/features/class-booking/types';

type BookingFeedbackProps = {
  message: string;
  severity: FeedbackSeverity;
  onDismiss: () => void;
};

const feedbackPresentation: Record<
  FeedbackSeverity,
  { backgroundColor: string; color: string; label: string }
> = {
  success: { backgroundColor: '#D7F4E8', color: '#123D33', label: 'Éxito' },
  warning: { backgroundColor: '#FFF1B8', color: '#4D3500', label: 'Advertencia' },
  error: { backgroundColor: '#FFDAD6', color: '#5F1412', label: 'Error' },
};

export function BookingFeedback({ message, severity, onDismiss }: BookingFeedbackProps) {
  const presentation = feedbackPresentation[severity];

  return (
    <View
      accessibilityLabel={`${presentation.label}: ${message}`}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[styles.container, { backgroundColor: presentation.backgroundColor }]}>
      <View style={styles.content}>
        <ThemedText type="smallBold" style={{ color: presentation.color }}>
          {presentation.label}
        </ThemedText>
        <ThemedText style={[styles.message, { color: presentation.color }]}>{message}</ThemedText>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cerrar mensaje"
        hitSlop={12}
        onPress={onDismiss}>
        <ThemedText type="smallBold" style={{ color: presentation.color }}>
          Cerrar
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  content: {
    flex: 1,
    gap: Spacing.one,
  },
  message: {
    flexShrink: 1,
  },
});
