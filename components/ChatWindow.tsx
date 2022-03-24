import styles from "../styles/Home.module.scss";
import React, { FormEventHandler, useRef, useState } from "react";
import { MdOutlineSend } from "react-icons/md";

import {
  useGetUser,
  useGetMessages,
  storeMessage,
  isCurrentUser,
  messageType,
} from "../utils/database";
import Avatar from "../components/Avatar";

interface ChatBoxProps {
  message: messageType;
}
const ChatBox: React.FC<ChatBoxProps> = ({ message }) => {
  const { text, uid } = message;
  const isUser = isCurrentUser(uid);

  const [user] = useGetUser(uid);
  return (
    <div
      className={`message ${isUser ? styles.user_chat_box : styles.chat_box}`}
    >
      {isUser ? (
        <>
          <div>
            <div className={`${styles.name} ${styles.chat_box_name}`}>
              {user?.userName}
            </div>
            <div className={styles.chat_box_content}>{text}</div>
          </div>
          <div className={styles.chat_box_profile}>
            <Avatar {...user?.userAvatar} />
          </div>
        </>
      ) : (
        <>
          <div className={styles.chat_box_profile}>
            <Avatar {...user?.userAvatar} />
          </div>
          <div>
            <div className={styles.chat_box_name}>{user?.userName}</div>
            <div className={styles.chat_box_content}>{text}</div>
          </div>
        </>
      )}
    </div>
  );
};

const ChatWindow: React.FC = () => {
  const [messages] = useGetMessages(25);
  messages?.reverse();
  const [inputText, setInputText] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    storeMessage(inputText);
    setInputText("");
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className={styles.chat_window}>
        <div className={styles.chat_room}>
          <div className={styles.chat_content}>
            {messages &&
              messages.map((msg, index) => (
                <ChatBox key={index} message={msg as messageType} />
              ))}
            <div ref={bottomRef}></div>
          </div>
        </div>
        <form className={styles.chat_input} onSubmit={sendMessage}>
          <input
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
        </form>
      </div>
    </>
  );
};

export default ChatWindow;
