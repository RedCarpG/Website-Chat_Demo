/** utils/database.ts
 * 
 */

import {
    useGetMessagesCollectionData,
    storeMessageDocument,

    useGetUserDocumentData,
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

    useGetMessagesCollectionData as useGetMessages,
    storeMessageDocument as storeMessage,
    createNewUserProfile,
    useGetUserDocumentData as useGetUser,
    saveUserProfileDocument as saveUserProfile,
    userNotExist,
}

