import { getAuth, SignInMethod, signInAnonymously, onAuthStateChanged, UserCredential, Auth } from "firebase/auth";
import { useAuthState, useSignInWithGoogle, useSignInWithGithub, useSignInWithEmailAndPassword, SignInWithPopupHook } from "react-firebase-hooks/auth";

import { userNotExist, createNewAccount } from "./firestore";
import app from "./app"

const auth = getAuth(app);
auth.useDeviceLanguage();

export default auth;

export { SignInMethod, signInAnonymously }

export function useSignIn(signInMethod: string) {
    let method = useSignInWithGoogle
    if (signInMethod === SignInMethod.GOOGLE) {
        method = useSignInWithGoogle;
    } else if (signInMethod === SignInMethod.GITHUB) {
        method = useSignInWithGithub;
    } 
    return method(auth);
}

export function signInAnonymous() {
    
    let errorCode = null;
    let errorMessage = null;
    signInAnonymously(auth)
        .catch((error) => {
            errorCode = error.code;
            errorMessage = error.message;
        });
    if (errorCode) return `${errorCode}: ${errorMessage}`
    return null
}

async function checkNewAccount(uid: string) {
    if (await userNotExist(uid)) {
        createNewAccount(uid);
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        checkNewAccount(user.uid);
        console.log(`Logged in: ${user.uid}`);
    } else {
        console.log("Logged out");
    }
})

export function signOut() {
    auth.signOut()
}

export function useCurrentAuthUser() {
    return useAuthState(auth);
}


export function isCurrentUser(uid: string) {
    if (auth.currentUser) {
        return (uid === auth.currentUser.uid)
    }
    return false
}