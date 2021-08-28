import { FC, memo, useCallback } from "react";
import * as TYPES from "../../types";
import styles from "./styles.module.scss";

interface RecommandProps {
  text: string; // 推荐回复消息
  onSend: (type: TYPES.MessageType, data: string) => void;  // 触发发送
  onClose: () => void;  // 触发关闭
}

const Recommand: FC<RecommandProps> = ({ text, onSend, onClose }) => {
  const onCloseBtnClick = useCallback((ev) => {
    ev.stopPropagation();
    onClose && onClose();
  }, [onClose])
  const onTextClick = useCallback(() => {
    onClose && onClose();
    onSend && onSend(TYPES.MessageType.text, text);
  }, [onClose, onSend, text])

  return (
    <div className={styles.container} onClick={onTextClick}>
      <span className={styles.closeBtn} onClick={onCloseBtnClick}>x</span>
      <p>{ text }</p>
    </div>
  );
};

export default memo(Recommand);