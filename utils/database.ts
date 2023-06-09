/** utils/database.ts
 * 
 */

import {
    useGetNewMessagesCollectionData,
    useGetAllMessagesCollectionDataOnce,
    getMessagesCollectionData,
    storeMessageDocument,

    getUserDocumentData,
    saveUserProfileDocument,
    createNewUserProfile,
    userNotExist,
} from "./firebase/firestore";
import auth, {
    User,
    SignInMethod,
    onAuthStateChanged,

    useSignIn,
    signOut,

    useRegisterNewAccount,

    useCurrentAuthUser,
    isCurrentUser,
    updateUsername,
} from "./firebase/auth";

export type {
    User
};
export {
    auth,

    useSignIn,
    signOut,
    SignInMethod,
    onAuthStateChanged,

    useRegisterNewAccount,
    updateUsername,
    useCurrentAuthUser,
    isCurrentUser,

    getMessagesCollectionData as getMsgDataOnce,
    useGetNewMessagesCollectionData as useGetNewMsg,
    useGetAllMessagesCollectionDataOnce as useGetAllMsgOnce,
    storeMessageDocument as storeMessage,
    createNewUserProfile,
    getUserDocumentData as getUser,
    saveUserProfileDocument as saveUserProfile,
    userNotExist,
}

