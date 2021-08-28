export enum MessageType {
  text,
  image,
}
export const MessageTypeMap = new Map<MessageType, string>([
  [MessageType.text, "text"],
  [MessageType.image, "image"],
]);

export interface Message {
  id: number;
  type: MessageType;
  typeStr?: string;
  data: string;
  creator: string;
  socketId?: string;
}