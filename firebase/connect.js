import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_CARD9C1HQDv9Y57jI30JPouY9wdfri4",
  authDomain: "prog-movil-83f35.firebaseapp.com",
  projectId: "prog-movil-83f35",
  storageBucket: "prog-movil-83f35.firebasestorage.app",
  messagingSenderId: "1049988147629",
  appId: "1:1049988147629:web:3aa32ee4ea37bc7c1a1924"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);