import styles from "../styles/ChatRoom.module.scss";
import React, { FormEventHandler, useEffect, useRef, useState } from "react";
import { MdOutlineSend } from "react-icons/md";

import {
  useGetUser,
  useGetMessages,
  storeMessage,
  isCurrentUser,
} from "../utils/database";
import Avatar from "../components/Avatar";
import { MessageType } from "../utils/type";

interface ChatBoxProps {
  message: MessageType;
  style: any;
}
const ChatBox: React.FC<ChatBoxProps> = ({ message, style }) => {
  const { text, uid } = message;
  const isUser = isCurrentUser(uid);

  const [user] = useGetUser(uid);
  return (
    <div
      className={`message ${isUser ? styles.user_chat_box : styles.chat_box}`}
      style={style}
    >
      {isUser ? (
        <>
          <div>
            <div className={`${styles.name} ${styles.chat_box_name}`}>
              {user ? user.userName : `User${uid}`}
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
            <div className={styles.chat_box_name}>
              {user ? (
                user.userName
              ) : (
                <span className={styles.anonymous}>{`User${uid}`}</span>
              )}
            </div>
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

const ChatWindow: React.FC = () => {
  const [inputText, setInputText] = useState("");

  const sendMessage: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await storeMessage(inputText);
    setInputText("");
  };

  return (
    <>
      <div className={styles.chat_window}>
        <ChatRoom />
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
        </form>
      </div>
    </>
  );
};

export default ChatWindow;
