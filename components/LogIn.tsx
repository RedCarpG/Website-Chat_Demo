import styles from "../styles/Home.module.scss";
import { useSignIn } from "../utils/database";

const SignInButton: React.FC = () => {
  const [signInWithGoogle, user, loading, error] = useSignIn();

  const customParameters = { login_hint: "user@example.com" };
  if (loading) {
    return <p>Loading...</p>;
  }
  if (user) {
    return (
      <div>
        <p>Signed In User: {user.providerId}</p>
      </div>
    );
  }
  return (
    <>
      {error && <p>Error: {error.message}</p>}
      <button
        onClick={() => {
          signInWithGoogle(undefined, customParameters);
        }}
      >
        Sign in with Google
      </button>
    </>
  );
};

const SignIn: React.FC = () => {
  return (
    <>
      <div className={styles.sign_in}>
        <h1>Global Chat Room Demo</h1>
        <SignInButton />
      </div>
    </>
  );
};

export default SignIn;
