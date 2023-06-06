import type { NextPage } from "next";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.scss";
import Spinner from "../components/Spinner";


const ChatDemo: NextPage = () => {

  const router = useRouter();
  setTimeout(() => {
    router.push("/login").catch((e) => {
      console.log(e);
    });
  }, 500);

  return (
    <>
      <div className={styles.chat_demo}>
        <Spinner />
      </div>
    </>
  );
};

export default ChatDemo;
