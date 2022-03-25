import styles from "../styles/Auth.module.scss";
import { useState } from "react";
import { useSignIn, SignInMethod } from "../utils/database";
import ReactTooltip from "react-tooltip";
import { FaGoogle, FaGhost } from "react-icons/fa";

const SignIn: React.FC = () => {
  const [
    signInWithEmailPassword,
    userEmailPassword,
    loadingEmailPassword,
    errorEmailPassword,
  ] = useSignIn(SignInMethod.EMAIL_PASSWORD);

  const [signInWithGoogle, userGoogle, loadingGoogle, errorGoogle] = useSignIn(
    SignInMethod.GOOGLE
  );

  const [signInAnonymousLy, userAnonymous, loadingAnonymous, errorAnonymous] =
    useSignIn("Anonymously");

  const [signInWithGithub, userGithub, loadingGithub, errorGithub] = useSignIn(
    SignInMethod.GITHUB
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const customParameters = { login_hint: "user@example.com" };
  if (
    loadingGoogle ||
    loadingGithub ||
    loadingAnonymous ||
    loadingEmailPassword
  ) {
    return <p>Signing in...</p>;
  }
  if (userGoogle || userGithub || userAnonymous || userEmailPassword) {
    return (
      <div>
        <p>
          Signed In User: {userGoogle?.providerId}
          {userGithub?.providerId}
          {userAnonymous?.providerId}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.sign_in}>
        <form
          className={styles.sign_in_email_psw}
          onSubmit={() => {
            signInWithEmailPassword(email, password);
          }}
        >
          <input
            type="email"
            placeholder="example@email.com"
            name="email"
            autoComplete="on"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            autoComplete="on"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button type="submit" className={styles.submit}>
            Log in
          </button>
        </form>
        <div className={styles.sign_in_other_methods}>
          <button
            onClick={() => {
              signInWithGoogle(undefined, customParameters);
            }}
            data-tip
            data-for="googleTip"
          >
            <FaGoogle />
          </button>
          <ReactTooltip
            id="googleTip"
            place="bottom"
            type="info"
            effect="solid"
            delayShow={300}
            className="tool_tip"
          >
            Sign in with Google Account
          </ReactTooltip>
          <button
            onClick={() => {
              signInAnonymousLy();
            }}
            data-tip
            data-for="anonymousTip"
          >
            <FaGhost />
          </button>
          <ReactTooltip
            id="anonymousTip"
            place="bottom"
            type="info"
            effect="solid"
            delayShow={300}
            className="tool_tip"
          >
            Sign in Anonymously
          </ReactTooltip>
        </div>

        {(errorGoogle ||
          errorGithub ||
          errorAnonymous ||
          errorEmailPassword) && (
          <p>
            {errorGoogle?.message}
            {errorGithub?.message}
            {errorAnonymous?.message}
            {errorEmailPassword?.message}
          </p>
        )}
      </div>
    </>
  );
};

export default SignIn;
