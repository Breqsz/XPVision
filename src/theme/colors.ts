// XP Vision Design System - Paleta de Cores Moderna e Profissional
// Tema: Finanças, Controle, Futuro, Tecnologia e Educação
export const XPColors = {
  // Cores Primárias - Gradiente Tecnológico
  primary: '#6366F1',        // Indigo vibrante (confiança, tecnologia)
  primaryDark: '#4F46E5',    // Indigo escuro
  primaryLight: '#818CF8',   // Indigo claro
  accent: '#10B981',         // Verde esmeralda (crescimento, sucesso)
  accentDark: '#059669',
  accentLight: '#34D399',
  
  // Cores Secundárias - Apoio Visual
  secondary: '#F59E0B',      // Âmbar (atenção, energia)
  secondaryDark: '#D97706',
  secondaryLight: '#FBBF24',
  
  // Cores de Status
  success: '#10B981',        // Verde (sucesso, progresso)
  warning: '#F59E0B',        // Âmbar (aviso)
  error: '#EF4444',          // Vermelho (erro, alerta)
  info: '#3B82F6',           // Azul (informação)
  
  // Neutros Modernos - Escala de Cinzas Profissional
  black: '#0A0A0A',          // Preto puro
  gray900: '#111827',        // Cinza muito escuro
  gray800: '#1F2937',        // Cinza escuro
  gray700: '#374151',        // Cinza médio-escuro
  gray600: '#4B5563',        // Cinza médio
  gray500: '#6B7280',        // Cinza médio-claro
  gray400: '#9CA3AF',        // Cinza claro
  gray300: '#D1D5DB',        // Cinza muito claro
  gray200: '#E5E7EB',        // Cinza quase branco
  gray100: '#F3F4F6',        // Cinza extremamente claro
  white: '#FFFFFF',          // Branco puro
  
  // Backgrounds - Hierarquia Visual
  background: '#0A0A0A',     // Fundo principal (preto)
  backgroundSecondary: '#111827', // Fundo secundário
  cardBackground: '#1F2937', // Fundo de cards
  cardBackgroundHover: '#374151', // Hover de cards
  surface: '#1F2937',        // Superfície elevada
  
  // Text - Hierarquia Tipográfica
  textPrimary: '#FFFFFF',    // Texto principal
  textSecondary: '#D1D5DB',  // Texto secundário
  textTertiary: '#9CA3AF',   // Texto terciário
  textMuted: '#6B7280',      // Texto desabilitado
  textInverse: '#111827',    // Texto em fundo claro
  
  // Cores de Categoria - Sistema de Tags
  categoryBet: '#EF4444',    // Apostas (vermelho)
  categoryDelivery: '#F59E0B', // Delivery (âmbar)
  categoryTransport: '#3B82F6', // Transporte (azul)
  categoryImpulse: '#EC4899',   // Impulsivo (rosa)
  categorySubscription: '#8B5CF6', // Assinaturas (roxo)
  categoryNecessary: '#10B981',   // Necessário (verde)
  categoryInvestment: '#6366F1',  // Investimento (indigo)
  
  // Gradientes Modernos
  gradientPrimary: ['#6366F1', '#8B5CF6'],      // Indigo → Roxo
  gradientSuccess: ['#10B981', '#059669'],      // Verde → Verde escuro
  gradientWarning: ['#F59E0B', '#D97706'],      // Âmbar → Âmbar escuro
  gradientError: ['#EF4444', '#DC2626'],        // Vermelho → Vermelho escuro
  
  // Cores Legacy (compatibilidade)
  yellow: '#F59E0B',         // Mapeado para secondary
  grayDark: '#1F2937',       // Mapeado para cardBackground
  grayMedium: '#374151',     // Mapeado para cardBackgroundHover
  progressGreen: '#10B981',  // Mapeado para success
  alertRed: '#EF4444',       // Mapeado para error
};

export const XPTypography = {
  // Tamanhos - Escala Tipográfica Moderna (1.25 ratio)
  display: 48,      // Títulos hero/display
  h1: 38,           // Título principal
  h2: 30,           // Título secundário
  h3: 24,           // Título terciário
  h4: 19,           // Título quaternário
  h5: 15,           // Subtítulo
  body: 16,         // Corpo de texto
  bodySmall: 14,    // Corpo pequeno
  caption: 12,      // Legenda
  overline: 10,     // Overline/uppercase
  
  // Pesos - Hierarquia de Peso
  black: '900',     // Extra bold
  bold: '700',      // Bold
  semiBold: '600',  // Semi bold
  medium: '500',    // Medium
  regular: '400',   // Regular
  light: '300',     // Light
  
  // Line Heights - Legibilidade
  lineHeightTight: 1.2,    // Títulos
  lineHeightNormal: 1.5,   // Corpo
  lineHeightRelaxed: 1.75, // Texto longo
  
  // Letter Spacing
  letterSpacingTight: -0.5,
  letterSpacingNormal: 0,
  letterSpacingWide: 0.5,
  letterSpacingWider: 1,
};

export const XPSpacing = {
  // Espaçamento Base: 4px (sistema 4pt grid)
  none: 0,
  xs: 4,      // 0.25rem
  sm: 8,      // 0.5rem
  md: 12,     // 0.75rem
  base: 16,   // 1rem (base)
  lg: 24,     // 1.5rem
  xl: 32,     // 2rem
  xxl: 48,    // 3rem
  xxxl: 64,   // 4rem
  
  // Espaçamento Específico
  cardPadding: 20,
  screenPadding: 16,
  sectionSpacing: 32,
  elementGap: 12,
};

export const XPBorderRadius = {
  // Border Radius - Sistema Moderno
  none: 0,
  sm: 6,       // Pequeno (badges, tags)
  md: 12,      // Médio (botões, inputs)
  lg: 16,      // Grande (cards pequenos)
  xl: 20,      // Extra grande (cards grandes)
  xxl: 24,     // Muito grande (modais)
  full: 9999,  // Círculo completo
  
  // Border Radius Específico
  button: 12,
  card: 16,
  input: 12,
  modal: 24,
  avatar: 9999,
};

export const XPShadows = {
  // Sistema de Sombras - Elevação Material Design
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 16,
  },
  // Sombras Coloridas - Feedback Visual
  primary: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  success: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  // Legacy (compatibilidade)
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
};

// Animações - Timing e Easing
export const XPAnimations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// Breakpoints (para responsividade futura)
export const XPBreakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
};

