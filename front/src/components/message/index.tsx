import { FC, memo } from "react";
import * as TYPES from "../../types";
import styles from "./styles.module.scss";

interface MessageProps {
  message: TYPES.Message; // 消息数据
  align?: "left" | "right"; // 消息对齐方向
}

/** 消息背景颜色 */
const MESSAGE_BG_COLOR =  {
  left: "white",
  right: "rgb(12, 182, 12)"
};

const Message: FC<MessageProps> = ({ message, align }) => {
  let body = null;
  switch (message.type) {
    case TYPES.MessageType.text: {
      body = (
        <p>{message.data}</p>
      );
      break;
    }
    case TYPES.MessageType.image: {
      body = (
        <img src={message.data} alt="" />
      )
    }
  }

  return (
    <div
      className={`${styles.container} ${align === "left"? styles.alignLeft: styles.alignRight}`}
      style={{ backgroundColor: align === "left"? MESSAGE_BG_COLOR.left: MESSAGE_BG_COLOR.right }}>
      {body}
    </div>
  );
};

export default memo(Message);