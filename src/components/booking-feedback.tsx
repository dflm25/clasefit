import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';

import { Spacing } from '@/constants/theme';

type BookingFeedbackProps = {
  message: string;
  onDismiss: () => void;
};

export function BookingFeedback({ message, onDismiss }: BookingFeedbackProps) {
  return (
    <View accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.container}>
      <ThemedText style={styles.message}>{message}</ThemedText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cerrar mensaje"
        hitSlop={12}
        onPress={onDismiss}>
        <ThemedText type="smallBold">Cerrar</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.three,
    backgroundColor: '#D7F4E8',
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  message: {
    color: '#123D33',
    flex: 1,
  },
});
