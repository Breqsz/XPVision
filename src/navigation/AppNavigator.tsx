import React, { useContext } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import DreamFormScreen from '../screens/DreamFormScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import ChatScreen from '../screens/ChatScreen';
import BetProtectionScreen from '../screens/BetProtectionScreen';
import YOLOSimulatorScreen from '../screens/YOLOSimulatorScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import BadgesScreen from '../screens/BadgesScreen';
import SaboteurMapScreen from '../screens/SaboteurMapScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileQuestionnaireScreen from '../screens/ProfileQuestionnaireScreen';
import SplashScreen from '../screens/SplashScreen';
import CommunityScreen from '../screens/CommunityScreen';
import EducationalContentScreen from '../screens/EducationalContentScreen';
import MoreScreen from '../screens/MoreScreen';
import { XPColors } from '../theme/colors';
import { AuthContext } from '../contexts/AuthContext';

// Helper function to get emoji icons (fallback que não depende de fontes)
const getTabIconEmoji = (routeName: string): string => {
  switch (routeName) {
    case 'Dashboard':
      return '🏠';
    case 'Dreams':
      return '➕';
    case 'Transactions':
      return '📋';
    case 'Chat':
      return '💬';
    case 'More':
      return '☰';
    default:
      return '🏠';
  }
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  DreamForm: undefined;
  BetProtection: undefined;
  YOLOSimulator: undefined;
  Challenges: undefined;
  Badges: undefined;
  SaboteurMap: undefined;
  ProfileQuestionnaire: undefined;
  Community: undefined;
  EducationalContent: undefined;
  Chat: { initialMessage?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: XPColors.yellow,
        tabBarInactiveTintColor: XPColors.textMuted,
        tabBarStyle: {
          backgroundColor: XPColors.cardBackground,
          borderTopColor: XPColors.grayMedium,
        },
        tabBarIcon: ({ color, size }) => {
          const emoji = getTabIconEmoji(route.name);
          return (
            <Text style={{ fontSize: size, color }}>
              {emoji}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Dreams" component={DreamFormScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{ tabBarLabel: 'FinXP' }}
      />
      <Tab.Screen 
        name="More" 
        component={MoreScreen}
        options={{ tabBarLabel: 'Mais' }}
      />
    </Tab.Navigator>
  );
}

const AppNavigator: React.FC = () => {
  const { user, loading } = useContext(AuthContext);

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: true,
        headerStyle: {
          backgroundColor: XPColors.cardBackground,
        },
        headerTintColor: XPColors.textPrimary,
        headerTitleStyle: {
          color: XPColors.textPrimary,
        },
      }}
      initialRouteName="Splash"
    >
      <Stack.Screen 
        name="Splash" 
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Home" 
        component={HomeTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="BetProtection" 
        component={BetProtectionScreen}
        options={{ title: 'Proteção de Apostas' }}
      />
      <Stack.Screen 
        name="YOLOSimulator" 
        component={YOLOSimulatorScreen}
        options={{ title: 'Análise de Impacto' }}
      />
      <Stack.Screen 
        name="Challenges" 
        component={ChallengesScreen}
        options={{ title: 'Desafios' }}
      />
      <Stack.Screen 
        name="Badges" 
        component={BadgesScreen}
        options={{ title: 'Badges' }}
      />
      <Stack.Screen 
        name="SaboteurMap" 
        component={SaboteurMapScreen}
        options={{ title: 'Mapa de Sabotadores' }}
      />
      <Stack.Screen 
        name="ProfileQuestionnaire" 
        component={ProfileQuestionnaireScreen}
        options={{ title: 'Perfil Financeiro' }}
      />
      <Stack.Screen 
        name="Community" 
        component={CommunityScreen}
        options={{ title: 'Comunidade' }}
      />
      <Stack.Screen 
        name="EducationalContent" 
        component={EducationalContentScreen}
        options={{ title: 'Educação Financeira' }}
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{ title: 'FinXP Chat' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;