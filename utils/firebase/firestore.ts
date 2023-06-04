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
import { updateUsername } from "./auth"
import { getRandomOptions } from "../avatar"
import { cleanBacWords } from "../textFilter";
import { User } from "firebase/auth";

/** 
 * --- Code --- 
 * */

const firestore = getFirestore(app);
const userRef = collection(firestore, "users");
const chatRoomsRef = collection(firestore, "chatRooms");

let room = "global"
if (process.env.NEXT_PUBLIC_ENV === "dev") {
    room = "test"
}
const roomRef = doc(chatRoomsRef, room);
const messagesRef = collection(roomRef, "messages");

// Message

function useGetMessagesCollectionData(lim: number) {
    const queryMessage = query(messagesRef, orderBy("createdAt", "desc"), limit(lim));
    return useCollectionData(queryMessage);
}

async function storeMessageDocument(text: string) {
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

// User

function useGetUserDocumentData(uid: string) {
    const docRef = doc(userRef, uid);
    return useDocumentData(docRef);
}

async function saveUserProfileDocument(newProfile: UserProfileType) {
    if (auth.currentUser) {
        await setDoc(doc(firestore, "users", auth.currentUser?.uid), {
            userAvatar: newProfile.userAvatar,
            userName: newProfile.userName,
            isAnonymous: newProfile.isAnonymous,
        });
        updateUsername(newProfile.userName);
    }
}

async function userNotExist(uid: string | undefined) {
    if (!uid) return true
    const docRef = doc(userRef, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return false
    } else {
        return true
    }
}

function createNewUserProfile(user: User | undefined) {
    const newProfile: UserProfileType = {
        userName: user?.displayName ? user.displayName : `Anonoymous`,
        userAvatar: getRandomOptions(),
        isAnonymous: user?.isAnonymous ? true : false,
    };
    saveUserProfileDocument(newProfile);
}

function deletUserProfile(uid: string) {
    deleteDoc(doc(firestore, "users", uid));
}

/** 
 * --- Export --- 
 * */

export default firestore;
export {
    useGetMessagesCollectionData,
    storeMessageDocument,

    userNotExist,
    useGetUserDocumentData,
    saveUserProfileDocument,
    createNewUserProfile,
    deletUserProfile,
};

