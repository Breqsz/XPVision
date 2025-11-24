import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { XPColors, XPTypography, XPSpacing, XPBorderRadius } from '../theme/colors';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface MoreMenuProps {
  visible: boolean;
  onClose: () => void;
}

const MoreMenu: React.FC<MoreMenuProps> = ({ visible, onClose }) => {
  const navigation = useNavigation<NavigationProp>();

  const menuItems = [
    {
      title: 'Perfil Financeiro',
      emoji: '👤',
      screen: 'ProfileQuestionnaire' as keyof RootStackParamList,
      color: XPColors.progressGreen,
    },
    {
      title: 'Análise de Impacto',
      emoji: '📊',
      screen: 'YOLOSimulator' as keyof RootStackParamList,
      color: XPColors.yellow,
    },
    {
      title: 'Desafios',
      emoji: '🎯',
      screen: 'Challenges' as keyof RootStackParamList,
      color: XPColors.progressGreen,
    },
    {
      title: 'Badges',
      emoji: '🏅',
      screen: 'Badges' as keyof RootStackParamList,
      color: XPColors.yellow,
    },
    {
      title: 'Comunidade',
      emoji: '💬',
      screen: 'Community' as keyof RootStackParamList,
      color: XPColors.categoryTransport,
    },
    {
      title: 'Educação Financeira',
      emoji: '📚',
      screen: 'EducationalContent' as keyof RootStackParamList,
      color: XPColors.categorySubscription,
    },
    {
      title: 'Proteção de Apostas',
      emoji: '🛡️',
      screen: 'BetProtection' as keyof RootStackParamList,
      color: XPColors.alertRed,
    },
    {
      title: 'Mapa de Sabotadores',
      emoji: '🗺️',
      screen: 'SaboteurMap' as keyof RootStackParamList,
      color: XPColors.categoryImpulse,
    },
  ];

  const handlePress = (screen: keyof RootStackParamList) => {
    // Não fechar o modal, apenas navegar
    navigation.navigate(screen);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={() => {
            // Não fechar ao clicar no overlay
          }}
        />
        <View style={styles.menu}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Mais Opções</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handlePress(item.screen)}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <Text style={styles.iconEmoji}>{item.emoji}</Text>
              </View>
              <Text style={styles.menuItemText}>{item.title}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  menu: {
    backgroundColor: XPColors.cardBackground,
    borderTopLeftRadius: XPBorderRadius.xl,
    borderTopRightRadius: XPBorderRadius.xl,
    padding: XPSpacing.md,
    paddingBottom: XPSpacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: XPSpacing.md,
    paddingBottom: XPSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: XPColors.grayMedium,
  },
  headerTitle: {
    fontSize: XPTypography.h3,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: XPSpacing.md,
    marginBottom: XPSpacing.sm,
    borderRadius: XPBorderRadius.md,
    backgroundColor: XPColors.grayDark,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: XPSpacing.md,
  },
  menuItemText: {
    flex: 1,
    fontSize: XPTypography.body,
    color: XPColors.textPrimary,
    fontWeight: XPTypography.medium,
  },
  closeButton: {
    fontSize: 24,
    color: XPColors.textPrimary,
    fontWeight: XPTypography.bold,
  },
  iconEmoji: {
    fontSize: 20,
  },
  chevron: {
    fontSize: 24,
    color: XPColors.textMuted,
    fontWeight: XPTypography.bold,
  },
});

export default MoreMenu;

