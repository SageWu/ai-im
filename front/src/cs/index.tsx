import { FC, memo, useCallback } from "react";
import * as TYPES from "../types";
import ChatHeader from "../components/chat-header";
import Messages from "../components/messages";
import ChatInput from "../components/chat-input";
import { useSocket } from "../hooks/socket";
import Recommand from "./recommand";
import styles from "./styles.module.scss";

const USER_ID = "cs0";

const CustomerService: FC = () => {
  const { messages, recommand, send, updateRecommand } = useSocket("cs", USER_ID);

  const onSend = useCallback((type: TYPES.MessageType, data: string) => {
    if (!messages.length) {
      alert("客服需要用户先接入才能发送消息");
      return;
    }
    send(messages[0].socketId || "", type, data);
  }, [messages, send]);
  const onClose = useCallback(() => {
    updateRecommand("");
  }, [updateRecommand])

  return (
    <div className={styles.container}>
      <ChatHeader title="用户" />
      <Messages messages={messages} userId={USER_ID} />
      {recommand && <Recommand text={recommand} onSend={onSend} onClose={onClose} />}
      <ChatInput onSend={onSend} />
    </div>
  );
}

export default memo(CustomerService);