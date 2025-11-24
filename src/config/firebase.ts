import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB6MCfsThDxViT6Tnw1TEKD-caxKwsF1Lg",
  authDomain: "xpvision-b28c3.firebaseapp.com",
  databaseURL: "https://xpvision-b28c3-default-rtdb.firebaseio.com",
  projectId: "xpvision-b28c3",
  storageBucket: "xpvision-b28c3.firebasestorage.app",
  messagingSenderId: "665761168616",
  appId: "1:665761168616:android:6342bc28a6aba1871c1d5d"
};

// Inicializar Firebase apenas uma vez
let app;
try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase inicializado com sucesso');
  } else {
    app = getApp();
    console.log('✅ Firebase já estava inicializado');
  }
} catch (error: any) {
  console.error('❌ Erro ao inicializar Firebase:', error);
  // Não lançar erro para não quebrar o app
  // Tentar inicializar novamente
  try {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase inicializado na segunda tentativa');
  } catch (retryError) {
    console.error('❌ Erro na segunda tentativa:', retryError);
    throw retryError;
  }
}

// Firebase Auth - a persistência com AsyncStorage é automática no React Native
export const auth = getAuth(app);
export const database = getDatabase(app);
export default app;
