import React, { useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import TransactionCard from '../components/TransactionCard';
import { Transaction } from '../services/firebaseService';
import { DreamContext } from '../contexts/DreamContext';
import { betDetectionService } from '../services/betDetectionService';
import { firebaseService } from '../services/firebaseService';
import { XPColors, XPSpacing } from '../theme/colors';

// Mock transactions com dados mais ricos
const mockTransactions: Transaction[] = [
  { 
    id: '1', 
    uid: 'user1',
    amount: -50, 
    category: 'Alimentação', 
    description: 'Supermercado',
    impactDays: -2,
    isBet: false,
    createdAt: new Date(),
  },
  { 
    id: '2', 
    uid: 'user1',
    amount: -120, 
    category: 'Aposta - Bet365', 
    description: 'Bet365 - Futebol',
    impactDays: -5,
    isBet: true,
    realityTrigger: {
      mealsEquivalent: 7,
      dreamDaysLost: 5,
      message: 'Com esse valor você poderia adiantar 5 dias na sua meta.',
    },
    createdAt: new Date(),
  },
  { 
    id: '3', 
    uid: 'user1',
    amount: 200, 
    category: 'Depósito', 
    description: 'Economia mensal',
    impactDays: 7,
    isBet: false,
    createdAt: new Date(),
  },
  {
    id: '4',
    uid: 'user1',
    amount: -35,
    category: 'Delivery - iFood',
    description: 'iFood - Almoço',
    impactDays: -1,
    isBet: false,
    createdAt: new Date(),
  },
];

const TransactionsScreen: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const { dreams } = useContext(DreamContext);

  const handleEmotionTag = async (transactionId: string, emotion: Transaction['emotionTag']) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction || !transaction.uid) return;
    
    try {
      await firebaseService.updateTransaction(transaction.uid, transactionId, { emotionTag: emotion });
      setTransactions(prev => 
        prev.map(t => t.id === transactionId ? { ...t, emotionTag: emotion } : t)
      );
    } catch (error) {
      console.error('Erro ao atualizar emoção:', error);
    }
  };

  const handleSwipeLeft = async (transaction: Transaction) => {
    // Marcar como impulsivo
    await handleEmotionTag(transaction.id, 'impulsive');
  };

  const handleSwipeRight = async (transaction: Transaction) => {
    // Marcar como necessário
    await handleEmotionTag(transaction.id, 'necessary');
  };

  const renderSwipeActions = (transaction: Transaction) => {
    return (
      <View style={styles.swipeActions}>
        <View style={[styles.swipeAction, styles.swipeLeft]}>
          <Text style={styles.swipeText}>😵 Impulsivo</Text>
        </View>
        <View style={[styles.swipeAction, styles.swipeRight]}>
          <Text style={styles.swipeText}>😌 Necessário</Text>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Transaction }) => {
    return (
      <Swipeable
        renderLeftActions={() => (
          <View style={[styles.swipeAction, styles.swipeLeft]}>
            <Text style={styles.swipeText}>😵 Impulsivo</Text>
          </View>
        )}
        renderRightActions={() => (
          <View style={[styles.swipeAction, styles.swipeRight]}>
            <Text style={styles.swipeText}>😌 Necessário</Text>
          </View>
        )}
        onSwipeableLeftOpen={() => handleSwipeLeft(item)}
        onSwipeableRightOpen={() => handleSwipeRight(item)}
      >
        <TransactionCard
          transaction={item}
          onEmotionPress={(emotion) => handleEmotionTag(item.id, emotion)}
        />
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transações</Text>
        <Text style={styles.headerSubtitle}>{transactions.length} transações</Text>
      </View>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: XPColors.background,
  },
  header: {
    padding: XPSpacing.md,
    paddingTop: XPSpacing.xl,
    backgroundColor: XPColors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: XPColors.grayMedium,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: XPColors.textSecondary,
  },
  listContent: {
    padding: XPSpacing.md,
  },
  swipeActions: {
    flexDirection: 'row',
    width: '100%',
  },
  swipeAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  swipeLeft: {
    backgroundColor: XPColors.categoryImpulse,
  },
  swipeRight: {
    backgroundColor: XPColors.categoryNecessary,
  },
  swipeText: {
    color: XPColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TransactionsScreen;