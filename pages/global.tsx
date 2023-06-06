/** ----- Import ----- */
// Next React
import type { NextPage } from "next";
import Head from "next/head";
import Router from "next/router";
import { useState } from "react";
import { MdLogin } from "react-icons/md";
// Style
import styles from "../styles/Home.module.scss";
import stylesChatRoom from "../styles/ChatRoom.module.scss";
// DB
import { useCurrentAuthUser } from "../utils/database";
// Components
import ChatWindow from "../components/ChatWindow/ChatWindow";
import ProfileWindow from "../components/ProfileWindow";
import Footer from "../components/Footer";

/** ----- Code ----- */

const GlobalRoom: NextPage = () => {
  const [user] = useCurrentAuthUser();

  const [showProfile, setShowProfile] = useState(false);
  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };
  return (
    <>
      <Head>
        <title>Web Chat Room - RedCarpG </title>
        <meta
          name="description"
          content="A Web Chat demo application project created with Firebase, NextJS. Feel free to visit my Github page for source code."
        ></meta>
        <meta
          name="keywords"
          content="ReactJS, NextJS, Firebase, Web Chat, Web Application"
        ></meta>
        <meta name="author" content="RedCarpG"></meta>
      </Head>
      <div className={styles.chat_demo}>
        {user ? (
          <>
            <h1 className={stylesChatRoom.title}>{process.env.projectTitle}</h1>
            <ChatWindow fullSize={showProfile} toggleProfile={toggleProfile} />
            <ProfileWindow
              hide={showProfile}
              toggleProfile={toggleProfile}
              user={user}
            />
          </>
        ) : (
          <div className={stylesChatRoom.redirect}>
            <p>Someone forgets to sign in ? 🤨</p>
            <button
              title="Sign In"
              type="button"
              onClick={() => {
                Router.push("/");
              }}
            >
              <MdLogin />
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default GlobalRoom;
