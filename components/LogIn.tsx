import styles from "../styles/Home.module.scss";
import { useSignIn, SignInMethod, signInAnonymous } from "../utils/database";

const SignInButton: React.FC = () => {
  const [signInWithGoogle, userGoogle, loadingGoogle, errorGoogle] = useSignIn(
    SignInMethod.GOOGLE
  );
  const [signInWithGithub, userGithub, loadingGithub, errorGithub] = useSignIn(
    SignInMethod.GITHUB
  );

  const customParameters = { login_hint: "user@example.com" };
  if (loadingGoogle || loadingGithub) {
    return <p>Waiting...</p>;
  }
  if (userGoogle || userGithub) {
    return (
      <div>
        <p>
          Signed In User: {userGoogle?.providerId}
          {userGithub?.providerId}
        </p>
      </div>
    );
  }
  return (
    <>
      {(errorGoogle || errorGithub) && (
        <p>
          Error: {errorGoogle?.message}
          {errorGithub?.message}
        </p>
      )}
      <button
        onClick={() => {
          signInWithGoogle(undefined, customParameters);
        }}
      >
        Sign in with Google
      </button>
      <button
        onClick={() => {
          signInAnonymous();
        }}
      >
        Sign in with Anonymously
      </button>
    </>
  );
};

const SignIn: React.FC = () => {
  return (
    <>
      <div className={styles.sign_in}>
        <h1>{process.env.projectTitle}</h1>
        <SignInButton />
      </div>
    </>
  );
};

export default SignIn;
