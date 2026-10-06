import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingFeedbackOverlay } from '@/components/booking-feedback-overlay';
import { ClassCard } from '@/components/class-card';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useBooking } from '@/features/class-booking/booking-context';
import { formatAvailability, hasReservation } from '@/features/class-booking/selectors';
import { formatClassDay } from '@/features/class-booking/time';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {
    gymName,
    memberName,
    upcomingClasses,
    reservations,
    feedback,
    feedbackSeverity,
    book,
    clearFeedback,
  } = useBooking();

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
        <ThemedText type="small" themeColor="textSecondary">
          {gymName}
        </ThemedText>
        <ThemedText type="subtitle">Próximas clases</ThemedText>
        <ThemedText themeColor="textSecondary">Hola, {memberName}</ThemedText>

        {upcomingClasses.map((item) => {
          const availability = formatAvailability(item, reservations);
          return (
            <ClassCard
              key={item.id}
              scheduledClass={item}
              dayLabel={formatClassDay(item.startAt)}
              availability={availability}
              actionLabel={
                hasReservation(item.id, reservations) ? 'Reservar de nuevo' : 'Reservar'
              }
              actionDisabled={availability === 'Llena'}
              onAction={() => book(item.id)}
            />
          );
        })}
      </ScrollView>

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
});
