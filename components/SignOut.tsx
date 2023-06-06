import {
  MdLogout,
} from "react-icons/md";
import styles from "../styles/Auth.module.scss";
import stylesHome from "../styles/Home.module.scss";
import Router from "next/router";
import { signOut } from "../utils/database";


const SignOut: React.FC = () => {
  return (
    <button
      className={styles.sign_out}
      onClick={() => {
        signOut().catch(console.error);
        Router.push("/").catch(console.error);
      }}
    >
      <div className={stylesHome.icon}><MdLogout /></div> Log Out
    </button>
  );
};

export default SignOut;
