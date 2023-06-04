import styles from "../styles/Auth.module.scss";
import stylesHome from "../styles/Home.module.scss";
import { useState } from "react";
import { useRegisterNewAccount, createNewUserProfile, updateUsername } from "../utils/database";
import ReactTooltip from "react-tooltip";
import {
  MdSaveAlt,
} from "react-icons/md";

const Register: React.FC = () => {
  const [userName, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createNewAccount, user, loading, error] = useRegisterNewAccount();

  // Loading
  if (loading) {
    return <p>Registering...</p>;
  }
  // Regester From
  return (
    <>
      <form
        className={styles.register}
        onSubmit={() => {
          createNewAccount(email, password).then((_userCredential) => {
            createNewUserProfile(_userCredential?.user);
          });
          updateUsername(userName);
        }}
      >
        {user && <p>Signed In User: {user?.providerId}</p>}
        {error && <p> Error: {error.message} </p>}
        <input
          type="username"
          placeholder="username"
          name="username"
          autoComplete="on"
          onChange={(e) => {
            setuserName(e.target.value);
          }}
        />
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
        <button title="Register" type="submit" className={styles.submit}>
          <div className={stylesHome.icon}><MdSaveAlt /></div> Register
        </button>
      </form>
    </>
  );
};

export default Register;
