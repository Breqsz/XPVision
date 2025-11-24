import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import XPCard from '../components/XPCard';
import { XPColors, XPTypography, XPSpacing, XPBorderRadius } from '../theme/colors';
import { Badge, firebaseService } from '../services/firebaseService';
import { AuthContext } from '../contexts/AuthContext';

const BADGE_TYPES = {
  no_bet_7days: {
    title: '7 Dias Limpos',
    description: 'Ficou 7 dias sem apostar',
    emoji: '🎲',
    color: XPColors.progressGreen,
  },
  first_contribution: {
    title: 'Primeiro Passo',
    description: 'Fez sua primeira contribuição',
    emoji: '🌟',
    color: XPColors.yellow,
  },
  no_impulse_7days: {
    title: 'Controle Total',
    description: '7 dias sem gastos impulsivos',
    emoji: '💪',
    color: XPColors.progressGreen,
  },
  weekly_challenge: {
    title: 'Desafiador',
    description: 'Completou um desafio semanal',
    emoji: '🏆',
    color: XPColors.yellow,
  },
};

const BadgesScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    if (user) {
      loadBadges();
    }
  }, [user]);

  const loadBadges = async () => {
    if (!user) return;
    const data = await firebaseService.getBadges(user.uid);
    setBadges(data);
  };

  const hasBadge = (type: Badge['type']) => {
    return badges.some(b => b.type === type);
  };

  const renderBadge = (type: Badge['type'], earned: boolean) => {
    const badgeInfo = BADGE_TYPES[type];
    if (!badgeInfo) return null;

    return (
      <XPCard 
        key={type}
        style={[
          styles.badgeCard,
          !earned && styles.badgeCardLocked
        ]}
      >
        <View style={styles.badgeContent}>
          <View style={[
            styles.badgeIcon,
            { backgroundColor: earned ? badgeInfo.color : XPColors.grayMedium }
          ]}>
            <Text style={styles.badgeEmoji}>
              {earned ? badgeInfo.emoji : '🔒'}
            </Text>
          </View>
          <View style={styles.badgeInfo}>
            <Text style={[
              styles.badgeTitle,
              !earned && styles.badgeTitleLocked
            ]}>
              {badgeInfo.title}
            </Text>
            <Text style={[
              styles.badgeDescription,
              !earned && styles.badgeDescriptionLocked
            ]}>
              {badgeInfo.description}
            </Text>
            {earned && (
              <Text style={styles.badgeEarned}>
                Conquistado em {new Date(badges.find(b => b.type === type)!.earnedAt).toLocaleDateString('pt-BR')}
              </Text>
            )}
          </View>
        </View>
      </XPCard>
    );
  };

  const earnedCount = badges.length;
  const totalCount = Object.keys(BADGE_TYPES).length;

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏅 Badges</Text>
        <Text style={styles.headerSubtitle}>
          {earnedCount} de {totalCount} badges conquistados
        </Text>
      </View>

      <XPCard style={styles.statsCard}>
        <View style={styles.statsContent}>
          <Text style={styles.statsNumber}>{earnedCount}</Text>
          <Text style={styles.statsLabel}>Badges Conquistados</Text>
        </View>
        <View style={styles.statsDivider} />
        <View style={styles.statsContent}>
          <Text style={styles.statsNumber}>{totalCount - earnedCount}</Text>
          <Text style={styles.statsLabel}>Para Conquistar</Text>
        </View>
      </XPCard>

      <View style={styles.badgesList}>
        {(Object.keys(BADGE_TYPES) as Badge['type'][]).map(type => 
          renderBadge(type, hasBadge(type))
        )}
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
  statsCard: {
    flexDirection: 'row',
    marginBottom: XPSpacing.lg,
  },
  statsContent: {
    flex: 1,
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: XPTypography.h1,
    fontWeight: XPTypography.bold,
    color: XPColors.yellow,
    marginBottom: XPSpacing.xs,
  },
  statsLabel: {
    fontSize: XPTypography.caption,
    color: XPColors.textSecondary,
  },
  statsDivider: {
    width: 1,
    backgroundColor: XPColors.grayMedium,
    marginHorizontal: XPSpacing.md,
  },
  badgesList: {
    gap: XPSpacing.md,
  },
  badgeCard: {
    marginBottom: XPSpacing.md,
  },
  badgeCardLocked: {
    opacity: 0.6,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: XPSpacing.md,
  },
  badgeEmoji: {
    fontSize: 32,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: XPTypography.h4,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.xs,
  },
  badgeTitleLocked: {
    color: XPColors.textMuted,
  },
  badgeDescription: {
    fontSize: XPTypography.caption,
    color: XPColors.textSecondary,
    marginBottom: XPSpacing.xs,
  },
  badgeDescriptionLocked: {
    color: XPColors.textMuted,
  },
  badgeEarned: {
    fontSize: XPTypography.small,
    color: XPColors.progressGreen,
    marginTop: XPSpacing.xs,
  },
});

export default BadgesScreen;

