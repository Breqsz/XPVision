import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import XPCard from '../components/XPCard';
import { XPColors, XPTypography, XPSpacing, XPBorderRadius } from '../theme/colors';
import { BetProtection, firebaseService } from '../services/firebaseService';
import { AuthContext } from '../contexts/AuthContext';

const BetProtectionScreen: React.FC = () => {
  const { user } = React.useContext(AuthContext);
  const [protection, setProtection] = useState<BetProtection | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [totalBetMonth, setTotalBetMonth] = useState(0);
  const [daysSinceLastBet, setDaysSinceLastBet] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      loadProtection();
    }
  }, [user]);

  const loadProtection = async () => {
    if (!user) return;
    const data = await firebaseService.getBetProtection(user.uid);
    if (data) {
      setProtection(data);
      setEnabled(data.enabled);
      setTotalBetMonth(data.totalBetMonth);
      if (data.lastBetAt) {
        const days = Math.floor((Date.now() - data.lastBetAt.getTime()) / (1000 * 60 * 60 * 24));
        setDaysSinceLastBet(days);
      }
    } else {
      // Criar novo registro
      const newProtection: BetProtection = {
        uid: user.uid,
        enabled: false,
        totalBetMonth: 0,
      };
      setProtection(newProtection);
    }
  };

  const handleToggle = async (value: boolean) => {
    setEnabled(value);
    if (user && protection) {
      await firebaseService.updateBetProtection(user.uid, { enabled: value });
      setProtection({ ...protection, enabled: value });
    }
  };

  const getSavingsMessage = () => {
    if (totalBetMonth === 0) {
      return 'Nenhuma aposta detectada este mês! 🎉';
    }
    return `Você gastou R$ ${totalBetMonth.toFixed(2)} em apostas este mês.`;
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛡️ Proteção de Apostas</Text>
        <Text style={styles.headerSubtitle}>
          Controle e proteção contra apostas
        </Text>
      </View>

      <XPCard style={styles.card}>
        <View style={styles.toggleContainer}>
          <View>
            <Text style={styles.toggleLabel}>Bloqueio de Apostas</Text>
            <Text style={styles.toggleDescription}>
              Receba alertas quando uma aposta for detectada
            </Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={handleToggle}
            trackColor={{ false: XPColors.grayMedium, true: XPColors.progressGreen }}
            thumbColor={XPColors.white}
          />
        </View>
      </XPCard>

      <XPCard style={styles.card}>
        <Text style={styles.cardTitle}>📊 Estatísticas do Mês</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total em apostas:</Text>
          <Text style={[styles.statValue, { color: XPColors.alertRed }]}>
            R$ {totalBetMonth.toFixed(2)}
          </Text>
        </View>
        {daysSinceLastBet !== null && (
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Dias sem apostar:</Text>
            <Text style={[styles.statValue, { color: XPColors.progressGreen }]}>
              {daysSinceLastBet} dias
            </Text>
          </View>
        )}
        <View style={styles.savingsMessage}>
          <Text style={styles.savingsText}>{getSavingsMessage()}</Text>
        </View>
      </XPCard>

      <XPCard style={styles.card}>
        <Text style={styles.cardTitle}>🎯 Desafios Anti-Apostas</Text>
        <View style={styles.challengeList}>
          <View style={styles.challengeItem}>
            <Text style={styles.challengeEmoji}>🔥</Text>
            <View style={styles.challengeContent}>
              <Text style={styles.challengeTitle}>7 dias sem aposta</Text>
              <Text style={styles.challengeDescription}>
                Complete 7 dias consecutivos sem apostar
              </Text>
            </View>
          </View>
          <View style={styles.challengeItem}>
            <Text style={styles.challengeEmoji}>💪</Text>
            <View style={styles.challengeContent}>
              <Text style={styles.challengeTitle}>Mês limpo</Text>
              <Text style={styles.challengeDescription}>
                Fique um mês inteiro sem apostas
              </Text>
            </View>
          </View>
        </View>
      </XPCard>

      <XPCard style={styles.card}>
        <Text style={styles.cardTitle}>💡 Dicas</Text>
        <View style={styles.tipsList}>
          <Text style={styles.tipItem}>• Bloqueie sites de apostas no navegador</Text>
          <Text style={styles.tipItem}>• Use o Simulador YOLO antes de apostar</Text>
          <Text style={styles.tipItem}>• Converse com o FinXP sobre seus impulsos</Text>
          <Text style={styles.tipItem}>• Participe dos desafios semanais</Text>
        </View>
      </XPCard>
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
  },
  card: {
    marginBottom: XPSpacing.md,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: XPTypography.h4,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.xs,
  },
  toggleDescription: {
    fontSize: XPTypography.caption,
    color: XPColors.textSecondary,
  },
  cardTitle: {
    fontSize: XPTypography.h4,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: XPSpacing.sm,
  },
  statLabel: {
    fontSize: XPTypography.body,
    color: XPColors.textSecondary,
  },
  statValue: {
    fontSize: XPTypography.h4,
    fontWeight: XPTypography.bold,
  },
  savingsMessage: {
    marginTop: XPSpacing.md,
    padding: XPSpacing.md,
    backgroundColor: XPColors.grayDark,
    borderRadius: XPBorderRadius.md,
  },
  savingsText: {
    fontSize: XPTypography.body,
    color: XPColors.textPrimary,
    textAlign: 'center',
  },
  challengeList: {
    gap: XPSpacing.md,
  },
  challengeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: XPSpacing.md,
    backgroundColor: XPColors.grayDark,
    borderRadius: XPBorderRadius.md,
  },
  challengeEmoji: {
    fontSize: 32,
    marginRight: XPSpacing.md,
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: XPTypography.body,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.xs,
  },
  challengeDescription: {
    fontSize: XPTypography.caption,
    color: XPColors.textSecondary,
  },
  tipsList: {
    gap: XPSpacing.sm,
  },
  tipItem: {
    fontSize: XPTypography.body,
    color: XPColors.textSecondary,
    lineHeight: 24,
  },
});

export default BetProtectionScreen;

