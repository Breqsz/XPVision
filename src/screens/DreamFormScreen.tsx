import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { DreamContext } from '../contexts/DreamContext';
import XPCard from '../components/XPCard';
import { XPColors, XPTypography, XPSpacing, XPBorderRadius } from '../theme/colors';

const DreamFormScreen: React.FC = () => {
  const { addDream } = useContext(DreamContext);
  const [title, setTitle] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const handleSubmit = () => {
    if (!title || !targetValue) return;
    addDream({
      id: Date.now().toString(),
      title,
      targetValue: parseFloat(targetValue),
      currentSaved: 0,
      targetDate: targetDate || undefined,
    });
    setTitle('');
    setTargetValue('');
    setTargetDate('');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🎯 Adicionar Meta</Text>
          <Text style={styles.headerSubtitle}>
            Defina sua meta e comece a economizar
          </Text>
        </View>

        <XPCard style={styles.card}>
          <Text style={styles.label}>Título da meta</Text>
          <TextInput
            placeholder="Ex: Viagem para Europa"
            placeholderTextColor={XPColors.textMuted}
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <Text style={styles.label}>Valor da meta (R$)</Text>
          <TextInput
            placeholder="0,00"
            placeholderTextColor={XPColors.textMuted}
            value={targetValue}
            onChangeText={setTargetValue}
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.label}>Data alvo (opcional)</Text>
          <TextInput
            placeholder="DD/MM/AAAA"
            placeholderTextColor={XPColors.textMuted}
            value={targetDate}
            onChangeText={setTargetDate}
            style={styles.input}
          />

          <TouchableOpacity 
            style={[styles.submitButton, (!title || !targetValue) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!title || !targetValue}
          >
            <Text style={styles.submitButtonText}>Salvar Meta</Text>
          </TouchableOpacity>
        </XPCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: XPColors.background,
  },
  scrollContent: {
    padding: XPSpacing.md,
    paddingTop: XPSpacing.xl,
  },
  header: {
    marginBottom: XPSpacing.lg,
  },
  headerTitle: {
    fontSize: XPTypography.h2,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.xs,
  },
  headerSubtitle: {
    fontSize: XPTypography.body,
    color: XPColors.textSecondary,
  },
  card: {
    marginBottom: XPSpacing.md,
  },
  label: {
    fontSize: XPTypography.body,
    fontWeight: XPTypography.medium,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.sm,
    marginTop: XPSpacing.md,
  },
  input: {
    backgroundColor: XPColors.grayDark,
    borderRadius: XPBorderRadius.md,
    padding: XPSpacing.md,
    fontSize: XPTypography.body,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.sm,
  },
  submitButton: {
    backgroundColor: XPColors.yellow,
    padding: XPSpacing.md,
    borderRadius: XPBorderRadius.md,
    alignItems: 'center',
    marginTop: XPSpacing.lg,
  },
  submitButtonDisabled: {
    backgroundColor: XPColors.grayMedium,
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: XPTypography.body,
    fontWeight: XPTypography.bold,
    color: XPColors.black,
  },
});

export default DreamFormScreen;