# XP Vision App (MVP)

Este repositório contém o código base do **XP Vision**, um aplicativo mobile criado com React Native (Expo) que ajuda jovens a transformar seus sonhos em metas financeiras alcançáveis. O MVP foca no fluxo principal de cadastro de sonhos, acompanhamento de progresso, registro de transações e interação com um coach de IA (FinXP) via chat.

## Principais Tecnologias

- **React Native (Expo)** — base do aplicativo mobile.
- **TypeScript** — tipagem estática para melhor manutenção.
- **React Navigation** — navegação stack + tabs.
- **Context API** — gestão de estado simples para autenticação e sonhos.
- **Firebase (Firestore)** — previsto para armazenamento e autenticação (a ser integrado).
- **Gemini API** — integração com modelo de IA da Google para o chat (substitua `YOUR_API_KEY` em `src/services/geminiService.ts`).

## Estrutura de Pastas

```
xp-vision-app/
├── App.tsx              # ponto de entrada; encapsula providers e navegação
├── app.json             # configuração do Expo
├── package.json         # dependências e scripts
├── tsconfig.json        # configuração do TypeScript
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx    # navegação principal (stack + tabs)
│   ├── contexts/
│   │   ├── AuthContext.tsx     # estado de autenticação (simulado)
│   │   └── DreamContext.tsx    # estado de sonhos
│   ├── screens/
│   │   ├── DashboardScreen.tsx     # lista sonhos e progresso
│   │   ├── DreamFormScreen.tsx     # cadastro/edição de sonhos
│   │   ├── TransactionsScreen.tsx  # feed de transações (mock)
│   │   └── ChatScreen.tsx          # chat com IA
│   └── services/
│       └── geminiService.ts        # chamada à API do Gemini
└── README.md          # você está aqui
```

## Como rodar

1. Tenha o **Node.js** e o **Expo CLI** instalados.
2. Navegue até esta pasta e execute `npm install` para instalar dependências.
3. Rode `expo start` para iniciar o projeto.
4. Escaneie o QR code com o aplicativo Expo Go ou rode em um emulador.

### Atenção

- A integração real com **Firebase** e **Open Finance** ainda não está implementada. Os dados são mockados no estado da aplicação.
- Para habilitar o chat de IA, configure sua chave da API do Gemini no arquivo `src/services/geminiService.ts`.
- As telas de login e autenticação Google/email não foram implementadas; o contexto de Auth está pronto para futura integração.

## Próximos Passos (para as próximas entregas)

1. **Open Finance Real** — conectar API de transações bancárias e categorizar gastos via IA.
2. **Autenticação Firebase** — login com Google/e-mail e armazenamento de dados no Firestore.
3. **Gamificação completa** — implementar badges, streaks e níveis.
4. **Testes e UX** — ajustes no design, acessibilidade e testes de usabilidade.

Boa hackathon!