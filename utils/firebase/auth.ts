/** utils/firebase/auth.ts 
 * 
*/

import { useState } from "react";

/* --- Firebase libs --- */
import { 
    getAuth, 
    SignInMethod, 
    signInAnonymously,
    onAuthStateChanged, 
    UserCredential, 
    Auth,
    AuthError,
    CustomParameters,
    deleteUser,
    User,
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

export { SignInMethod }

/* --- Local libs --- */
import { userNotExist, createNewUserProfile, deletUserProfile } from "./firestore";
import app from "./app"

/* --- Code --- */
const auth = getAuth(app);
auth.useDeviceLanguage();

export default auth;

onAuthStateChanged(auth, (user) => {
    if (user) {
        checkNewAccount(user);
        console.log(`Logged in: ${user.uid}`);
    } else {
        console.log(`Logged out`);
    }
})

/* --- Export Functions --- */

export function useCreateNewAccount() {
    return useCreateUserWithEmailAndPassword(auth);
}

export function useSignIn(signInMethod: string) {
    let method: any;
    if (signInMethod === SignInMethod.EMAIL_PASSWORD) {
        method = useSignInWithEmailAndPassword
    } else if (signInMethod === SignInMethod.GOOGLE) {
        method = useSignInWithGoogle;
    } else if (signInMethod === SignInMethod.GITHUB) {
        method = useSignInWithGithub;
    } else {
        method = useSignInAnonymously;
    }
    return method(auth);
}
export function useSignInAnonymously(auth: Auth): SignInWithPopupHook {
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

async function checkNewAccount(user: User) {
    if (await userNotExist(user.uid)) {
        createNewUserProfile(user);
    }
}

export function signOut() {
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

export function useCurrentAuthUser() {
    return useAuthState(auth);
}

export function isCurrentUser(uid: string) {
    if (auth.currentUser) {
        return (uid === auth.currentUser.uid)
    }
    return false
}