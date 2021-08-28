import { FC, memo, useCallback } from "react";
import * as TYPES from "../types";
import ChatHeader from "../components/chat-header";
import Messages from "../components/messages";
import ChatInput from "../components/chat-input";
import { useSocket } from "../hooks/socket";
import styles from "./styles.module.scss";

const USER_ID = "u0";

const User: FC = () => {
  const { messages, send } = useSocket("user", USER_ID);
  const onSend = useCallback((type: TYPES.MessageType, data: string) => {
    send("", type, data);
  }, [send]);
  
  return (
    <div className={styles.container}>
      <ChatHeader title="客服" />
      <Messages messages={messages} userId={USER_ID} />
      <ChatInput onSend={onSend} />
    </div>
  );
};

export default memo(User);