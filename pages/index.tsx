import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.scss";

import { useCurrentUser, useSignIn } from "../utils/database";

import ChatWindow from "../components/ChatWindow";
import ProfileWindow from "../components/ProfileWindow";
import Footer from "../components/Footer";

const SignIn: React.FC = () => {
  const [signInWithGoogle, user, loading, error] = useSignIn();

  const customParameters = { login_hint: "user@example.com" };
  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
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
    <button
      onClick={() => {
        signInWithGoogle(undefined, customParameters);
      }}
    >
      Sign in with Google
    </button>
  );
};

const ChatDemo: NextPage = () => {
  const [user] = useCurrentUser();
  return (
    <>
      <Head>
        <title>Chat Demo</title>
      </Head>
      <div className={styles.chat_demo}>
        {user ? (
          <>
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
