import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ref, push, onValue, off, set } from 'firebase/database';
import { database } from '../config/firebase';
import { AuthContext } from '../contexts/AuthContext';
import XPCard from '../components/XPCard';
import { XPColors, XPTypography, XPSpacing, XPBorderRadius } from '../theme/colors';

interface Post {
  id: string;
  author: string;
  authorId: string;
  content: string;
  likes: number;
  createdAt: number;
  isAnonymous: boolean;
}

const CommunityScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    const postsRef = ref(database, 'community/posts');
    
    const unsubscribe = onValue(postsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const postsList = Object.entries(data)
          .map(([id, post]: [string, any]) => ({
            id,
            ...post,
          }))
          .sort((a, b) => b.createdAt - a.createdAt);
        setPosts(postsList);
      } else {
        setPosts([]);
      }
    });

    return () => off(postsRef);
  }, []);

  const handlePost = async () => {
    if (!newPost.trim()) return;
    if (!user) {
      alert('Você precisa estar logado para postar');
      return;
    }

    try {
      const postsRef = ref(database, 'community/posts');
      const newPostRef = push(postsRef);
      
      await set(newPostRef, {
        author: isAnonymous ? 'Anônimo' : (user.name || 'Usuário'),
        authorId: isAnonymous ? 'anonymous' : user.uid,
        content: newPost.trim(),
        likes: 0,
        createdAt: Date.now(),
        isAnonymous,
      });

      setNewPost('');
      setIsAnonymous(false);
    } catch (error) {
      console.error('Erro ao postar:', error);
      alert('Erro ao publicar post');
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    
    try {
      const postRef = ref(database, `community/posts/${postId}`);
      const post = posts.find(p => p.id === postId);
      if (post) {
        await set(ref(database, `community/posts/${postId}/likes`), post.likes + 1);
      }
    } catch (error) {
      console.error('Erro ao curtir:', error);
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <XPCard style={styles.postCard}>
      <View style={styles.postHeader}>
        <View>
          <Text style={styles.postAuthor}>
            {item.isAnonymous ? '👤 Anônimo' : `👤 ${item.author}`}
          </Text>
          <Text style={styles.postDate}>
            {new Date(item.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.likeButton}
          onPress={() => handleLike(item.id)}
        >
          <Text style={styles.likeEmoji}>❤️</Text>
          <Text style={styles.likeCount}>{item.likes}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
    </XPCard>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💬 Comunidade</Text>
        <Text style={styles.headerSubtitle}>
          Compartilhe suas conquistas e inspire outros!
        </Text>
      </View>

      <XPCard style={styles.newPostCard}>
        <Text style={styles.newPostLabel}>Nova publicação</Text>
        <TextInput
          style={styles.newPostInput}
          placeholder="Compartilhe algo..."
          placeholderTextColor={XPColors.textMuted}
          value={newPost}
          onChangeText={setNewPost}
          multiline
          numberOfLines={3}
        />
        <View style={styles.newPostActions}>
          <TouchableOpacity
            style={[styles.anonymousButton, isAnonymous && styles.anonymousButtonActive]}
            onPress={() => setIsAnonymous(!isAnonymous)}
          >
            <Text style={[styles.anonymousText, isAnonymous && styles.anonymousTextActive]}>
              {isAnonymous ? '👤 Anônimo' : '👤 Público'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.postButton, !newPost.trim() && styles.postButtonDisabled]}
            onPress={handlePost}
            disabled={!newPost.trim()}
          >
            <Text style={styles.postButtonText}>Publicar</Text>
          </TouchableOpacity>
        </View>
      </XPCard>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.postsList}
        ListEmptyComponent={
          <XPCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Seja o primeiro a compartilhar! 🎉
            </Text>
          </XPCard>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: XPColors.background,
  },
  header: {
    padding: XPSpacing.md,
    paddingTop: XPSpacing.xl,
    backgroundColor: XPColors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: XPColors.grayMedium,
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
  newPostCard: {
    margin: XPSpacing.md,
    marginBottom: XPSpacing.sm,
  },
  newPostLabel: {
    fontSize: XPTypography.body,
    fontWeight: XPTypography.bold,
    color: XPColors.textPrimary,
    marginBottom: XPSpacing.sm,
  },
  newPostInput: {
    backgroundColor: XPColors.grayDark,
    borderRadius: XPBorderRadius.md,
    padding: XPSpacing.md,
    fontSize: XPTypography.body,
    color: XPColors.textPrimary,
    minHeight: 80,
    marginBottom: XPSpacing.md,
    textAlignVertical: 'top',
  },
  newPostActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  anonymousButton: {
    paddingHorizontal: XPSpacing.md,
    paddingVertical: XPSpacing.sm,
    borderRadius: XPBorderRadius.md,
    backgroundColor: XPColors.grayDark,
    borderWidth: 1,
    borderColor: XPColors.grayMedium,
  },
  anonymousButtonActive: {
    backgroundColor: XPColors.grayMedium,
    borderColor: XPColors.yellow,
  },
  anonymousText: {
    fontSize: XPTypography.caption,
    color: XPColors.textSecondary,
  },
  anonymousTextActive: {
    color: XPColors.yellow,
    fontWeight: XPTypography.bold,
  },
  postButton: {
    backgroundColor: XPColors.yellow,
    paddingHorizontal: XPSpacing.lg,
    paddingVertical: XPSpacing.sm,
    borderRadius: XPBorderRadius.md,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    fontSize: XPTypography.body,
    fontWeight: XPTypography.bold,
    color: XPColors.black,
  },
  postsList: {
    padding: XPSpacing.md,
  },
  postCard: {
    marginBottom: XPSpacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: XPSpacing.sm,
  },
  postAuthor: {
    fontSize: XPTypography.body,
    fontWeight: XPTypography.bold,
    color: XPColors.yellow,
  },
  postDate: {
    fontSize: XPTypography.caption,
    color: XPColors.textMuted,
    marginTop: XPSpacing.xs,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: XPColors.grayDark,
    paddingHorizontal: XPSpacing.sm,
    paddingVertical: XPSpacing.xs,
    borderRadius: XPBorderRadius.sm,
  },
  likeEmoji: {
    fontSize: 16,
    marginRight: XPSpacing.xs,
  },
  likeCount: {
    fontSize: XPTypography.caption,
    color: XPColors.textPrimary,
  },
  postContent: {
    fontSize: XPTypography.body,
    color: XPColors.textPrimary,
    lineHeight: 22,
  },
  emptyCard: {
    alignItems: 'center',
    padding: XPSpacing.xl,
  },
  emptyText: {
    fontSize: XPTypography.body,
    color: XPColors.textSecondary,
    textAlign: 'center',
  },
});

export default CommunityScreen;

