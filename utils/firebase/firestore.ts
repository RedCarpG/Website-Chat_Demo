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
    where,
} from "firebase/firestore";
import { useCollectionData, useCollectionDataOnce, useDocumentData, useCollection, useCollectionOnce, useDocumentDataOnce } from "react-firebase-hooks/firestore";
/* --- Local libs --- */
import { MessageType, UserProfileType } from "../type";
import app from "./app"
import auth, { updateUsername } from "./auth"
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

function getMessagesCollectionData(id: string) {
    const docRef = doc(messagesRef, id);
    const docSnap = getDoc(docRef);
    return docSnap;
}

function useGetNewMessagesCollectionData() {
    const queryMessage = query(messagesRef, orderBy("createdAt", "desc"), limit(1));
    return useCollectionData(queryMessage);
}

function useGetAllMessagesCollectionDataOnce(lim: number) {
    const queryMessage = query(messagesRef, orderBy("createdAt", "desc"), limit(lim));
    return useCollectionDataOnce(queryMessage);
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

function getUserDocumentData(uid: string) {
    const docRef = doc(userRef, uid);
    const docSnap = getDoc(docRef);
    return docSnap;
    // return useDocumentDataOnce(docRef);
}

async function saveUserProfileDocument(newProfile: UserProfileType) {
    if (auth.currentUser) {
        console.log("-- Save USER Profile");
        console.log("- id: ", auth.currentUser?.uid);
        console.log("- userName: ", newProfile.userName);
        console.log("- isAnonymous: ", newProfile.isAnonymous);
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
    useGetNewMessagesCollectionData,
    useGetAllMessagesCollectionDataOnce,
    getMessagesCollectionData,

    storeMessageDocument,

    userNotExist,
    getUserDocumentData,
    saveUserProfileDocument,
    createNewUserProfile,
    deletUserProfile,
};

