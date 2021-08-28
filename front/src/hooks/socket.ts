import { useRef, useState, useCallback, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import * as TYPES from "../types";

const CHAT_SERVER = "http://localhost:2000";
const EVENT_MAP = {
  cs: "cs",
  join: "join",
  send: "send",
  message: "message",
  recom: "recom",
};

function userInit(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
  socket?.on(EVENT_MAP.cs, (data: string[]) => {
    if (!data?.length) {
      console.error("客服列表为空");
      return;
    }

    socket?.emit(EVENT_MAP.join, {
      target: data[0],
    });
  });
}

function csInit(
  socket: Socket<DefaultEventsMap, DefaultEventsMap>,
  updateRecommand: (value: string) => void,
) {
  socket.on(EVENT_MAP.recom, (value: { creator: string; data: string }) => {
    updateRecommand(value?.data || "");
  });
}

export function useSocket(type: "user" | "cs", userId: string) {
  const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();
  const messages = useRef<TYPES.Message[]>([]);
  const recommand = useRef("");
  const [, forceUpdate] = useState(0);

  const updateRecommand = useCallback((value) => {
    recommand.current = value;
    forceUpdate(0);
  }, []);
  
  useEffect(() => {
    socket.current = io(CHAT_SERVER, {
      transports: ["websocket", "polling"],
      query: {
        type,
        userId: String(userId),
      }
    });
    if (type === "user") {
      userInit(socket.current);
    } else if (type === "cs") {
      csInit(socket.current, updateRecommand);
    }
    socket.current?.on(EVENT_MAP.message, (data) => {
      messages.current = [...messages.current, data];
      forceUpdate(messages.current.length);
    });

    return () => {
      socket.current?.close();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = useCallback((target: string, type: TYPES.MessageType, data: string) => {
    const message: TYPES.Message = {
      id: Date.now(),
      type,
      typeStr: TYPES.MessageTypeMap.get(type),
      data,
      creator: userId,
    };
    socket.current?.emit(EVENT_MAP.send, target, message);
    messages.current = [...messages.current, message];
    forceUpdate(messages.current.length);
  }, [userId]);

  return {
    messages: messages.current,
    recommand: recommand.current,
    send,
    updateRecommand,
  }
}