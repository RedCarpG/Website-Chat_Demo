/** utils/firebase/auth.ts 
 * 
*/

import { useState } from "react";

/* --- Firebase libs --- */
import {
    SignInMethod,
    getAuth,
    signInAnonymously,
    signInWithCustomToken,
    UserCredential,
    Auth,
    AuthError,
    CustomParameters,
    deleteUser,
    User,
    updateProfile,
} from "firebase/auth";
import {
    useAuthState,
    useSignInWithGoogle,
    useSignInWithGithub,
    useSignInWithEmailAndPassword,
    useCreateUserWithEmailAndPassword,
    SignInWithPopupHook,
    EmailAndPasswordActionHook,
} from "react-firebase-hooks/auth";


/** 
 * --- Local libs --- 
 * */
import { deletUserProfile } from "./firestore";
import app from "./app"

/** 
 * --- Code --- 
*/
const auth = getAuth(app);
auth.useDeviceLanguage();

export default auth;

/* Sign in */

function useSignIn(signInMethod: string) {
    let method: any;
    if (signInMethod === SignInMethod.EMAIL_PASSWORD) {
        method = useSignInWithEmailAndPassword
    } else if (signInMethod === SignInMethod.GOOGLE) {
        method = useSignInWithGoogle;
    } else if (signInMethod === SignInMethod.GITHUB) {
        method = useSignInWithGithub;
    } else if (signInMethod === "Token") {
        method = useSignInAnonymously;
    } else {
        method = useSignInAnonymously;
    }
    return method(auth);
}

function useSignInAnonymously(auth: Auth) {
    const [error, setError] = useState<AuthError | undefined>()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<UserCredential | undefined>()

    async function hook(scopes?: string[] | undefined, customOAuthParameters?: CustomParameters | undefined): Promise<void> {
        setLoading(true);
        return signInAnonymously(auth)
            .then((result) => {
                setLoading(false);
                setUser({
                    user: result.user,
                    providerId: "",
                    operationType: "signIn"
                })
            })
            .catch((error) => {
                setError(error);
            });
    }
    return [hook, user, loading, error];
}

function useSignInToken(auth: Auth): SignInWithPopupHook {
    const [error, setError] = useState<AuthError | undefined>()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<UserCredential | undefined>()

    async function hook(scopes?: string[] | undefined, customOAuthParameters?: CustomParameters | undefined): Promise<UserCredential> {
        setLoading(true);
        return signInWithCustomToken(auth);
    }
    return [hook, user, loading, error];
}


/* Sign Out */

function signOut() {
    if (auth.currentUser?.isAnonymous) {
        const uid = auth.currentUser.uid
        deleteUser(auth.currentUser).then(() => {
            deletUserProfile(uid);
        }).catch((error) => {
            console.log(error)
        });
    }
    auth.signOut()
}

/* User Account */
// Get current User
function useCurrentAuthUser() {
    return useAuthState(auth);
}

function useRegisterNewAccount() {
    return useCreateUserWithEmailAndPassword(auth);
}

function isCurrentUser(uid: string) {
    if (auth.currentUser) {
        return (uid === auth.currentUser.uid)
    }
    return false
}

function updateUsername(userName: string) {
    if (auth.currentUser) {
        updateProfile(auth.currentUser, {
            displayName: userName
        }).then(() => {
            // Profile updated!
            // ...
        }).catch((error) => {
            console.log("ERROR update User Name");
        });
    }
}


/** 
 * --- Export Functions ---
 *  */

export {
    SignInMethod,
    onAuthStateChanged,
} from "firebase/auth";
export type {
    User,
} from "firebase/auth";

export {
    useSignIn,
    signOut,

    useRegisterNewAccount,

    useCurrentAuthUser,
    isCurrentUser,
    updateUsername,
}
