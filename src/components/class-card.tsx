import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';
import type { ScheduledClass } from '@/features/class-booking/types';

type ClassCardProps = {
  scheduledClass: ScheduledClass;
  dayLabel: string;
  availability?: string;
  actionLabel: string;
  actionDisabled?: boolean;
  actionTone?: 'primary' | 'danger';
  onAction: () => void;
};

export function ClassCard({
  scheduledClass,
  dayLabel,
  availability,
  actionLabel,
  actionDisabled = false,
  actionTone = 'primary',
  onAction,
}: ClassCardProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.heading}>
        <View style={styles.titleBlock}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.day}>
            {dayLabel}
          </ThemedText>
          <ThemedText type="subtitle" style={styles.name}>
            {scheduledClass.nombre}
          </ThemedText>
        </View>
        <ThemedText type="smallBold">{scheduledClass.hora}</ThemedText>
      </View>

      <ThemedText themeColor="textSecondary">Con {scheduledClass.instructor}</ThemedText>
      {availability && (
        <ThemedText type="smallBold" accessibilityLabel={`Disponibilidad: ${availability}`}>
          {availability}
        </ThemedText>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${actionLabel} ${scheduledClass.nombre} del ${dayLabel} a las ${scheduledClass.hora}`}
        disabled={actionDisabled}
        onPress={onAction}
        style={({ pressed }) => [
          styles.button,
          actionTone === 'danger' ? styles.dangerButton : styles.primaryButton,
          actionDisabled && styles.disabledButton,
          pressed && !actionDisabled && styles.pressed,
        ]}>
        <ThemedText style={styles.buttonText} type="smallBold">
          {actionLabel}
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  titleBlock: {
    flex: 1,
  },
  day: {
    textTransform: 'capitalize',
  },
  name: {
    fontSize: 24,
    lineHeight: 30,
  },
  button: {
    minHeight: 48,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  primaryButton: {
    backgroundColor: '#176B5B',
  },
  dangerButton: {
    backgroundColor: '#A53838',
  },
  disabledButton: {
    backgroundColor: '#777C85',
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#FFFFFF',
  },
});
