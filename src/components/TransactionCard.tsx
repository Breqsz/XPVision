import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { XPColors, XPTypography, XPSpacing, XPBorderRadius } from '../theme/colors';
import { Transaction } from '../services/firebaseService';

interface TransactionCardProps {
  transaction: Transaction;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onEmotionPress?: (emotion: Transaction['emotionTag']) => void;
}

const getCategoryColor = (category: string, isBet: boolean): string => {
  if (isBet) return XPColors.categoryBet;
  
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('delivery') || categoryLower.includes('ifood')) {
    return XPColors.categoryDelivery;
  }
  if (categoryLower.includes('transporte') || categoryLower.includes('uber')) {
    return XPColors.categoryTransport;
  }
  if (categoryLower.includes('assinatura') || categoryLower.includes('netflix')) {
    return XPColors.categorySubscription;
  }
  if (categoryLower.includes('necessário') || categoryLower.includes('alimentação')) {
    return XPColors.categoryNecessary;
  }
  return XPColors.categoryImpulse;
};

const getEmotionEmoji = (emotion?: Transaction['emotionTag']): string => {
  switch (emotion) {
    case 'necessary': return '😌';
    case 'conscious_pleasure': return '😋';
    case 'impulsive': return '😵';
    case 'investment': return '🎯';
    default: return '';
  }
};

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onEmotionPress,
}) => {
  const isNegative = transaction.amount < 0;
  const categoryColor = getCategoryColor(transaction.category, transaction.isBet);
  const emotionEmoji = getEmotionEmoji(transaction.emotionTag);

  return (
    <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: categoryColor }]}>
      <View style={styles.header}>
        <View style={styles.amountContainer}>
          <Text style={[
            styles.amount,
            { color: isNegative ? XPColors.alertRed : XPColors.progressGreen }
          ]}>
            {isNegative ? `-R$ ${Math.abs(transaction.amount).toFixed(2)}` : `+R$ ${transaction.amount.toFixed(2)}`}
          </Text>
          {transaction.isBet && (
            <View style={styles.betTag}>
              <Text style={styles.betTagText}>🎲 APOSTA</Text>
            </View>
          )}
        </View>
        {emotionEmoji && (
          <TouchableOpacity 
            style={styles.emotionButton}
            onPress={() => onEmotionPress?.(transaction.emotionTag)}
          >
            <Text style={styles.emotionEmoji}>{emotionEmoji}</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.category}>{transaction.category}</Text>
      {transaction.description && (
        <Text style={styles.description}>{transaction.description}</Text>
      )}

      <View style={styles.footer}>
        <View style={styles.impactContainer}>
          <Text style={styles.impactLabel}>Impacto:</Text>
          <Text style={[
            styles.impactDays,
            { color: transaction.impactDays < 0 ? XPColors.alertRed : XPColors.progressGreen }
          ]}>
            {transaction.impactDays > 0 ? '+' : ''}{transaction.impactDays} dias
          </Text>
        </View>

        {transaction.realityTrigger && (
          <View style={styles.realityTrigger}>
            <Text style={styles.realityText}>💡 {transaction.realityTrigger.message}</Text>
          </View>
        )}
      </View>

      {!transaction.emotionTag && (
        <View style={styles.emotionSelector}>
          <Text style={styles.emotionLabel}>Classificar:</Text>
          <View style={styles.emotionButtons}>
            <TouchableOpacity 
              style={styles.emotionOption}
              onPress={() => onEmotionPress?.('necessary')}
            >
              <Text style={styles.emotionOptionText}>😌 Necessário</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.emotionOption}
              onPress={() => onEmotionPress?.('conscious_pleasure')}
            >
              <Text style={styles.emotionOptionText}>😋 Prazer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.emotionOption}
              onPress={() => onEmotionPress?.('impulsive')}
            >
              <Text style={styles.emotionOptionText}>😵 Impulsivo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.emotionOption}
              onPress={() => onEmotionPress?.('investment')}
            >
              <Text style={styles.emotionOptionText}>🎯 Investimento</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: XPColors.cardBackground,
    borderRadius: XPBorderRadius.lg,
    padding: XPSpacing.md,
    marginBottom: XPSpacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: XPSpacing.sm,
  },
  amountContainer: {
    flex: 1,
  },
  amount: {
    fontSize: XPTypography.h3,
    fontWeight: XPTypography.bold,
    marginBottom: XPSpacing.xs,
  },
  betTag: {
    backgroundColor: XPColors.categoryBet,
    paddingHorizontal: XPSpacing.sm,
    paddingVertical: XPSpacing.xs,
    borderRadius: XPBorderRadius.sm,
    alignSelf: 'flex-start',
  },
  betTagText: {
    fontSize: XPTypography.small,
    fontWeight: XPTypography.bold,
    color: XPColors.white,
  },
  emotionButton: {
    padding: XPSpacing.xs,
  },
  emotionEmoji: {
    fontSize: 24,
  },
  category: {
    fontSize: XPTypography.body,
    color: XPColors.textSecondary,
    marginBottom: XPSpacing.xs,
  },
  description: {
    fontSize: XPTypography.caption,
    color: XPColors.textMuted,
    marginBottom: XPSpacing.sm,
  },
  footer: {
    marginTop: XPSpacing.sm,
  },
  impactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: XPSpacing.xs,
  },
  impactLabel: {
    fontSize: XPTypography.caption,
    color: XPColors.textSecondary,
    marginRight: XPSpacing.xs,
  },
  impactDays: {
    fontSize: XPTypography.body,
    fontWeight: XPTypography.bold,
  },
  realityTrigger: {
    backgroundColor: XPColors.grayMedium,
    padding: XPSpacing.sm,
    borderRadius: XPBorderRadius.md,
    marginTop: XPSpacing.xs,
  },
  realityText: {
    fontSize: XPTypography.caption,
    color: XPColors.textSecondary,
  },
  emotionSelector: {
    marginTop: XPSpacing.md,
    paddingTop: XPSpacing.md,
    borderTopWidth: 1,
    borderTopColor: XPColors.grayMedium,
  },
  emotionLabel: {
    fontSize: XPTypography.caption,
    color: XPColors.textSecondary,
    marginBottom: XPSpacing.sm,
  },
  emotionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: XPSpacing.xs,
  },
  emotionOption: {
    backgroundColor: XPColors.grayMedium,
    paddingHorizontal: XPSpacing.sm,
    paddingVertical: XPSpacing.xs,
    borderRadius: XPBorderRadius.md,
  },
  emotionOptionText: {
    fontSize: XPTypography.small,
    color: XPColors.textPrimary,
  },
});

export default TransactionCard;

