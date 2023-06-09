/** ----- Import ----- */
// Next React
import type { NextPage } from "next";
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

/** ----- Code ----- */

const GlobalRoom: NextPage = () => {
  const [user] = useCurrentAuthUser();

  const [showProfile, setShowProfile] = useState(false);
  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };
  return (
    <>
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
                Router.push("/").catch(console.error);
              }}
            >
              <MdLogin />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default GlobalRoom;
