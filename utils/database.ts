/** utils/database.ts
 * 
 */

import { 
    useGetUserDocumentData, 
    useGetMessagesCollectionData,
    storeMessageDocument,
    saveUserProfileDocument,
} from "./firebase/firestore";
import {
    useSignIn,
    signOut,
    useCurrentAuthUser,
    isCurrentUser,
    SignInMethod,
    signInAnonymous,
} from "./firebase/auth"

export {
    useGetUserDocumentData as useGetUser,
    useGetMessagesCollectionData as useGetMessages,
    storeMessageDocument as storeMessage,
    saveUserProfileDocument as saveUserProfile,
    
    useSignIn,
    signOut,
    useCurrentAuthUser,
    isCurrentUser,
    SignInMethod,
    signInAnonymous,
}

