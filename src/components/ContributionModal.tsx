import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { XPColors, XPTypography, XPSpacing, XPBorderRadius } from '../theme/colors';
import XPCard from './XPCard';

interface ContributionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  dreamTitle: string;
}

const ContributionModal: React.FC<ContributionModalProps> = ({
  visible,
  onClose,
  onConfirm,
  dreamTitle,
}) => {
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const quickAmounts = [10, 50, 100];

  const handleConfirm = () => {
    const amount = selectedAmount || parseFloat(customAmount.replace(',', '.'));
    
    if (!amount || isNaN(amount) || amount <= 0) {
      Alert.alert('Erro', 'Digite um valor válido');
      return;
    }

    onConfirm(amount);
    setCustomAmount('');
    setSelectedAmount(null);
    onClose();
  };

  const handleQuickAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <XPCard style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>💰 Contribuir para seu objetivo</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.dreamTitle}>{dreamTitle}</Text>

          <Text style={styles.label}>Valores rápidos:</Text>
          <View style={styles.quickAmountsContainer}>
            {quickAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.quickAmountButton,
                  selectedAmount === amount && styles.quickAmountButtonActive,
                ]}
                onPress={() => handleQuickAmount(amount)}
              >
                <Text
                  style={[
                    styles.quickAmountText,
                    selectedAmount === amount && styles.quickAmountTextActive,
                  ]}
                >
                  R$ {amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Ou digite um valor personalizado:</Text>
          <TextInput
            style={styles.input}
            value={customAmount}
            onChangeText={(text) => {
              setCustomAmount(text);
              setSelectedAmount(null);
            }}
            placeholder="R$ 0,00"
            placeholderTextColor={XPColors.textMuted}
            keyboardType="numeric"
          />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </XPCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: XPSpacing.lg,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    padding: XPSpacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: XPSpacing.md,
  },
  title: {
    fontSize: XPTypography.h3,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
    flex: 1,
  },
  closeButton: {
    padding: XPSpacing.xs,
  },
  closeButtonText: {
    fontSize: 24,
    color: XPColors.textMuted,
    fontWeight: XPTypography.bold,
  },
  dreamTitle: {
    fontSize: XPTypography.body,
    color: XPColors.yellow,
    marginBottom: XPSpacing.lg,
    fontWeight: XPTypography.semiBold,
  },
  label: {
    fontSize: XPTypography.body,
    color: XPColors.textSecondary,
    marginBottom: XPSpacing.sm,
    fontWeight: XPTypography.medium,
  },
  quickAmountsContainer: {
    flexDirection: 'row',
    gap: XPSpacing.sm,
    marginBottom: XPSpacing.lg,
  },
  quickAmountButton: {
    flex: 1,
    padding: XPSpacing.md,
    borderRadius: XPBorderRadius.md,
    backgroundColor: XPColors.grayDark,
    borderWidth: 2,
    borderColor: XPColors.grayMedium,
    alignItems: 'center',
  },
  quickAmountButtonActive: {
    backgroundColor: XPColors.yellow,
    borderColor: XPColors.yellow,
  },
  quickAmountText: {
    fontSize: XPTypography.body,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
  },
  quickAmountTextActive: {
    color: XPColors.black,
  },
  input: {
    backgroundColor: XPColors.grayDark,
    borderRadius: XPBorderRadius.md,
    padding: XPSpacing.md,
    fontSize: XPTypography.h4,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.lg,
    borderWidth: 2,
    borderColor: XPColors.grayMedium,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: XPSpacing.md,
  },
  button: {
    flex: 1,
    padding: XPSpacing.md,
    borderRadius: XPBorderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: XPColors.grayDark,
    borderWidth: 1,
    borderColor: XPColors.grayMedium,
  },
  cancelButtonText: {
    fontSize: XPTypography.body,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
  },
  confirmButton: {
    backgroundColor: XPColors.yellow,
  },
  confirmButtonText: {
    fontSize: XPTypography.body,
    fontWeight: XPTypography.bold,
    color: XPColors.black,
  },
});

export default ContributionModal;

