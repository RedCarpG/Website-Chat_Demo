import styles from "../../styles/ChatRoom.module.scss";
import React, {
    FormEventHandler,
    useState,
} from "react";
import { MdOutlineSend, MdPermIdentity } from "react-icons/md";

import {
    storeMessage,
} from "../../utils/database";
import ReactTooltip from "react-tooltip";

interface ChatInputProps {
    toggleProfile: Function;
}
const ChatInput: React.FC<ChatInputProps> = ({ toggleProfile }) => {
    console.log(">----- ChatInput -----<");
    const [inputText, setInputText] = useState("");

    const sendMessage: FormEventHandler<HTMLFormElement> = async (e) => {
        console.log("--- Send Message");
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

export default ChatInput;