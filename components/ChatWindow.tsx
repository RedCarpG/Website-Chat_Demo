import styles from "../styles/ChatRoom.module.scss";
import React, {
  FormEventHandler,
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

  const avatar = useMemo(() => {
    if (userProfile?.userAvatar) return userProfile?.userAvatar;
    return getRandomOptions();
  }, [userProfile]);

  const userName = useMemo(() => {
    if (loading) return "Loading user name...";
    if (error) return "Error loading user name ❌";
    if (userProfile)
      return (
        <span className={userProfile.isAnonymous ? styles.anonymous : ""}>
          {userProfile.userName}
        </span>
      );
    return (
      <span className={styles.deleted_anonymous}>{`USER ${uid.slice(
        0,
        4
      )}...`}</span>
    );
  }, [userProfile, uid, loading, error]);

  return (
    <div
      className={`message ${isUser ? styles.user_chat_box : styles.chat_box}`}
      style={style}
    >
      {isUser ? (
        <>
          <div>
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
          <div>
            <div className={styles.chat_box_name}>{userName}</div>
            <div className={styles.chat_box_content}>{text}</div>
          </div>
        </>
      )}
    </div>
  );
};

const ChatRoom: React.FC = () => {
  const [messages, loading, error, snapshot] = useGetMessages(25);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
