
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  serverTimestamp,
  FieldValue,
  addDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { getAuth, User } from "firebase/auth";

import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";

import { AvatarType } from "./avatar";

interface userProfileType {
    userName: string;
    userAvatar: AvatarType;
}

export interface messageType {
    text: string;
    createdAt: FieldValue;
    uid: string;
}

export interface UserType extends  User {}

const firebaseConfig = {
  apiKey: "AIzaSyC482jtO0NMH_aOCuwHC6HzPmcLp37FeqI",
  authDomain: "chatdemo-e2489.firebaseapp.com",
  projectId: "chatdemo-e2489",
  storageBucket: "chatdemo-e2489.appspot.com",
  messagingSenderId: "668382150331",
  appId: "1:668382150331:web:cc0110341143d71ea3f39e",
  measurementId: "G-QD1JXQF2RX",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage();

const firestore = getFirestore(app);
const userRef = collection(firestore, "users");
const messagesRef = collection(firestore, "messages");

export function useGetUser(uid: string) {
    const docRef = doc(userRef, uid);
    return useDocumentData(docRef)
}

export function useGetMessages(lim: number) {
    const queryMessage = query(messagesRef, orderBy("createdAt", "desc"), limit(lim));

    return useCollectionData(queryMessage);
}

export async function storeMessage(text: string) {
    const user = auth.currentUser
    
    if (user !== null && text.trim().length !== 0) { 
        const chatData: messageType = {
            text: text,
            createdAt: serverTimestamp(),
            uid: user.uid,
        };
        await addDoc(messagesRef, chatData);
    }
}

export function useCurrentUser() {
    return useAuthState(auth);
}

export function signOut() {
    auth.signOut()
}

export function useSignIn() {
    return useSignInWithGoogle(auth);
}

export async function saveUserProfile(newProfile: userProfileType) {
    if (auth.currentUser) {
        await setDoc(doc(firestore, "users", auth.currentUser?.uid), {
            userAvatar: newProfile.userAvatar,
            userName: newProfile.userName,
          });
    }
}

export function isCurrentUser(uid: string) {
    
    if (auth.currentUser) {

        return (uid === auth.currentUser.uid)
    }

    return false
}