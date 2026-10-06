import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingFeedbackOverlay } from '@/components/booking-feedback-overlay';
import { CancellationConfirmation } from '@/components/cancellation-confirmation';
import { ClassCard } from '@/components/class-card';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useBooking } from '@/features/class-booking/booking-context';
import { EMPTY_RESERVATIONS_MESSAGE } from '@/features/class-booking/messages';
import { formatClassDay } from '@/features/class-booking/time';
import { useTheme } from '@/hooks/use-theme';

export default function ReservationsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { reservedClasses, feedback, feedbackSeverity, cancel, clearFeedback } = useBooking();
  const [classToCancel, setClassToCancel] = useState<string | null>(null);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, Spacing.four),
            paddingBottom: insets.bottom + BottomTabInset + Spacing.five,
          },
          Platform.OS === 'web' && styles.webContent,
        ]}>
        <ThemedText type="subtitle">Mis reservas</ThemedText>
        <ThemedText themeColor="textSecondary">
          Administra las clases a las que vas a asistir.
        </ThemedText>

        {reservedClasses.length === 0 ? (
          <ThemedText accessibilityRole="text" style={styles.empty} themeColor="textSecondary">
            {EMPTY_RESERVATIONS_MESSAGE}
          </ThemedText>
        ) : (
          reservedClasses.map((item) => (
            <ClassCard
              key={item.id}
              scheduledClass={item}
              dayLabel={formatClassDay(item.startAt)}
              actionLabel="Cancelar"
              actionTone="danger"
              onAction={() => setClassToCancel(item.id)}
            />
          ))
        )}
      </ScrollView>

      <CancellationConfirmation
        visible={classToCancel !== null}
        onDismiss={() => setClassToCancel(null)}
        onConfirm={() => {
          if (classToCancel) cancel(classToCancel);
          setClassToCancel(null);
        }}
      />
      <BookingFeedbackOverlay
        message={feedback}
        severity={feedbackSeverity}
        onDismiss={clearFeedback}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  webContent: {
    paddingTop: Spacing.six,
  },
  empty: {
    paddingVertical: Spacing.six,
    textAlign: 'center',
  },
});
