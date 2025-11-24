# 🎯 XP Vision - Aplicativo de Gestão Financeira para Jovens

<div align="center">

![XP Vision Logo](https://img.shields.io/badge/XP%20Vision-Finance%20App-6366F1?style=for-the-badge&logo=react&logoColor=white)

**Transforme suas metas financeiras em realidade**

[![React Native](https://img.shields.io/badge/React%20Native-0.73.6-61DAFB?style=flat-square&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-50.0.21-000020?style=flat-square&logo=expo)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.6.0-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Características Principais](#-características-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Design System](#-design-system)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

O **XP Vision** é um aplicativo mobile desenvolvido para ajudar jovens a gerenciar suas finanças de forma inteligente e alcançar suas metas financeiras. Com uma interface moderna, gamificação e inteligência artificial, o app transforma o controle financeiro em uma experiência motivadora e educativa.

### 🎨 Identidade Visual

O design do XP Vision transmite:
- **Confiança**: Cores sólidas e interface profissional
- **Clareza**: Hierarquia visual bem definida
- **Inteligência**: Design minimalista e tecnológico
- **Tecnologia**: Estética moderna com gradientes e sombras
- **Modernidade**: Componentes atualizados e microinterações

---

## ✨ Características Principais

### 🎯 Gestão de Metas
- Cadastro de metas financeiras personalizadas
- Acompanhamento visual de progresso com speedometer
- Cálculo automático de dias restantes
- Sistema de contribuições para acelerar metas

### 💰 Controle de Transações
- Registro de receitas e despesas
- Categorização automática de gastos
- Sistema anti-apostas com detecção inteligente
- Análise de impacto antes de compras

### 🤖 FinXP - Coach Financeiro IA
- Chat interativo com inteligência artificial (Gemini)
- Respostas personalizadas baseadas nas suas metas
- Sugestões práticas e motivacionais
- Análise de padrões de gastos

### 🎮 Gamificação
- Sistema de desafios semanais
- Badges e conquistas
- Mapa de sabotadores (análise de gastos)
- Progresso visual e feedback positivo

### 📚 Educação Financeira
- Conteúdos educativos categorizados
- Dicas práticas para jovens
- Artigos sobre investimentos, economia e planejamento

### 👥 Comunidade
- Feed de conquistas compartilhadas
- Posts anônimos ou públicos
- Sistema de likes e interação

---

## 🛠 Tecnologias Utilizadas

### Core
- **React Native 0.73.6** - Framework mobile multiplataforma
- **TypeScript 5.3.3** - Tipagem estática
- **Expo 50.0.21** - Plataforma de desenvolvimento

### Navegação
- **React Navigation 6** - Navegação stack e tabs
- **React Native Gesture Handler** - Gestos nativos
- **React Native Reanimated** - Animações performáticas

### Backend & Serviços
- **Firebase 12.6.0**
  - Authentication (Email/Password, Anônimo)
  - Realtime Database
- **Google Gemini API** - Inteligência artificial para o chat

### UI/UX
- **React Native Safe Area Context** - Áreas seguras
- **React Native Screens** - Otimização de telas

---

## 🎨 Design System

### Paleta de Cores

#### Cores Primárias
- **Primary**: `#6366F1` (Indigo) - Confiança e tecnologia
- **Primary Dark**: `#4F46E5`
- **Primary Light**: `#818CF8`
- **Accent**: `#10B981` (Verde Esmeralda) - Crescimento e sucesso

#### Cores Secundárias
- **Secondary**: `#F59E0B` (Âmbar) - Atenção e energia
- **Success**: `#10B981` (Verde)
- **Warning**: `#F59E0B` (Âmbar)
- **Error**: `#EF4444` (Vermelho)
- **Info**: `#3B82F6` (Azul)

#### Neutros
- **Background**: `#0A0A0A` (Preto)
- **Card Background**: `#1F2937` (Cinza escuro)
- **Text Primary**: `#FFFFFF` (Branco)
- **Text Secondary**: `#D1D5DB` (Cinza claro)

### Tipografia

```
Display: 48px (Hero titles)
H1: 38px (Títulos principais)
H2: 30px (Títulos secundários)
H3: 24px (Títulos terciários)
Body: 16px (Texto padrão)
Caption: 12px (Legendas)
```

### Espaçamento

Sistema baseado em múltiplos de 4px:
- `xs`: 4px
- `sm`: 8px
- `md`: 12px
- `base`: 16px
- `lg`: 24px
- `xl`: 32px
- `xxl`: 48px

### Componentes

- **Cards**: Border radius 16px, sombra média
- **Botões**: Border radius 12px, sombra colorida
- **Inputs**: Border radius 12px, padding 16px
- **Modais**: Border radius 24px, overlay escuro

---

## 📁 Estrutura do Projeto

```
xp-vision-app/
├── App.tsx                      # Ponto de entrada
├── app.json                     # Configuração Expo
├── package.json                 # Dependências
├── tsconfig.json                # Config TypeScript
├── google-services.json         # Config Firebase Android
│
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx     # Navegação principal
│   │
│   ├── screens/
│   │   ├── SplashScreen.tsx     # Tela inicial
│   │   ├── LoginScreen.tsx      # Login/Cadastro
│   │   ├── DashboardScreen.tsx  # Dashboard principal
│   │   ├── DreamFormScreen.tsx  # Cadastro de metas
│   │   ├── TransactionsScreen.tsx # Transações
│   │   ├── ChatScreen.tsx       # Chat com FinXP
│   │   ├── EducationalContentScreen.tsx # Educação
│   │   ├── CommunityScreen.tsx  # Comunidade
│   │   ├── BetProtectionScreen.tsx # Proteção apostas
│   │   ├── YOLOSimulatorScreen.tsx # Análise impacto
│   │   ├── ChallengesScreen.tsx # Desafios
│   │   ├── BadgesScreen.tsx     # Badges
│   │   ├── SaboteurMapScreen.tsx # Mapa sabotadores
│   │   └── ProfileQuestionnaireScreen.tsx # Perfil
│   │
│   ├── components/
│   │   ├── XPCard.tsx           # Card reutilizável
│   │   ├── Speedometer.tsx      # Indicador progresso
│   │   ├── TransactionCard.tsx  # Card transação
│   │   ├── MoreMenu.tsx         # Menu mais opções
│   │   └── ContributionModal.tsx # Modal contribuição
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx      # Context autenticação
│   │   └── DreamContext.tsx     # Context metas
│   │
│   ├── services/
│   │   ├── firebaseService.ts   # Serviços Firebase
│   │   ├── geminiService.ts     # Serviço Gemini AI
│   │   ├── betDetectionService.ts # Detecção apostas
│   │   └── dreamCalculationService.ts # Cálculos metas
│   │
│   ├── config/
│   │   └── firebase.ts          # Configuração Firebase
│   │
│   └── theme/
│       └── colors.ts            # Design System
│
└── README.md                    # Este arquivo
```

---

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Conta no Firebase
- API Key do Google Gemini

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <repository-url>
cd xp-vision-app
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Firebase**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Baixe o `google-services.json` e coloque na raiz do projeto
   - Atualize as credenciais em `src/config/firebase.ts`

4. **Configure a API do Gemini**
   - Obtenha uma API Key no [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Atualize a chave em `src/services/geminiService.ts`

5. **Execute o projeto**
```bash
npm start
# ou
expo start
```

6. **Escaneie o QR Code**
   - Use o app Expo Go no seu celular
   - Ou pressione `a` para Android / `i` para iOS no emulador

---

## 📱 Funcionalidades Detalhadas

### 🎯 Dashboard
- Visão geral das metas ativas
- Speedometer com progresso visual
- Botão de contribuição rápida
- Ações rápidas para funcionalidades principais

### 💰 Transações
- Lista de todas as transações
- Filtros por categoria
- Classificação emocional (Necessário, Consciente, Impulsivo, Investimento)
- Swipe actions para categorização rápida
- Detecção automática de apostas

### 🤖 Chat FinXP
- Conversas em tempo real com IA
- Contexto das metas do usuário
- Respostas rápidas (chips)
- Histórico de conversas
- Sugestões personalizadas

### 🛡️ Proteção Anti-Apostas
- Detecção automática de palavras-chave
- Bloqueio opcional de sites
- Histórico de apostas
- Cálculo de dias perdidos
- Desafios anti-apostas

### 📊 Análise de Impacto
- Simulação antes de comprar
- Cálculo de dias atrasados na meta
- Alternativas de uso do dinheiro
- Recomendações do FinXP
- Link direto para chat

### 🎮 Desafios
- Desafios semanais pré-definidos
- Progresso visual
- Badges de conquista
- Histórico de desafios completados

### 📚 Educação Financeira
- Conteúdos categorizados
- Dicas práticas
- Artigos sobre investimentos
- Guias para jovens

### 👥 Comunidade
- Feed de posts
- Posts anônimos ou públicos
- Sistema de likes
- Compartilhamento de conquistas

---

## 🏗 Arquitetura

### Padrões Utilizados

- **Context API**: Gerenciamento de estado global (Auth, Metas)
- **Service Layer**: Separação de lógica de negócio
- **Component-Based**: Componentes reutilizáveis
- **Design System**: Consistência visual

### Fluxo de Dados

```
User Action → Component → Context/Service → Firebase → UI Update
```

### Autenticação

- Firebase Authentication
- Suporte a Email/Password
- Login anônimo (convidado)
- Persistência de sessão

### Armazenamento

- Firebase Realtime Database
- Estrutura hierárquica:
  ```
  users/{uid}/
    - profile
    - dreams (metas)
    - transactions
    - challenges
    - badges
  ```

---

## 🎨 Guia de Estilo

### Princípios de Design

1. **Clareza**: Interface limpa e intuitiva
2. **Consistência**: Componentes padronizados
3. **Feedback**: Respostas visuais imediatas
4. **Acessibilidade**: Contraste adequado e tamanhos de toque

### Componentes Principais

#### XPCard
- Background: `#1F2937`
- Border radius: `16px`
- Padding: `20px`
- Sombra: Média

#### Botões Primários
- Background: `#6366F1`
- Text: Branco
- Border radius: `12px`
- Sombra colorida

#### Inputs
- Background: `#1F2937`
- Border: `2px solid #374151`
- Focus: Border `#6366F1`
- Border radius: `12px`

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga estes passos:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript para tipagem
- Siga o Design System estabelecido
- Mantenha componentes pequenos e reutilizáveis
- Adicione comentários quando necessário
- Teste suas mudanças antes de commitar

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👥 Equipe

Desenvolvido com ❤️ para ajudar jovens a alcançarem suas metas financeiras.

---

## 📞 Contato

Para dúvidas, sugestões ou problemas:
- Abra uma [Issue](https://github.com/seu-usuario/xp-vision-app/issues)
- Entre em contato através do email: [seu-email@exemplo.com]

---

<div align="center">

**Feito com ❤️ usando React Native e Expo**

⭐ Se este projeto te ajudou, considere dar uma estrela!

</div>
