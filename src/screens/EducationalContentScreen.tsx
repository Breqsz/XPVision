import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import XPCard from '../components/XPCard';
import { XPColors, XPTypography, XPSpacing, XPBorderRadius } from '../theme/colors';

interface Content {
  id: string;
  title: string;
  category: string;
  emoji: string;
  description: string;
  tips: string[];
}

const EDUCATIONAL_CONTENT: Content[] = [
  {
    id: '1',
    title: 'Como começar a economizar',
    category: 'Básico',
    emoji: '💰',
    description: 'Primeiros passos para construir uma base financeira sólida',
    tips: [
      'Crie uma meta clara e específica',
      'Separe pelo menos 10% da sua renda',
      'Use a regra 50/30/20: 50% necessidades, 30% desejos, 20% poupança',
      'Acompanhe seus gastos diariamente',
    ],
  },
  {
    id: '2',
    title: 'Evitando gastos impulsivos',
    category: 'Controle',
    emoji: '🛑',
    description: 'Técnicas para resistir à tentação de compras desnecessárias',
    tips: [
      'Espere 24 horas antes de compras acima de R$ 50',
      'Use a regra dos 10 segundos: respire antes de comprar',
      'Crie uma lista de desejos e revise semanalmente',
      'Pergunte-se: "Isso me aproxima do meu sonho?"',
    ],
  },
  {
    id: '3',
    title: 'Investindo seu primeiro dinheiro',
    category: 'Investimento',
    emoji: '📈',
    description: 'Como fazer seu dinheiro trabalhar para você',
    tips: [
      'Comece com valores pequenos (R$ 50-100)',
      'Considere Tesouro Direto para iniciantes',
      'Diversifique seus investimentos',
      'Invista regularmente, não espere o momento perfeito',
    ],
  },
  {
    id: '4',
    title: 'Construindo um orçamento jovem',
    category: 'Planejamento',
    emoji: '📊',
    description: 'Organize suas finanças mesmo com renda limitada',
    tips: [
      'Liste todas suas receitas e despesas',
      'Priorize gastos essenciais',
      'Use apps para controlar gastos',
      'Revise seu orçamento mensalmente',
    ],
  },
  {
    id: '5',
    title: 'Dívidas: como sair delas',
    category: 'Dívidas',
    emoji: '💳',
    description: 'Estratégias para quitar dívidas e ficar livre',
    tips: [
      'Liste todas as dívidas com juros',
      'Pague primeiro a dívida com maior juro',
      'Negocie com credores',
      'Evite novas dívidas enquanto paga as antigas',
    ],
  },
  {
    id: '6',
    title: 'Renda extra para jovens',
    category: 'Renda',
    emoji: '💼',
    description: 'Formas de aumentar sua renda enquanto estuda',
    tips: [
      'Freelances online (design, escrita, programação)',
      'Venda de produtos usados',
      'Aulas particulares',
      'Trabalhos temporários nos fins de semana',
    ],
  },
];

const EducationalContentScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);

  const categories = Array.from(new Set(EDUCATIONAL_CONTENT.map(c => c.category)));

  const filteredContent = selectedCategory
    ? EDUCATIONAL_CONTENT.filter(c => c.category === selectedCategory)
    : EDUCATIONAL_CONTENT;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
      >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📚 Educação Financeira</Text>
        <Text style={styles.headerSubtitle}>
          Conteúdos práticos para jovens transformarem suas finanças
        </Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        <TouchableOpacity
          style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryChip, selectedCategory === category && styles.categoryChipActive]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredContent.map((content) => (
        <XPCard 
          key={content.id} 
          style={styles.contentCard}
        >
          <View style={styles.contentHeader}>
            <Text style={styles.contentEmoji}>{content.emoji}</Text>
            <View style={styles.contentTitleContainer}>
              <Text style={styles.contentTitle}>{content.title}</Text>
              <Text style={styles.contentCategory}>{content.category}</Text>
            </View>
            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => setExpandedContent(
                expandedContent === content.id ? null : content.id
              )}
            >
              <Text style={styles.expandButtonText}>
                {expandedContent === content.id ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.contentDescription}>{content.description}</Text>

          {expandedContent === content.id && (
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>💡 Dicas Práticas:</Text>
              {content.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}
        </XPCard>
      ))}
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
  categoriesContainer: {
    marginBottom: XPSpacing.md,
  },
  categoriesContent: {
    paddingRight: XPSpacing.md,
  },
  categoryChip: {
    paddingHorizontal: XPSpacing.md,
    paddingVertical: XPSpacing.sm,
    borderRadius: XPBorderRadius.full,
    backgroundColor: XPColors.grayDark,
    marginRight: XPSpacing.sm,
    borderWidth: 1,
    borderColor: XPColors.grayMedium,
  },
  categoryChipActive: {
    backgroundColor: XPColors.yellow,
    borderColor: XPColors.yellow,
  },
  categoryText: {
    fontSize: XPTypography.caption,
    color: XPColors.textSecondary,
    fontWeight: XPTypography.medium,
  },
  categoryTextActive: {
    color: XPColors.black,
    fontWeight: XPTypography.bold,
  },
  contentCard: {
    marginBottom: XPSpacing.md,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: XPSpacing.sm,
  },
  contentEmoji: {
    fontSize: 32,
    marginRight: XPSpacing.md,
  },
  contentTitleContainer: {
    flex: 1,
  },
  contentTitle: {
    fontSize: XPTypography.h4,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.xs,
  },
  contentCategory: {
    fontSize: XPTypography.caption,
    color: XPColors.yellow,
    fontWeight: XPTypography.medium,
  },
  expandButton: {
    padding: XPSpacing.xs,
  },
  expandButtonText: {
    fontSize: 16,
    color: XPColors.textMuted,
  },
  contentDescription: {
    fontSize: XPTypography.body,
    color: XPColors.textSecondary,
    lineHeight: 22,
    marginBottom: XPSpacing.sm,
  },
  tipsContainer: {
    marginTop: XPSpacing.md,
    padding: XPSpacing.md,
    backgroundColor: XPColors.grayDark,
    borderRadius: XPBorderRadius.md,
  },
  tipsTitle: {
    fontSize: XPTypography.body,
    fontWeight: XPTypography.bold,
    color: XPColors.yellow,
    marginBottom: XPSpacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: XPSpacing.sm,
  },
  tipBullet: {
    fontSize: XPTypography.body,
    color: XPColors.yellow,
    marginRight: XPSpacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: XPTypography.body,
    color: XPColors.textPrimary,
    lineHeight: 22,
  },
});

export default EducationalContentScreen;

