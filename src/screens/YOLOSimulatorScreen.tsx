import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import XPCard from '../components/XPCard';
import { XPColors, XPTypography, XPSpacing, XPBorderRadius } from '../theme/colors';
import { DreamContext } from '../contexts/DreamContext';
import { betDetectionService } from '../services/betDetectionService';
import { dreamCalculationService } from '../services/dreamCalculationService';

const YOLOSimulatorScreen: React.FC = () => {
  const { dreams } = useContext(DreamContext);
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState<{
    daysDelayed: number;
    alternative: string;
    recommendation: string;
    whatCouldBeDone: string[];
  } | null>(null);

  const activeDream = dreams[0];

  const handleCalculate = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      Alert.alert('Erro', 'Digite um valor válido');
      return;
    }

    if (!activeDream) {
      Alert.alert('Aviso', 'Você precisa ter uma meta cadastrada');
      return;
    }

    const impactDays = betDetectionService.calculateImpactDays(
      -value,
      activeDream.targetValue,
      activeDream.currentSaved
    );

    // Exemplos do que poderia ser feito com esse valor
    const alternatives = [
      `Investir em um curso online (R$ ${value.toFixed(2)})`,
      `Fazer uma reserva de emergência (R$ ${value.toFixed(2)})`,
      `Adiantar ${Math.abs(impactDays)} dias na sua meta`,
      `Criar uma reserva para imprevistos`,
    ];
    const alternative = alternatives[Math.floor(Math.random() * alternatives.length)];

    // Recomendação
    let recommendation = '';
    if (value > 100) {
      recommendation = '⚠️ Esse valor é significativo! Considere esperar 24h antes de decidir.';
    } else if (value > 50) {
      recommendation = '💡 Que tal pensar em uma alternativa mais barata?';
    } else {
      recommendation = '✅ Valor razoável, mas sempre vale questionar: realmente preciso disso agora?';
    }

    // O que poderia ser feito com esse valor
    const whatCouldBeDone = [
      `Adiantar ${Math.abs(impactDays)} dias na sua meta`,
      `Criar uma reserva de emergência`,
      `Investir em educação ou desenvolvimento pessoal`,
      `Fazer uma doação para uma causa importante`,
    ];

    setResult({
      daysDelayed: Math.abs(impactDays),
      alternative,
      recommendation,
      whatCouldBeDone,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
      >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Análise de Impacto</Text>
        <Text style={styles.headerSubtitle}>
          Avalie o impacto financeiro antes de realizar uma compra
        </Text>
      </View>

      <XPCard style={styles.card}>
        <Text style={styles.label}>Quanto você está pensando em gastar?</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="R$ 0,00"
          placeholderTextColor={XPColors.textMuted}
          keyboardType="numeric"
        />
        <TouchableOpacity 
          style={styles.calculateButton}
          onPress={handleCalculate}
        >
          <Text style={styles.calculateButtonText}>Calcular Impacto</Text>
        </TouchableOpacity>
      </XPCard>

      {result && (
        <>
          <XPCard style={styles.card}>
            <Text style={styles.resultTitle}>📊 Impacto na Sua Meta</Text>
            
            <View style={styles.resultItem}>
              <Text style={styles.resultEmoji}>⏰</Text>
              <View style={styles.resultContent}>
                <Text style={styles.resultLabel}>Dias Atrasados</Text>
                <Text style={[styles.resultValue, { color: XPColors.alertRed }]}>
                  {result.daysDelayed} dias
                </Text>
              </View>
            </View>

            <View style={styles.resultItem}>
              <Text style={styles.resultEmoji}>💰</Text>
              <View style={styles.resultContent}>
                <Text style={styles.resultLabel}>Valor da Compra</Text>
                <Text style={[styles.resultValue, { color: XPColors.yellow }]}>
                  R$ {parseFloat(amount).toFixed(2)}
                </Text>
              </View>
            </View>
          </XPCard>

          <XPCard style={styles.card}>
            <Text style={styles.resultTitle}>💡 O que você poderia fazer com esse valor</Text>
            {result.whatCouldBeDone.map((item, index) => (
              <View key={index} style={styles.whatCouldBeItem}>
                <Text style={styles.whatCouldBeText}>• {item}</Text>
              </View>
            ))}
          </XPCard>

          <XPCard style={[styles.card, styles.recommendationCard]}>
            <Text style={styles.recommendationTitle}>🎯 Recomendação do FinXP</Text>
            <Text style={styles.recommendationText}>{result.recommendation}</Text>
            <TouchableOpacity 
              style={styles.chatButton}
              onPress={() => {
                // @ts-ignore
                navigation.navigate('Chat', { 
                  initialMessage: `Acabei de analisar uma compra de R$ ${parseFloat(amount).toFixed(2)} que atrasaria minha meta em ${result.daysDelayed} dias. O que você acha?` 
                });
              }}
            >
              <Text style={styles.chatButtonText}>Conversar com FinXP</Text>
            </TouchableOpacity>
          </XPCard>
        </>
      )}

      {!activeDream && (
        <XPCard style={styles.card}>
          <Text style={styles.warningText}>
            ⚠️ Você precisa cadastrar uma meta para usar o simulador
          </Text>
        </XPCard>
      )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: XPColors.background,
  },
  contentContainer: {
    padding: XPSpacing.md,
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
    color: XPColors.textSecondary,
    marginBottom: XPSpacing.sm,
  },
  input: {
    backgroundColor: XPColors.grayDark,
    borderRadius: XPBorderRadius.md,
    padding: XPSpacing.md,
    fontSize: XPTypography.h3,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.md,
  },
  calculateButton: {
    backgroundColor: XPColors.yellow,
    padding: XPSpacing.md,
    borderRadius: XPBorderRadius.md,
    alignItems: 'center',
  },
  calculateButtonText: {
    fontSize: XPTypography.body,
    fontWeight: XPTypography.bold,
    color: XPColors.black,
  },
  resultTitle: {
    fontSize: XPTypography.h4,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.md,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: XPSpacing.md,
    padding: XPSpacing.md,
    backgroundColor: XPColors.grayDark,
    borderRadius: XPBorderRadius.md,
  },
  resultEmoji: {
    fontSize: 32,
    marginRight: XPSpacing.md,
  },
  resultContent: {
    flex: 1,
  },
  resultLabel: {
    fontSize: XPTypography.caption,
    color: XPColors.textSecondary,
    marginBottom: XPSpacing.xs,
  },
  resultValue: {
    fontSize: XPTypography.h3,
    fontWeight: XPTypography.bold,
  },
  alternativeText: {
    fontSize: XPTypography.body,
    color: XPColors.textPrimary,
    lineHeight: 24,
  },
  recommendationCard: {
    backgroundColor: XPColors.grayMedium,
    borderWidth: 1,
    borderColor: XPColors.yellow,
  },
  recommendationTitle: {
    fontSize: XPTypography.h4,
    fontWeight: XPTypography.bold,
    color: XPColors.yellow,
    marginBottom: XPSpacing.sm,
  },
  recommendationText: {
    fontSize: XPTypography.body,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.md,
    lineHeight: 24,
  },
  chatButton: {
    backgroundColor: XPColors.yellow,
    padding: XPSpacing.md,
    borderRadius: XPBorderRadius.md,
    alignItems: 'center',
  },
  chatButtonText: {
    fontSize: XPTypography.body,
    fontWeight: XPTypography.bold,
    color: XPColors.black,
  },
  warningText: {
    fontSize: XPTypography.body,
    color: XPColors.alertRed,
    textAlign: 'center',
  },
  whatCouldBeItem: {
    marginBottom: XPSpacing.sm,
    paddingLeft: XPSpacing.sm,
  },
  whatCouldBeText: {
    fontSize: XPTypography.body,
    color: XPColors.textPrimary,
    lineHeight: 24,
  },
});

export default YOLOSimulatorScreen;

