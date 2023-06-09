import styles from "../styles/Auth.module.scss";
import stylesHome from "../styles/Home.module.scss";
import { useState } from "react";
import { useSignIn, SignInMethod } from "../utils/database";
import ReactTooltip from "react-tooltip";
import { FaGoogle, FaGhost } from "react-icons/fa";
import { MdLogin } from "react-icons/md";

const SignIn: React.FC = () => {
  // Normal Sign in
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [
    signInWithEmailPassword,
    userEmailPassword,
    loadingEmailPassword,
    errorEmailPassword,
  ] = useSignIn(SignInMethod.EMAIL_PASSWORD);
  // Google Email Sign In
  const [signInWithGoogle, userGoogle, loadingGoogle, errorGoogle] = useSignIn(
    SignInMethod.GOOGLE
  );
  const googleCustomParameters = { login_hint: "user@example.com" };
  // Anonymous Sign in
  const [signInAnonymousLy, userAnonymous, loadingAnonymous, errorAnonymous] =
    useSignIn("Anonymously");


  // Loading page
  if (
    loadingGoogle ||
    loadingAnonymous ||
    loadingEmailPassword
  ) {
    return <p>Signing in...</p>;
  }
  // Already Signed in 
  if (userGoogle || userAnonymous || userEmailPassword) {
    return (
      <div>
        <p>
          Signed In User: {userGoogle?.providerId}
          {userAnonymous?.providerId}
        </p>
      </div>
    );
  }
  // Sign in form
  return (
    <>
      <div className={styles.sign_in}>
        <div className={styles.title}> Sign In </div>
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
          <button title="submit" type="submit" className={styles.submit}>
            <div className={stylesHome.icon}><MdLogin /></div>Log in
          </button>
        </form>
        <div className={stylesHome.line}>
          <hr />or <hr />
        </div>
        <div className={styles.sign_in_other_methods}>
          <button
            type="button"
            title="googleSignIn"
            onClick={() => {
              signInWithGoogle(undefined, googleCustomParameters);
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
            type="button"
            title="anonymousSignIn"
            className={styles.sign_in_anonymous}
            onClick={() => {
              signInAnonymousLy();
            }}
            data-tip
            data-for="anonymousTip"
          >
            <div className={stylesHome.icon}><FaGhost /></div>  Anonymous
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
          errorAnonymous ||
          errorEmailPassword) && (
            <p>
              {errorGoogle?.message}
              {errorAnonymous?.message}
              {errorEmailPassword?.message}
            </p>
          )}
      </div >
    </>
  );
};

export default SignIn;
