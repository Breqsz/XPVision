import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import XPCard from '../components/XPCard';
import { XPColors, XPTypography, XPSpacing, XPBorderRadius } from '../theme/colors';
import { Challenge, firebaseService } from '../services/firebaseService';
import { AuthContext } from '../contexts/AuthContext';

const CHALLENGE_TEMPLATES = [
  {
    type: 'no_ifood' as const,
    title: '3 dias sem iFood',
    description: 'Fique 3 dias sem pedir delivery',
    target: 3,
    emoji: '🍔',
  },
  {
    type: 'no_bet' as const,
    title: '7 dias sem aposta',
    description: 'Fique uma semana sem apostar',
    target: 7,
    emoji: '🎲',
  },
  {
    type: 'save_money' as const,
    title: 'Guardar R$ 30 essa semana',
    description: 'Economize R$ 30 até o final da semana',
    target: 30,
    emoji: '💰',
  },
];

const ChallengesScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    if (user) {
      loadChallenges();
    }
  }, [user]);

  const loadChallenges = async () => {
    if (!user) return;
    const data = await firebaseService.getChallenges(user.uid);
    setChallenges(data);
  };

  const handleStartChallenge = async (template: typeof CHALLENGE_TEMPLATES[0]) => {
    if (!user) return;
    
    try {
      const newChallenge: Omit<Challenge, 'id' | 'createdAt'> = {
        uid: user.uid,
        type: template.type,
        progress: 0,
        target: template.target,
        completed: false,
      };

      await firebaseService.addChallenge(newChallenge);
      Alert.alert('Sucesso', 'Desafio iniciado!');
      loadChallenges();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao iniciar desafio');
    }
  };

  const handleUpdateProgress = async (challenge: Challenge, increment: number) => {
    if (!user) return;
    
    try {
      const newProgress = Math.min(challenge.progress + increment, challenge.target);
      const isCompleted = newProgress >= challenge.target;
      
      await firebaseService.updateChallenge(user.uid, challenge.id, {
        progress: newProgress,
        completed: isCompleted,
      });
      
      if (isCompleted && !challenge.completed) {
        Alert.alert('Parabéns!', 'Você completou o desafio! 🎉');
      }
      
      loadChallenges();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao atualizar progresso');
    }
  };

  const getProgressPercentage = (challenge: Challenge) => {
    return Math.min((challenge.progress / challenge.target) * 100, 100);
  };

  const renderChallenge = (challenge: Challenge) => {
    const template = CHALLENGE_TEMPLATES.find(t => t.type === challenge.type);
    if (!template) return null;

    const progress = getProgressPercentage(challenge);

    return (
      <XPCard key={challenge.id} style={styles.challengeCard}>
        <View style={styles.challengeHeader}>
          <Text style={styles.challengeEmoji}>{template.emoji}</Text>
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeTitle}>{template.title}</Text>
            <Text style={styles.challengeDescription}>{template.description}</Text>
          </View>
          {challenge.completed && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓</Text>
            </View>
          )}
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${progress}%` },
                challenge.completed && { backgroundColor: XPColors.progressGreen }
              ]}
            />
          </View>
          <View style={styles.progressActions}>
            <Text style={styles.progressText}>
              {challenge.progress} / {challenge.target}
            </Text>
            {!challenge.completed && (
              <TouchableOpacity
                style={styles.incrementButton}
                onPress={() => handleUpdateProgress(challenge, 1)}
              >
                <Text style={styles.incrementButtonText}>+1</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </XPCard>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎯 Desafios Semanais</Text>
        <Text style={styles.headerSubtitle}>
          Complete desafios e ganhe badges!
        </Text>
      </View>

      {challenges.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meus Desafios</Text>
          {challenges.map(renderChallenge)}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Novos Desafios</Text>
        {CHALLENGE_TEMPLATES.map((template) => {
          const hasActiveChallenge = challenges.some(
            c => c.type === template.type && !c.completed
          );
          
          return (
            <XPCard key={template.type} style={styles.templateCard}>
              <View style={styles.templateHeader}>
                <Text style={styles.templateEmoji}>{template.emoji}</Text>
                <View style={styles.templateInfo}>
                  <Text style={styles.templateTitle}>{template.title}</Text>
                  <Text style={styles.templateDescription}>{template.description}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.startButton,
                  hasActiveChallenge && styles.startButtonDisabled
                ]}
                onPress={() => handleStartChallenge(template)}
                disabled={hasActiveChallenge}
              >
                <Text style={styles.startButtonText}>
                  {hasActiveChallenge ? 'Já em andamento' : 'Iniciar Desafio'}
                </Text>
              </TouchableOpacity>
            </XPCard>
          );
        })}
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
  },
  section: {
    marginBottom: XPSpacing.xl,
  },
  sectionTitle: {
    fontSize: XPTypography.h4,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.md,
  },
  challengeCard: {
    marginBottom: XPSpacing.md,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: XPSpacing.md,
  },
  challengeEmoji: {
    fontSize: 32,
    marginRight: XPSpacing.md,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: XPTypography.h4,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.xs,
  },
  challengeDescription: {
    fontSize: XPTypography.caption,
    color: XPColors.textSecondary,
  },
  completedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: XPColors.progressGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    color: XPColors.white,
    fontSize: 20,
    fontWeight: XPTypography.bold,
  },
  progressContainer: {
    marginTop: XPSpacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: XPColors.grayDark,
    borderRadius: XPBorderRadius.sm,
    overflow: 'hidden',
    marginBottom: XPSpacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: XPColors.yellow,
  },
  progressText: {
    fontSize: XPTypography.caption,
    color: XPColors.textSecondary,
    flex: 1,
  },
  progressActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: XPSpacing.xs,
  },
  incrementButton: {
    backgroundColor: XPColors.yellow,
    paddingHorizontal: XPSpacing.md,
    paddingVertical: XPSpacing.xs,
    borderRadius: XPBorderRadius.sm,
  },
  incrementButtonText: {
    fontSize: XPTypography.caption,
    fontWeight: XPTypography.bold,
    color: XPColors.black,
  },
  templateCard: {
    marginBottom: XPSpacing.md,
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: XPSpacing.md,
  },
  templateEmoji: {
    fontSize: 32,
    marginRight: XPSpacing.md,
  },
  templateInfo: {
    flex: 1,
  },
  templateTitle: {
    fontSize: XPTypography.h4,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.xs,
  },
  templateDescription: {
    fontSize: XPTypography.caption,
    color: XPColors.textSecondary,
  },
  startButton: {
    backgroundColor: XPColors.yellow,
    padding: XPSpacing.md,
    borderRadius: XPBorderRadius.md,
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: XPColors.grayMedium,
    opacity: 0.5,
  },
  startButtonText: {
    fontSize: XPTypography.body,
    fontWeight: XPTypography.bold,
    color: XPColors.black,
  },
});

export default ChallengesScreen;

