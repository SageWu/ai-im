import { FC, memo, useRef, useEffect } from "react";
import * as TYPES from "../../types";
import Message from "../message";
import styles from "./styles.module.scss";

interface MessagesProps {
  userId: string; // 用户id
  messages: TYPES.Message[];  // 消息列表
}

const Messages: FC<MessagesProps> = ({ messages, userId }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      containerRef.current?.scrollTo({
        top: containerRef.current?.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => clearTimeout(timer);
  }, [messages.length]);

  return (
    <div ref={containerRef} className={styles.container}>
      {
        messages.map((value) => {
          return (
            <Message
              key={value.creator + value.id}
              message={value}
              align={value.creator === userId? "right": "left"} />
          )
        })
      }
    </div>
  );
};

export default memo(Messages);