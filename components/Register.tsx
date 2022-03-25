import styles from "../styles/Auth.module.scss";
import { useState } from "react";
import { useCreateNewAccount } from "../utils/database";
import ReactTooltip from "react-tooltip";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createNewAccount, user, loading, error] = useCreateNewAccount();

  if (loading) {
    return <p>Registering...</p>;
  }

  return (
    <>
      <form
        className={styles.register}
        onSubmit={() => {
          createNewAccount(email, password);
        }}
      >
        {user && <p>Signed In User: {user?.providerId}</p>}
        {error && <p> Error: {error.message} </p>}
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
          Register
        </button>
      </form>
    </>
  );
};

export default Register;
