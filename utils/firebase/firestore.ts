/** utils/firebase/firestore.ts 
 * 
*/

/* --- Firebase libs --- */
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  serverTimestamp,
  addDoc,
  setDoc,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";

/* --- Local libs --- */
import { MessageType, UserProfileType } from "../type";
import app from "./app"
import auth from "./auth"
import { getRandomOptions } from "../avatar"
import { cleanBacWords } from "../textFilter";
import { User } from "firebase/auth";

/* --- Code --- */
const firestore = getFirestore(app);
const userRef = collection(firestore, "users");
const chatRoomsRef = collection(firestore, "chatRooms");

let room = "global"
if (process.env.NODE_ENV === "development") {
    room = "test"
}
const roomRef = doc(chatRoomsRef, room);
const messagesRef = collection(roomRef, "messages");

export default firestore;
export { userRef, messagesRef };

/* --- Export Functions --- */
export function useGetUserDocumentData(uid: string) {
    const docRef = doc(userRef, uid);
    return useDocumentData(docRef);
}

export function useGetMessagesCollectionData(lim: number) {
    const queryMessage = query(messagesRef, orderBy("createdAt", "desc"), limit(lim));
    return useCollectionData(queryMessage);
}


export async function storeMessageDocument(text: string) {
    const user = auth.currentUser
    
    if (user !== null && text.trim().length !== 0) { 
        text = cleanBacWords(text);
        const chatData: MessageType = {
            text: text,
            createdAt: serverTimestamp(),
            uid: user.uid,
        };
        await addDoc(messagesRef, chatData);
    }
}

export async function saveUserProfileDocument(newProfile: UserProfileType) {
    if (auth.currentUser) {
        await setDoc(doc(firestore, "users", auth.currentUser?.uid), {
            userAvatar: newProfile.userAvatar,
            userName: newProfile.userName,
            isAnonymous: newProfile.isAnonymous,
        });
    }
}

export async function userNotExist(uid: string | undefined) {
    if (!uid) return true
    const docRef = doc(userRef, uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        return false
    } else {
        return true
    }
}

export function createNewUserProfile(user: User) {
    const newProfile: UserProfileType = {
        userName: user.displayName ? user.displayName :`User${user.uid}`,
        userAvatar: getRandomOptions(),
        isAnonymous: user.isAnonymous,
    };
    saveUserProfileDocument(newProfile);
}

export  function deletUserProfile(uid: string) {
    deleteDoc(doc(firestore, "users", uid));
}