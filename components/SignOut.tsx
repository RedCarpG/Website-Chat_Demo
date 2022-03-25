import styles from "../styles/Auth.module.scss";
import Router from "next/router";
import { signOut } from "../utils/database";

const SignOut: React.FC = () => {
  return (
    <button
      className={styles.sign_out}
      onClick={() => {
        signOut();
        Router.push("/");
      }}
    >
      Sign Out
    </button>
  );
};

export default SignOut;
