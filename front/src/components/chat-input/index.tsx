import { FC, memo, useRef, useCallback } from "react";
import * as TYPES from "../../types";
import styles from "./styles.module.scss";

interface ChatInputProps {
  onSend: (type: TYPES.MessageType, data: string) => void;  // 触发消息发送
}

const ChatInput: FC<ChatInputProps> = ({ onSend }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSendBtnClick = useCallback(() => {
    const text = inputRef.current?.value || "";
    if (!text) {
      return;
    }
    
    onSend && onSend(TYPES.MessageType.text, text); 
    inputRef.current && (inputRef.current.value = "");
  }, [onSend]);
  const onInputKeyDown = useCallback((ev) => {
    if (ev.keyCode === 13) {
      onSendBtnClick();
    }
  }, [onSendBtnClick]);

  const onPictureBtnClick = useCallback(() => {
    fileRef.current?.click();
  }, []);
  const onPictureSelected = useCallback(() => {
    const files = fileRef.current?.files || [];
    if (!files.length) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onSend && onSend(TYPES.MessageType.image, reader.result as string);
    }
    reader.onerror = (e) => {
      // todo
    }
    reader.readAsDataURL(files[0]);
  }, [onSend])


  return (
    <div className={styles.container}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={onPictureSelected} />
      <button
        className={`${styles.btn} ${styles.pictureBtn}`}
        onClick={onPictureBtnClick}>
        图片
      </button>
      <input
        ref={inputRef}
        type="text"
        onKeyDown={onInputKeyDown} />
      <button
        className={`${styles.btn} ${styles.sendBtn}`}
        onClick={onSendBtnClick}>
        发送
      </button>
    </div>
  );
};

export default memo(ChatInput);