import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.scss";

import { useCurrentUser, useSignIn } from "../utils/database";

import ChatWindow from "../components/ChatWindow";
import ProfileWindow from "../components/ProfileWindow";
import Footer from "../components/Footer";
import SignIn from "../components/LogIn";

const ChatDemo: NextPage = () => {
  const [user] = useCurrentUser();
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <title>Chat Demo</title>
      </Head>
      <div className={styles.chat_demo}>
        {user ? (
          <>
            <h1 className={styles.title}>Global Chat Room Demo</h1>
            <ChatWindow />
            <ProfileWindow uid={user.uid} />
          </>
        ) : (
          <SignIn />
        )}
      </div>
      <Footer />
    </>
  );
};

export default ChatDemo;
