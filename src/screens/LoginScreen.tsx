import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import XPCard from '../components/XPCard';
import { XPColors, XPTypography, XPSpacing, XPBorderRadius, XPShadows } from '../theme/colors';
import { AuthContext } from '../contexts/AuthContext';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { signIn } = React.useContext(AuthContext);

  const handleAuth = async () => {
    if (!isLogin && !name.trim()) {
      Alert.alert('Erro', 'Preencha seu nome');
      return;
    }

    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        // Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Buscar dados do usuário
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();

        signIn({
          uid: user.uid,
          name: userData?.name || user.email?.split('@')[0] || 'Usuário',
          email: user.email || '',
        });

        // @ts-ignore
        navigation.replace('Home');
      } else {
        // Cadastro
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Criar perfil do usuário
        await set(ref(database, `users/${user.uid}`), {
          email: user.email,
          name: name.trim() || user.email?.split('@')[0] || 'Usuário',
          createdAt: new Date().toISOString(),
        });

        signIn({
          uid: user.uid,
          name: name.trim() || user.email?.split('@')[0] || 'Usuário',
          email: user.email || '',
        });

        // @ts-ignore
        navigation.replace('Home');
      }
    } catch (error: any) {
      let errorMessage = 'Ocorreu um erro ao autenticar';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este e-mail já está em uso';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'E-mail inválido';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Senha muito fraca';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta';
      }
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      await set(ref(database, `users/${user.uid}`), {
        name: 'Convidado',
        isAnonymous: true,
        createdAt: new Date().toISOString(),
      });

      signIn({
        uid: user.uid,
        name: 'Convidado',
        email: '',
      });

      // @ts-ignore
      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao entrar como convidado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>🎯</Text>
            </View>
            <Text style={styles.title}>XP Vision</Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Entre na sua conta' : 'Crie sua conta e transforme seus sonhos em realidade'}
            </Text>
          </View>

          <XPCard style={styles.card}>
            {!isLogin && (
              <>
                <Text style={styles.label}>Nome Completo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome"
                  placeholderTextColor={XPColors.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </>
            )}

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={XPColors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder={isLogin ? "Sua senha" : "Mínimo 6 caracteres"}
              placeholderTextColor={XPColors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            {!isLogin && (
              <>
                <Text style={styles.label}>Confirmar Senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite a senha novamente"
                  placeholderTextColor={XPColors.textMuted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </>
            )}

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={XPColors.black} />
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? 'Entrar' : 'Criar Conta'}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              style={[styles.button, styles.buttonAnonymous, loading && styles.buttonDisabled]}
              onPress={handleAnonymousLogin}
              disabled={loading}
            >
              <Text style={styles.buttonAnonymousText}>🚀 Continuar como Convidado</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.switchButton}
              onPress={() => {
                setIsLogin(!isLogin);
                setName('');
                setConfirmPassword('');
              }}
            >
              <Text style={styles.switchText}>
                {isLogin ? 'Não tem conta? Criar conta' : 'Já tem conta? Entrar'}
              </Text>
            </TouchableOpacity>
          </XPCard>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: XPColors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: XPSpacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: XPSpacing.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: XPColors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: XPSpacing.md,
    ...XPShadows.button,
  },
  logo: {
    fontSize: 64,
  },
  title: {
    fontSize: XPTypography.h1,
    fontWeight: XPTypography.bold,
    color: XPColors.yellow,
    marginBottom: XPSpacing.xs,
  },
  subtitle: {
    fontSize: XPTypography.body,
    color: XPColors.textSecondary,
  },
  card: {
    marginBottom: XPSpacing.md,
  },
  label: {
    fontSize: XPTypography.body,
    fontWeight: XPTypography.medium,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.sm,
    marginTop: XPSpacing.md,
  },
  input: {
    backgroundColor: XPColors.grayDark,
    borderRadius: XPBorderRadius.md,
    padding: XPSpacing.md,
    fontSize: XPTypography.body,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.sm,
  },
  button: {
    backgroundColor: XPColors.yellow,
    padding: XPSpacing.md,
    borderRadius: XPBorderRadius.md,
    alignItems: 'center',
    marginTop: XPSpacing.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: XPTypography.body,
    fontWeight: XPTypography.bold,
    color: XPColors.black,
  },
  switchButton: {
    marginTop: XPSpacing.md,
    alignItems: 'center',
  },
  switchText: {
    fontSize: XPTypography.caption,
    color: XPColors.yellow,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: XPSpacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: XPColors.grayMedium,
  },
  dividerText: {
    marginHorizontal: XPSpacing.md,
    fontSize: XPTypography.caption,
    color: XPColors.textMuted,
  },
  buttonAnonymous: {
    backgroundColor: XPColors.grayDark,
    borderWidth: 1,
    borderColor: XPColors.yellow,
  },
  buttonAnonymousText: {
    fontSize: XPTypography.body,
    fontWeight: XPTypography.bold,
    color: XPColors.yellow,
  },
});

export default LoginScreen;

