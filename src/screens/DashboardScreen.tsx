import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DreamContext, Dream } from '../contexts/DreamContext';
import { AuthContext } from '../contexts/AuthContext';
import Speedometer from '../components/Speedometer';
import XPCard from '../components/XPCard';
import ContributionModal from '../components/ContributionModal';
import { XPColors, XPTypography, XPSpacing, XPBorderRadius } from '../theme/colors';
import { dreamCalculationService } from '../services/dreamCalculationService';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const DashboardScreen: React.FC = () => {
  const { dreams, updateDream } = useContext(DreamContext);
  const { user, signOut } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProp>();
  const [contributionModalVisible, setContributionModalVisible] = useState(false);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
            // @ts-ignore
            navigation.replace('Login');
          }
        },
      ]
    );
  };

  const handleBoost = (dream: Dream) => {
    setSelectedDream(dream);
    setContributionModalVisible(true);
  };

  const handleContributionConfirm = (amount: number) => {
    if (!selectedDream) return;
    
    updateDream(selectedDream.id, { currentSaved: selectedDream.currentSaved + amount });
    Alert.alert('Sucesso!', `R$ ${amount.toFixed(2)} adicionados ao seu objetivo! 🎉`);
    setSelectedDream(null);
  };

  const renderDream = (dream: Dream) => {
    const progress = dreamCalculationService.calculateProgress(
      dream.currentSaved,
      dream.targetValue
    );

    return (
      <XPCard key={dream.id} style={styles.dreamCard}>
        <Text style={styles.dreamTitle}>{dream.title}</Text>
        <Text style={styles.dreamValue}>
          R$ {dream.currentSaved.toFixed(2)} / R$ {dream.targetValue.toFixed(2)}
        </Text>
        
        <Speedometer
          progress={progress.percentage}
          daysRemaining={progress.daysRemaining}
          onBoostPress={() => handleBoost(dream)}
        />
      </XPCard>
    );
  };

  if (dreams.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>🎯</Text>
          <Text style={styles.emptyTitle}>Nenhuma meta cadastrada</Text>
          <Text style={styles.emptySubtitle}>
            Adicione sua primeira meta na aba "Metas"
          </Text>
        </View>
      </View>
    );
  }

  const quickActions = [
    { title: 'Análise de Impacto', emoji: '📊', screen: 'YOLOSimulator' as const, color: XPColors.yellow },
    { title: 'Desafios', emoji: '🎯', screen: 'Challenges' as const, color: XPColors.progressGreen },
    { title: 'Proteção', emoji: '🛡️', screen: 'BetProtection' as const, color: XPColors.alertRed },
    { title: 'Sabotadores', emoji: '🗺️', screen: 'SaboteurMap' as const, color: XPColors.categoryImpulse },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
      {user && (
        <View style={styles.userHeader}>
          <Text style={styles.welcomeText}>Olá, {user.name}! 👋</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {dreams.map(renderDream)}
      
      <XPCard style={styles.quickActionsCard}>
        <Text style={styles.quickActionsTitle}>⚡ Ações Rápidas</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickActionButton}
              onPress={() => navigation.navigate(action.screen)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                <Text style={styles.quickActionEmoji}>{action.emoji}</Text>
              </View>
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </XPCard>
      </ScrollView>

      {selectedDream && (
        <ContributionModal
          visible={contributionModalVisible}
          onClose={() => {
            setContributionModalVisible(false);
            setSelectedDream(null);
          }}
          onConfirm={handleContributionConfirm}
          dreamTitle={selectedDream.title}
        />
      )}
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
    paddingBottom: XPSpacing.xl,
  },
  dreamCard: {
    marginBottom: XPSpacing.lg,
  },
  dreamTitle: {
    fontSize: XPTypography.h3,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.xs,
    textAlign: 'center',
  },
  dreamValue: {
    fontSize: XPTypography.h4,
    fontWeight: XPTypography.semiBold,
    color: XPColors.yellow,
    textAlign: 'center',
    marginBottom: XPSpacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: XPSpacing.xl,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: XPSpacing.md,
  },
  emptyTitle: {
    fontSize: XPTypography.h3,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: XPTypography.body,
    color: XPColors.textSecondary,
    textAlign: 'center',
  },
  quickActionsCard: {
    marginTop: XPSpacing.md,
  },
  quickActionsTitle: {
    fontSize: XPTypography.h4,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: XPSpacing.md,
  },
  quickActionButton: {
    width: '47%',
    alignItems: 'center',
    padding: XPSpacing.md,
    backgroundColor: XPColors.grayDark,
    borderRadius: XPBorderRadius.md,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: XPSpacing.sm,
  },
  quickActionText: {
    fontSize: XPTypography.caption,
    color: XPColors.textPrimary,
    textAlign: 'center',
  },
  quickActionEmoji: {
    fontSize: 24,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: XPSpacing.md,
    padding: XPSpacing.md,
    backgroundColor: XPColors.cardBackground,
    borderRadius: XPBorderRadius.lg,
  },
  welcomeText: {
    fontSize: XPTypography.h4,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
  },
  logoutButton: {
    paddingHorizontal: XPSpacing.md,
    paddingVertical: XPSpacing.sm,
    backgroundColor: XPColors.grayDark,
    borderRadius: XPBorderRadius.md,
  },
  logoutText: {
    fontSize: XPTypography.caption,
    color: XPColors.alertRed,
    fontWeight: XPTypography.medium,
  },
});

export default DashboardScreen;