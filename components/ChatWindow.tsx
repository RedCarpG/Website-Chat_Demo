import styles from "../styles/ChatRoom.module.scss";
import React, {
  FormEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MdOutlineSend, MdPermIdentity } from "react-icons/md";

import {
  useGetUser,
  useGetMessages,
  storeMessage,
  isCurrentUser,
} from "../utils/database";
import ReactTooltip from "react-tooltip";
import Avatar from "../components/Avatar";
import { getRandomOptions } from "../utils/avatar";
import { MessageType } from "../utils/type";

interface ChatBoxProps {
  message: MessageType;
  style: any;
}
const ChatBox: React.FC<ChatBoxProps> = ({ message, style }) => {
  const { text, uid } = message;
  const isUser = isCurrentUser(uid);

  const [userProfile, loading, error, snapshot] = useGetUser(uid);

  const [userName, setUserName] = useState(
    <span className={styles.deleted_anonymous}>{`Deleted User`}</span>
  );
  const [avatar, setAvatar] = useState(getRandomOptions());

  useEffect(() => {
    if (userProfile?.userAvatar) {
      setAvatar(userProfile?.userAvatar);
      setUserName(
        <span className={userProfile.isAnonymous ? styles.anonymous : ""}>
          {userProfile.isAnonymous ? "Anonymous" : userProfile.userName}
        </span>
      );
    }
  }, [userProfile]);

  return (
    <>
      {!loading && !error && (
        <div
          className={`message ${isUser ? styles.user_chat_box : styles.chat_box
            }`}
          style={style}
        >
          {isUser ? (
            <>
              <div className={styles.chat_box_left}>
                <div className={`${styles.name} ${styles.chat_box_name}`}>
                  {userName}
                </div>
                <div className={styles.chat_box_content}>{text}</div>
              </div>
              <div className={styles.chat_box_profile}>
                <Avatar {...avatar} />
              </div>
            </>
          ) : (
            <>
              <div className={styles.chat_box_profile}>
                <Avatar {...avatar} />
              </div>
              <div className={styles.chat_box_left}>
                <div className={styles.chat_box_name}>
                  {userName}
                </div>
                <div className={styles.chat_box_content}>{text}</div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

const ChatRoom: React.FC = () => {
  const [messages, loading, error, snapshot] = useGetMessages(25);
  const bottomRef = useRef<HTMLDivElement>(null);

  const audio = useMemo(() => {
    return new Audio("./notif.mp3");
  }, []);
  audio.volume = 0.5;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    audio.play();
    return () => {
      audio.pause();
    };
  }, [messages, audio]);

  let content = <></>;
  if (loading) {
    content = <p>Loading...</p>;
  } else if (error) {
    content = <p>Error: {error.message}</p>;
  } else if (messages) {
    content = (
      <>
        {messages.map((msg, index) => (
          <ChatBox
            style={{ order: 24 - index }}
            key={index}
            message={msg as MessageType}
          />
        ))}
      </>
    );
  }

  return (
    <>
      <div className={styles.chat_room}>
        <div className={styles.chat_content}>
          {content}
          <div style={{ order: 25 }} ref={bottomRef}></div>
        </div>
      </div>
    </>
  );
};

interface ChatInputProps {
  toggleProfile: Function;
}
const ChatInput: React.FC<ChatInputProps> = ({ toggleProfile }) => {
  const [inputText, setInputText] = useState("");

  const sendMessage: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await storeMessage(inputText);
    setInputText("");
  };
  return (
    <form className={styles.chat_input} onSubmit={sendMessage}>
      <input
        placeholder="Join in the chat !"
        type="text"
        className={styles.chat_input_text}
        value={inputText}
        onChange={(e) => {
          e.preventDefault();
          setInputText(e.target.value);
        }}
      />
      <button
        type="submit"
        className={`${styles.send} ${styles.chat_input_send}`}
      >
        <MdOutlineSend />
      </button>
      <button
        type="button"
        className={`${styles.setting} ${styles.setting_toggle}`}
        onClick={() => {
          toggleProfile();
        }}
        data-tip
        data-for="profileToggleTip"
      >
        <MdPermIdentity />
      </button>
      <ReactTooltip
        id="profileToggleTip"
        place="bottom"
        type="light"
        effect="solid"
        delayShow={300}
        className="tool_tip"
      >
        Toogle Profile page
      </ReactTooltip>
    </form>
  );
};

interface ChatWindowProps {
  toggleProfile: Function;
  fullSize: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ fullSize, toggleProfile }) => {
  return (
    <>
      <div
        className={
          fullSize
            ? `${styles.chat_window} ${styles.chat_window_fullsize}`
            : styles.chat_window
        }
      >
        <ChatRoom />
        <ChatInput toggleProfile={toggleProfile} />
      </div>
    </>
  );
};

export default ChatWindow;
