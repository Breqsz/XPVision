import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import XPCard from '../components/XPCard';
import { XPColors, XPTypography, XPSpacing, XPBorderRadius } from '../theme/colors';
import { Transaction, firebaseService } from '../services/firebaseService';
import { AuthContext } from '../contexts/AuthContext';

interface CategorySummary {
  category: string;
  total: number;
  count: number;
  daysLost: number;
  color: string;
  emoji: string;
}

const SaboteurMapScreen: React.FC = () => {
  const { user } = React.useContext(AuthContext);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [mostCritical, setMostCritical] = useState<CategorySummary | null>(null);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;
    const data = await firebaseService.getTransactions(user.uid);
    const negativeTransactions = data.filter(t => t.amount < 0);
    setTransactions(negativeTransactions);
    calculateCategories(negativeTransactions);
  };

  const calculateCategories = (trans: Transaction[]) => {
    const categoryMap = new Map<string, CategorySummary>();

    trans.forEach(t => {
      const category = getCategoryType(t);
      const existing = categoryMap.get(category.name) || {
        category: category.name,
        total: 0,
        count: 0,
        daysLost: 0,
        color: category.color,
        emoji: category.emoji,
      };

      existing.total += Math.abs(t.amount);
      existing.count += 1;
      existing.daysLost += Math.abs(t.impactDays);

      categoryMap.set(category.name, existing);
    });

    const categoryArray = Array.from(categoryMap.values())
      .sort((a, b) => b.total - a.total);

    setCategories(categoryArray);
    
    if (categoryArray.length > 0) {
      setMostCritical(categoryArray[0]);
    }
  };

  const getCategoryType = (transaction: Transaction) => {
    if (transaction.isBet) {
      return { name: 'Apostas', color: XPColors.categoryBet, emoji: '🎲' };
    }
    
    const cat = transaction.category.toLowerCase();
    if (cat.includes('delivery') || cat.includes('ifood')) {
      return { name: 'Delivery', color: XPColors.categoryDelivery, emoji: '🍔' };
    }
    if (cat.includes('transporte') || cat.includes('uber')) {
      return { name: 'Transporte', color: XPColors.categoryTransport, emoji: '🚗' };
    }
    if (cat.includes('assinatura')) {
      return { name: 'Assinaturas', color: XPColors.categorySubscription, emoji: '📱' };
    }
    if (transaction.emotionTag === 'impulsive') {
      return { name: 'Compras Impulsivas', color: XPColors.categoryImpulse, emoji: '😵' };
    }
    return { name: 'Outros', color: XPColors.textMuted, emoji: '📦' };
  };

  const getMonthTotal = () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return transactions
      .filter(t => t.createdAt >= monthStart)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  const getMonthDaysLost = () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return transactions
      .filter(t => t.createdAt >= monthStart)
      .reduce((sum, t) => sum + Math.abs(t.impactDays), 0);
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🗺️ Mapa de Sabotadores</Text>
        <Text style={styles.headerSubtitle}>
          Identifique o que mais atrasa seu sonho
        </Text>
      </View>

      <XPCard style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total do Mês</Text>
            <Text style={[styles.summaryValue, { color: XPColors.alertRed }]}>
              R$ {getMonthTotal().toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Dias Perdidos</Text>
            <Text style={[styles.summaryValue, { color: XPColors.alertRed }]}>
              {getMonthDaysLost()} dias
            </Text>
          </View>
        </View>
      </XPCard>

      {mostCritical && (
        <XPCard style={[styles.criticalCard, { borderColor: mostCritical.color }]}>
          <Text style={styles.criticalTitle}>⚠️ Categoria Mais Crítica</Text>
          <View style={styles.criticalContent}>
            <Text style={styles.criticalEmoji}>{mostCritical.emoji}</Text>
            <View style={styles.criticalInfo}>
              <Text style={styles.criticalName}>{mostCritical.category}</Text>
              <Text style={styles.criticalAmount}>
                R$ {mostCritical.total.toFixed(2)} este mês
              </Text>
              <Text style={styles.criticalDays}>
                {mostCritical.daysLost} dias perdidos no sonho
              </Text>
            </View>
          </View>
        </XPCard>
      )}

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categorias</Text>
        {categories.map((cat, index) => {
          const percentage = categories.length > 0 
            ? (cat.total / categories.reduce((sum, c) => sum + c.total, 0)) * 100 
            : 0;

          return (
            <XPCard key={index} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryIconContainer}>
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{cat.category}</Text>
                  <Text style={styles.categoryCount}>{cat.count} transações</Text>
                </View>
                <View style={styles.categoryAmount}>
                  <Text style={[styles.categoryValue, { color: cat.color }]}>
                    R$ {cat.total.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.categoryProgress}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${percentage}%`, backgroundColor: cat.color }
                    ]}
                  />
                </View>
                <Text style={styles.categoryDays}>
                  {cat.daysLost} dias perdidos
                </Text>
              </View>
            </XPCard>
          );
        })}
      </View>

      {categories.length === 0 && (
        <XPCard style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            📊 Nenhuma transação negativa encontrada este mês
          </Text>
        </XPCard>
      )}
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
  summaryCard: {
    marginBottom: XPSpacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: XPTypography.caption,
    color: XPColors.textSecondary,
    marginBottom: XPSpacing.xs,
  },
  summaryValue: {
    fontSize: XPTypography.h3,
    fontWeight: XPTypography.bold,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: XPColors.grayMedium,
    marginHorizontal: XPSpacing.md,
  },
  criticalCard: {
    marginBottom: XPSpacing.md,
    borderWidth: 2,
  },
  criticalTitle: {
    fontSize: XPTypography.h4,
    fontWeight: XPTypography.bold,
    color: XPColors.alertRed,
    marginBottom: XPSpacing.md,
  },
  criticalContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  criticalEmoji: {
    fontSize: 48,
    marginRight: XPSpacing.md,
  },
  criticalInfo: {
    flex: 1,
  },
  criticalName: {
    fontSize: XPTypography.h3,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.xs,
  },
  criticalAmount: {
    fontSize: XPTypography.body,
    color: XPColors.textSecondary,
    marginBottom: XPSpacing.xs,
  },
  criticalDays: {
    fontSize: XPTypography.body,
    color: XPColors.alertRed,
    fontWeight: XPTypography.semiBold,
  },
  categoriesSection: {
    marginTop: XPSpacing.md,
  },
  sectionTitle: {
    fontSize: XPTypography.h4,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.md,
  },
  categoryCard: {
    marginBottom: XPSpacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: XPSpacing.md,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: XPColors.grayDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: XPSpacing.md,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: XPTypography.body,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.xs,
  },
  categoryCount: {
    fontSize: XPTypography.caption,
    color: XPColors.textSecondary,
  },
  categoryAmount: {
    alignItems: 'flex-end',
  },
  categoryValue: {
    fontSize: XPTypography.h4,
    fontWeight: XPTypography.bold,
  },
  categoryProgress: {
    marginTop: XPSpacing.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: XPColors.grayDark,
    borderRadius: XPBorderRadius.sm,
    overflow: 'hidden',
    marginBottom: XPSpacing.xs,
  },
  progressFill: {
    height: '100%',
  },
  categoryDays: {
    fontSize: XPTypography.caption,
    color: XPColors.textSecondary,
  },
  emptyCard: {
    alignItems: 'center',
    padding: XPSpacing.xl,
  },
  emptyText: {
    fontSize: XPTypography.body,
    color: XPColors.textSecondary,
    textAlign: 'center',
  },
});

export default SaboteurMapScreen;

