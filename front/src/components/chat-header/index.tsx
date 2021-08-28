import { FC, memo } from "react";
import "./styles.scss"

interface ChatHeaderProps {
  title: string;
}

const ChatHeader: FC<ChatHeaderProps> = ({ title }) => {
  return (
    <header>
      <p>{ title }</p>
    </header>
  );
};

export default memo(ChatHeader);