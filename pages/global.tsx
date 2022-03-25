import type { NextPage } from "next";
import Router from "next/router";

import styles from "../styles/Home.module.scss";
import stylesChatRoom from "../styles/ChatRoom.module.scss";

import { useCurrentAuthUser } from "../utils/database";

import ChatWindow from "../components/ChatWindow";
import ProfileWindow from "../components/ProfileWindow";
import Footer from "../components/Footer";

const GlobalRoom: NextPage = () => {
  const [user] = useCurrentAuthUser();

  return (
    <>
      <div className={styles.chat_demo}>
        {user ? (
          <>
            <h1 className={stylesChatRoom.title}>{process.env.projectTitle}</h1>
            <ChatWindow />
            <ProfileWindow uid={user.uid} />
          </>
        ) : (
          <div className={stylesChatRoom.redirect}>
            <p>Someone forgets to sign in ? 🤨</p>
            <button
              onClick={() => {
                Router.push("/");
              }}
            >
              Sign In
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default GlobalRoom;
