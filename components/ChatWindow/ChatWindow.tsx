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
import { DocumentData } from "firebase/firestore";

const INIT_MESSAGE_NUM = 25;

class MessageBlock {
  id: string;
  userId: string;
  msgs: DocumentData[];

  constructor(id: string, userId: string, msgs: DocumentData[]) {
    this.id = id;
    this.userId = userId;
    this.msgs = msgs;
  }

  add(msg: DocumentData) {
    this.msgs.splice(0, 0, msg);
  }

  push(msg: DocumentData) {
    this.msgs.push(msg);
  }

  isSameUser(userId_: string): boolean {
    return this.userId == userId_;
  }
};

interface ChatRoomProps {
  initMessages: MessageBlock[] | undefined;
}
const ChatRoom: React.FC<ChatRoomProps> = ({ initMessages }) => {
  console.log(">----- ChatRoom -----<");

  // Function to get Messages from DB
  const [, , , snapShot] = useGetNewMsg();
  // Local 
  const [messages, setMessages] = useState([] as MessageBlock[]);
  const [lastMessage, setLastMessage] = useState("");
  const [doneInit, setdoneInit] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const audio = useMemo(() => {
    let a = new Audio("./notif.mp3");
    a.volume = 0.3;
    return a;
  }, []);

  // Get init messages
  useEffect(() => {
    if (initMessages) {
      setMessages(initMessages);
      setLastMessage(initMessages[initMessages.length - 1].id);
      setdoneInit(true);
    }
  }, [initMessages])

  // Receive new messages
  useEffect(() => {
    // If received a message after initiation
    if (doneInit && snapShot) {
      let msg = snapShot.docs[0];
      // Need to avoid adding repeated message
      if (lastMessage != msg.id) {
        setLastMessage(msg.id);
        console.log("-- Receive message :", msg.id);
        console.log("- :", msg.data().uid);
        console.log("- :", msg.data().text);
        let temp_msg = messages;
        if (temp_msg[temp_msg.length - 1].userId == msg.data().uid) {
          // If sent by same user, use the last MessageBlock
          messages[temp_msg.length - 1].add(msg.data());
          setMessages(temp_msg);
        } else {
          // If not sent by a same user, create a new MessageBlock
          setMessages(messages => [...messages, new MessageBlock(msg.id, msg.data().uid, [msg.data()])]);
        }
      }
    }
  }, [snapShot])

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ block: 'center', behavior: "smooth" })
  }

  useEffect(() => {
    const playAudio = async () => {
      await audio.play();
    }
    playAudio().catch(console.error);
    setTimeout(() => {
      scrollToBottom();
    }, 200);
  }, [snapShot, audio])

  return (
    <>
      <div className={styles.chat_room}>
        <div className={styles.chat_content}>
          {messages.map((msg, index) => {
            return <ChatBox
              key={msg.id}
              messagesData={[...msg.msgs].reverse()}
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
  // Function to get Messages from DB
  const [, loadingInit, errorInit, snapshotInit] = useGetAllMsgOnce(INIT_MESSAGE_NUM);
  // Local
  const [initMessages, setInitMessages] = useState<MessageBlock[] | undefined>(undefined);

  // Init messages
  useEffect(() => {
    if (snapshotInit) {
      let temp_msg: MessageBlock[] = [];
      let last_userId = "";

      snapshotInit.docs.forEach(doc => {
        let current_userId = doc.data().uid;
        if (current_userId == last_userId) {
          // If sent by same user, use the last MessageBlock
          temp_msg[temp_msg.length - 1].push(doc.data());
        } else {
          // If not sent by a same user, create a new MessageBlock
          last_userId = current_userId;
          temp_msg.push(new MessageBlock(doc.id, current_userId, [doc.data()]));
        }
      });
      temp_msg.reverse();
      setInitMessages(temp_msg);
    }
  }, [snapshotInit])


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
            <ChatRoom initMessages={initMessages} />
            <ChatInput toggleProfile={toggleProfile} />
          </>}
      </div>
    </>
  );
};

export default ChatWindow;
