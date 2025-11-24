import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ref, set } from 'firebase/database';
import { database } from '../config/firebase';
import { AuthContext } from '../contexts/AuthContext';
import XPCard from '../components/XPCard';
import { XPColors, XPTypography, XPSpacing, XPBorderRadius } from '../theme/colors';

const ProfileQuestionnaireScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    monthlyExpenses: '',
    savingsGoal: '',
    currentSavings: '',
    mainExpenseCategory: '',
  });

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado');
      return;
    }

    try {
      const profileData = {
        ...formData,
        monthlyIncome: parseFloat(formData.monthlyIncome) || 0,
        monthlyExpenses: parseFloat(formData.monthlyExpenses) || 0,
        savingsGoal: parseFloat(formData.savingsGoal) || 0,
        currentSavings: parseFloat(formData.currentSavings) || 0,
        updatedAt: new Date().toISOString(),
      };

      await set(ref(database, `users/${user.uid}/profile`), profileData);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao salvar perfil');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={styles.stepTitle}>Qual sua renda mensal?</Text>
            <Text style={styles.stepDescription}>
              Informe sua renda mensal para cálculos mais precisos
            </Text>
            <TextInput
              style={styles.input}
              placeholder="R$ 0,00"
              placeholderTextColor={XPColors.textMuted}
              value={formData.monthlyIncome}
              onChangeText={(text) => setFormData({ ...formData, monthlyIncome: text })}
              keyboardType="numeric"
            />
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.stepTitle}>Quanto você gasta por mês?</Text>
            <Text style={styles.stepDescription}>
              Estime seus gastos mensais totais
            </Text>
            <TextInput
              style={styles.input}
              placeholder="R$ 0,00"
              placeholderTextColor={XPColors.textMuted}
              value={formData.monthlyExpenses}
              onChangeText={(text) => setFormData({ ...formData, monthlyExpenses: text })}
              keyboardType="numeric"
            />
          </View>
        );
      case 3:
        return (
          <View>
            <Text style={styles.stepTitle}>Qual sua meta de economia?</Text>
            <Text style={styles.stepDescription}>
              Quanto você quer economizar por mês?
            </Text>
            <TextInput
              style={styles.input}
              placeholder="R$ 0,00"
              placeholderTextColor={XPColors.textMuted}
              value={formData.savingsGoal}
              onChangeText={(text) => setFormData({ ...formData, savingsGoal: text })}
              keyboardType="numeric"
            />
          </View>
        );
      case 4:
        return (
          <View>
            <Text style={styles.stepTitle}>Quanto você já tem guardado?</Text>
            <Text style={styles.stepDescription}>
              Seu total de economias atuais
            </Text>
            <TextInput
              style={styles.input}
              placeholder="R$ 0,00"
              placeholderTextColor={XPColors.textMuted}
              value={formData.currentSavings}
              onChangeText={(text) => setFormData({ ...formData, currentSavings: text })}
              keyboardType="numeric"
            />
          </View>
        );
      case 5:
        return (
          <View>
            <Text style={styles.stepTitle}>Qual sua maior categoria de gasto?</Text>
            <Text style={styles.stepDescription}>
              Selecione a categoria que mais impacta seu orçamento
            </Text>
            {['Alimentação', 'Transporte', 'Entretenimento', 'Assinaturas', 'Outros'].map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  formData.mainExpenseCategory === category && styles.categoryButtonSelected
                ]}
                onPress={() => setFormData({ ...formData, mainExpenseCategory: category })}
              >
                <Text style={[
                  styles.categoryText,
                  formData.mainExpenseCategory === category && styles.categoryTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📝 Perfil Financeiro</Text>
        <Text style={styles.headerSubtitle}>
          Passo {step} de 5
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / 5) * 100}%` }]} />
        </View>
      </View>

      <XPCard style={styles.card}>
        {renderStep()}
      </XPCard>

      <View style={styles.buttons}>
        {step > 1 && (
          <TouchableOpacity 
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleBack}
          >
            <Text style={styles.buttonSecondaryText}>Voltar</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleNext}
        >
          <Text style={styles.buttonPrimaryText}>
            {step === 5 ? 'Finalizar' : 'Próximo'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    marginBottom: XPSpacing.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: XPColors.grayDark,
    borderRadius: XPBorderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: XPColors.yellow,
  },
  card: {
    marginBottom: XPSpacing.md,
  },
  stepTitle: {
    fontSize: XPTypography.h4,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.sm,
  },
  stepDescription: {
    fontSize: XPTypography.body,
    color: XPColors.textSecondary,
    marginBottom: XPSpacing.md,
  },
  input: {
    backgroundColor: XPColors.grayDark,
    borderRadius: XPBorderRadius.md,
    padding: XPSpacing.md,
    fontSize: XPTypography.body,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.sm,
  },
  categoryButton: {
    backgroundColor: XPColors.grayDark,
    padding: XPSpacing.md,
    borderRadius: XPBorderRadius.md,
    marginBottom: XPSpacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryButtonSelected: {
    borderColor: XPColors.yellow,
    backgroundColor: XPColors.grayMedium,
  },
  categoryText: {
    fontSize: XPTypography.body,
    color: XPColors.textPrimary,
  },
  categoryTextSelected: {
    color: XPColors.yellow,
    fontWeight: XPTypography.bold,
  },
  buttons: {
    flexDirection: 'row',
    gap: XPSpacing.md,
    marginTop: XPSpacing.md,
  },
  button: {
    flex: 1,
    padding: XPSpacing.md,
    borderRadius: XPBorderRadius.md,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: XPColors.yellow,
  },
  buttonSecondary: {
    backgroundColor: XPColors.grayDark,
  },
  buttonPrimaryText: {
    fontSize: XPTypography.body,
    fontWeight: XPTypography.bold,
    color: XPColors.black,
  },
  buttonSecondaryText: {
    fontSize: XPTypography.body,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
  },
});

export default ProfileQuestionnaireScreen;

