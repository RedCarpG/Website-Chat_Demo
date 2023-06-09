import styles from "../../styles/ChatRoom.module.scss";
import React, {
    useEffect,
    useState,
} from "react";

import {
    getUser,
    getMsgDataOnce,
    isCurrentUser,
} from "../../utils/database";
import Avatar from "../Avatar";
import { getRandomOptions } from "../../utils/avatar";
import { DocumentData } from "firebase/firestore";

interface ChatBoxProps {
    messagesData: DocumentData[];
}
const ChatBox: React.FC<ChatBoxProps> = ({ messagesData }) => {

    const [userName, setUserName] = useState(
        <span className={styles.deleted_anonymous}>{`Deleted User`}</span>
    );
    const [avatar, setAvatar] = useState(getRandomOptions());
    const [isUser, setIsUsr] = useState(false);
    const [userId, setUserId] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (messagesData[0]) {
            setUserId(messagesData[0].uid);
        }
    }, [messagesData])

    useEffect(() => {
        if (userId) {
            getUser(userId).then((data) => {
                setIsUsr(isCurrentUser(userId));
                let profile = data.data();
                if (profile) {
                    setAvatar(profile?.userAvatar);
                    setUserName(
                        <span className={profile?.isAnonymous ? styles.anonymous : ""}>
                            {profile?.userName}
                        </span>
                    );
                }

            }).catch((e) => {
                console.log(e);
            });
        }
    }, [userId])

    return <>
        {<div
            className={`message ${isUser ? styles.user_chat_box : styles.chat_box
                }`}
        >
            {isUser ? (
                <>
                    <div className={styles.chat_box_text}>
                        <div className={`${styles.name} ${styles.chat_box_name}`}>
                            {userName}
                        </div>
                        {messagesData.map((e, index) => {
                            return <div key={index} className={styles.chat_box_text_content}>{e.text}</div>
                        })}
                    </div>
                </>
            ) : (
                <>
                    <div className={styles.chat_box_profile}>
                        <Avatar {...avatar} />
                    </div>
                    <div className={styles.chat_box_text}>
                        <div className={styles.chat_box_name}>
                            {userName}
                        </div>
                        {messagesData.map((e, index) => {
                            return <div key={index} className={styles.chat_box_text_content}>{e.text}</div>
                        })}
                    </div>
                </>
            )}
        </div>
        }
    </>
};

export default ChatBox;