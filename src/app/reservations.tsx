import { useState } from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingFeedback } from '@/components/booking-feedback';
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
  const { reservedClasses, feedback, cancel, clearFeedback } = useBooking();
  const [classToCancel, setClassToCancel] = useState<string | null>(null);

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
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

      {feedback && <BookingFeedback message={feedback} onDismiss={clearFeedback} />}

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

      <CancellationConfirmation
        visible={classToCancel !== null}
        onDismiss={() => setClassToCancel(null)}
        onConfirm={() => {
          if (classToCancel) cancel(classToCancel);
          setClassToCancel(null);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
