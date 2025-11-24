import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { XPColors, XPTypography, XPSpacing } from '../theme/colors';
import { AuthContext } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, loading } = React.useContext(AuthContext);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const hasNavigated = useRef(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Aguardar autenticação terminar e navegar
    if (!loading && !hasNavigated.current) {
      hasNavigated.current = true;
      const timer = setTimeout(() => {
        try {
          const targetScreen = user ? 'Home' : 'Login';
          console.log('Splash: Navegando para', targetScreen);
          // @ts-ignore - navigation.replace pode não estar tipado corretamente
          navigation.replace(targetScreen);
        } catch (error: any) {
          console.error('Erro na navegação:', error);
          // Fallback: tentar navegar para Login
          try {
            // @ts-ignore
            navigation.replace('Login');
          } catch (e: any) {
            console.error('Erro no fallback:', e);
            // Último recurso: tentar reset
            try {
              // @ts-ignore
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (finalError) {
              console.error('Erro final na navegação:', finalError);
            }
          }
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [loading, user, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🎯</Text>
        </View>
        <Text style={styles.logoText}>XP Vision</Text>
        <Text style={styles.tagline}>Transforme sonhos em realidade</Text>
      </Animated.View>
      
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: XPColors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: XPSpacing.xl,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: XPColors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: XPSpacing.lg,
    shadowColor: XPColors.yellow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 16,
  },
  logoEmoji: {
    fontSize: 64,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '800',
    color: XPColors.yellow,
    marginBottom: XPSpacing.xs,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: XPTypography.body,
    color: XPColors.textSecondary,
    fontStyle: 'italic',
  },
  loadingText: {
    fontSize: XPTypography.caption,
    color: XPColors.textMuted,
    marginTop: XPSpacing.xl,
  },
});

export default SplashScreen;

