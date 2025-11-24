import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { sendMessageToGemini } from '../services/geminiService';
import { XPColors, XPTypography, XPSpacing, XPBorderRadius } from '../theme/colors';
import { DreamContext } from '../contexts/DreamContext';

interface Message {
  id: string;
  text: string;
  from: 'user' | 'ai';
  timestamp: Date;
}

const QUICK_REPLIES = [
  'Como está meu progresso?',
  'Dicas para economizar',
  'Quero um desafio',
  'Resumo do dia',
];

const ChatScreen: React.FC = () => {
  const route = useRoute();
  const initialMessage = (route.params as any)?.initialMessage;
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Olá! Sou o FinXP, seu coach financeiro. Como posso te ajudar hoje? 🚀',
      from: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const { dreams } = useContext(DreamContext);

  useEffect(() => {
    if (initialMessage) {
      setInput(initialMessage);
      // Auto-enviar após um pequeno delay
      setTimeout(() => {
        handleSend(initialMessage);
      }, 500);
    }
  }, [initialMessage]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;
    
    // Se foi enviado via parâmetro, limpar o input
    if (text) {
      setInput('');
    }
    
    const userMessage: Message = { 
      id: Date.now().toString(), 
      text: messageText, 
      from: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    
    try {
      // Contexto do sonho para o Gemini
      const dreamContext = dreams.length > 0 
        ? `O usuário tem um sonho: ${dreams[0].title} (R$ ${dreams[0].currentSaved}/${dreams[0].targetValue}). `
        : '';
      
      const context = dreams.length > 0 ? {
        dreamTitle: dreams[0].title,
        dreamProgress: dreams[0].currentSaved / dreams[0].targetValue,
      } : undefined;
      
      const aiText = await sendMessageToGemini(messageText, context);
      const aiMessage: Message = { 
        id: `${Date.now()}-ai`, 
        text: aiText, 
        from: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const aiMessage: Message = { 
        id: `${Date.now()}-err`, 
        text: 'Desculpe, não consegui responder agora. Tente novamente! 😅', 
        from: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.from === 'user' ? styles.userContainer : styles.aiContainer
    ]}>
      <View style={[
        styles.messageBubble,
        item.from === 'user' ? styles.userBubble : styles.aiBubble
      ]}>
        <Text style={[
          styles.msgText,
          item.from === 'user' ? styles.userText : styles.aiText
        ]}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  const renderQuickReplies = () => {
    if (messages.length > 1) return null; // Só mostra no início
    
    return (
      <View style={styles.quickRepliesContainer}>
        <Text style={styles.quickRepliesLabel}>Respostas rápidas:</Text>
        <View style={styles.quickReplies}>
          {QUICK_REPLIES.map((reply, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickReplyChip}
              onPress={() => handleSend(reply)}
            >
              <Text style={styles.quickReplyText}>{reply}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🤖</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>FinXP</Text>
            <Text style={styles.headerSubtitle}>Seu coach financeiro</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        inverted={false}
        ListFooterComponent={renderQuickReplies}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Pergunte ao FinXP..."
          placeholderTextColor={XPColors.textMuted}
          multiline
          onSubmitEditing={() => handleSend()}
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={() => handleSend()}
          disabled={!input.trim()}
        >
          <Text style={[
            styles.sendButtonText,
            { color: input.trim() ? XPColors.yellow : XPColors.textMuted }
          ]}>
            ➤
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: XPColors.background,
  },
  header: {
    backgroundColor: XPColors.cardBackground,
    padding: XPSpacing.md,
    paddingTop: XPSpacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: XPColors.grayMedium,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: XPColors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: XPSpacing.md,
  },
  avatarText: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: XPTypography.h3,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
  },
  headerSubtitle: {
    fontSize: XPTypography.caption,
    color: XPColors.textSecondary,
  },
  messagesList: {
    padding: XPSpacing.md,
    paddingBottom: XPSpacing.lg,
  },
  messageContainer: {
    marginVertical: XPSpacing.xs,
    maxWidth: '85%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: XPSpacing.md,
    borderRadius: XPBorderRadius.lg,
  },
  userBubble: {
    backgroundColor: XPColors.yellow,
    borderBottomRightRadius: XPBorderRadius.xs,
  },
  aiBubble: {
    backgroundColor: XPColors.cardBackground,
    borderBottomLeftRadius: XPBorderRadius.xs,
  },
  msgText: {
    fontSize: XPTypography.body,
    lineHeight: 20,
  },
  userText: {
    color: XPColors.black,
  },
  aiText: {
    color: XPColors.textPrimary,
  },
  quickRepliesContainer: {
    marginTop: XPSpacing.lg,
  },
  quickRepliesLabel: {
    fontSize: XPTypography.caption,
    color: XPColors.textSecondary,
    marginBottom: XPSpacing.sm,
  },
  quickReplies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: XPSpacing.sm,
  },
  quickReplyChip: {
    backgroundColor: XPColors.cardBackground,
    paddingHorizontal: XPSpacing.md,
    paddingVertical: XPSpacing.sm,
    borderRadius: XPBorderRadius.full,
    borderWidth: 1,
    borderColor: XPColors.grayMedium,
  },
  quickReplyText: {
    fontSize: XPTypography.caption,
    color: XPColors.textPrimary,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: XPSpacing.md,
    backgroundColor: XPColors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: XPColors.grayMedium,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: XPColors.grayDark,
    borderRadius: XPBorderRadius.full,
    paddingHorizontal: XPSpacing.md,
    paddingVertical: XPSpacing.sm,
    fontSize: XPTypography.body,
    color: XPColors.textPrimary,
    maxHeight: 100,
    marginRight: XPSpacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: XPColors.grayDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 20,
    fontWeight: XPTypography.bold,
  },
});

export default ChatScreen;