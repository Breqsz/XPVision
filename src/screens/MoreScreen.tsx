import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MoreMenu from '../components/MoreMenu';
import { XPColors } from '../theme/colors';

const MoreScreen: React.FC = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  // Sempre mostrar o menu quando a tela estiver em foco
  useFocusEffect(
    React.useCallback(() => {
      setMenuVisible(true);
      return () => {
        setMenuVisible(false);
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <MoreMenu 
        visible={menuVisible} 
        onClose={() => {
          // Voltar para a tela anterior
          // @ts-ignore
          navigation.goBack();
        }} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: XPColors.background,
  },
});

export default MoreScreen;

