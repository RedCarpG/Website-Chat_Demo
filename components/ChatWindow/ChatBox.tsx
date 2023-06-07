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

interface ChatProfileProps {
    userId: string;
    text: string;
}
const ChatProfile: React.FC<ChatProfileProps> = ({ userId, text }) => {
    const [userName, setUserName] = useState(
        <span className={styles.deleted_anonymous}>{`Deleted User`}</span>
    );
    const [avatar, setAvatar] = useState(getRandomOptions());
    const [isUser, setIsUsr] = useState(false);

    useEffect(() => {
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
    }, [userId])

    return <>
        {<div
            className={`message ${isUser ? styles.user_chat_box : styles.chat_box
                }`}
        >
            {isUser ? (
                <>
                    <div className={styles.chat_box_left}>
                        <div className={`${styles.name} ${styles.chat_box_name}`}>
                            {userName}
                        </div>
                        <div className={styles.chat_box_content}>{text}</div>
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
        }
    </>
}


interface ChatBoxProps {
    messageId: string;
}
const ChatBox: React.FC<ChatBoxProps> = ({ messageId }) => {
    const [msg, setMsg] = useState<DocumentData | undefined>(undefined);

    useEffect(() => {
        getMsgDataOnce(messageId).then((x) => {
            setMsg(x.data());
        }).catch((e) => {
            console.log(e);
        });
    }, [messageId])

    if (msg) {
        return (
            <>
                <ChatProfile
                    userId={msg.uid} text={msg.text}
                />
            </>
        );
    }
    return <></>;
};

export default ChatBox;