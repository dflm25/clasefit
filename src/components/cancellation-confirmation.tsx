import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';

type CancellationConfirmationProps = {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
};

export function CancellationConfirmation({
  visible,
  onDismiss,
  onConfirm,
}: CancellationConfirmationProps) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <ThemedView
          accessibilityRole="alert"
          accessibilityViewIsModal
          style={styles.dialog}>
          <ThemedText type="subtitle" style={styles.title}>
            Cancelar reserva
          </ThemedText>
          <ThemedText themeColor="textSecondary">
            ¿Quieres cancelar esta reserva?
          </ThemedText>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onDismiss}
              style={[styles.button, styles.secondaryButton]}>
              <ThemedText type="smallBold">No, conservar</ThemedText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onConfirm}
              style={[styles.button, styles.dangerButton]}>
              <ThemedText type="smallBold" style={styles.dangerText}>
                Sí, cancelar
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  dialog: {
    width: '100%',
    maxWidth: 440,
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  button: {
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#777C85',
  },
  dangerButton: {
    backgroundColor: '#A53838',
  },
  dangerText: {
    color: '#FFFFFF',
  },
});
