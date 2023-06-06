import styles from "../../styles/ChatRoom.module.scss";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useGetNewMsg,
  useGetAllMsgOnce,
} from "../../utils/database";
import ChatBox from "./ChatBox";
import ChatInput from "./ChatInput";

const INIT_MESSAGE_NUM = 25;

interface ChatRoomProps {
  messageIds: string[];
}
const ChatRoom: React.FC<ChatRoomProps> = ({ messageIds }) => {
  console.log(">----- ChatRoom -----<");
  const bottomRef = useRef<HTMLDivElement>(null);

  const audio = useMemo(() => {
    let a = new Audio("./notif.mp3");
    a.muted = true;
    a.volume = 0.3;
    return a;
  }, []);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ block: 'center', behavior: "smooth" })
  }

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 200);
  }, [messageIds])

  return (
    <>
      <div className={styles.chat_room}>
        <div className={styles.chat_content}>
          {messageIds?.map((msgId, index) => {
            return <ChatBox
              key={msgId}
              messageId={msgId}
            />
          })}
          <div ref={bottomRef}></div>
        </div>
      </div>
    </>
  );
};

interface ChatWindowProps {
  toggleProfile: Function;
  fullSize: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ fullSize, toggleProfile }) => {
  console.log(">------ ChatWindow ------<");
  const [msgInit, loadingInit, errorInit, snapshotInit] = useGetAllMsgOnce(INIT_MESSAGE_NUM);
  const [msg, loading, error, snapShot] = useGetNewMsg();
  const [messageIds, setMessageIds] = useState([] as string[]);

  // Init messages
  useEffect(() => {
    if (snapshotInit) {
      let msgIds = snapshotInit.docs.map(doc => doc.id).reverse()
      setMessageIds(msgIds);
    }
  }, [snapshotInit])

  // Receive new messages
  useEffect(() => {
    if (snapShot) {
      let msgId = snapShot.docs[0].id;
      if (!messageIds.includes(msgId)) {
        console.log("-- Receive message :", msgId);
        setMessageIds(ids => [...ids, msgId]);
      }
    }
  }, [snapShot])

  return (
    <>
      <div
        className={
          fullSize
            ? `${styles.chat_window} ${styles.chat_window_fullsize}`
            : styles.chat_window
        }
      >
        {loadingInit && <p>Loading...</p>}
        {errorInit && <p>Error: {errorInit?.message}</p>}
        {!loadingInit && !errorInit &&
          <>
            <ChatRoom messageIds={messageIds} />
            <ChatInput toggleProfile={toggleProfile} />
          </>}
      </div>
    </>
  );
};

export default ChatWindow;
