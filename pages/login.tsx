import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import ReactTooltip from "react-tooltip";
import { MdArrowBack } from "react-icons/md";
import styles from "../styles/Home.module.scss";
import stylesSignIn from "../styles/Auth.module.scss";
import { useCurrentAuthUser } from "../utils/database";
import SignIn from "../components/SignIn";
import Register from "../components/Register";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const [user] = useCurrentAuthUser();
  const [signInState, setSignInState] = useState<boolean>(true);

  if (user) {
    router.push("/global").catch((e) => {
      console.log(e);
    });
  }

  return (
    <>
      <div className={styles.chat_demo}>
        <div className={stylesSignIn.auth}>
          <h1>{process.env.projectTitle}</h1>

          {signInState ? <SignIn /> : <Register />}

          <button
            title="Sign In"
            type="button"
            className={stylesSignIn.register_login_switch}
            onClick={() => {
              setSignInState(!signInState);
            }}
            data-tip
            data-for="switchTip"
          >
            {signInState ? "Register" : <><div className={styles.icon}><MdArrowBack /></div> Back</>}
          </button>
          <ReactTooltip
            id="switchTip"
            place="bottom"
            type="info"
            effect="solid"
            delayShow={300}
            className="tool_tip"
          >
            Switch to {signInState ? "Register" : "Sign In"} page
          </ReactTooltip>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
