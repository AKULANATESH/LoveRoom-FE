import { environmentConfig } from "@src/environment";
import { io, type Socket } from "socket.io-client";

let socket: Socket | undefined;
let currentKey: string | undefined;

interface ChatSocketParams {
  relationshipId: string;
  userId: string;
}

export function getChatSocket({ relationshipId, userId }: ChatSocketParams): Socket {
  const key = `${relationshipId}:${userId}`;

  if (socket && currentKey === key) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
    socket = undefined;
  }

  socket = io(`${environmentConfig.BACKEND_API_URL}/chat`, {
    transports: ["websocket"],
    query: { relationshipId, userId },
  });
  currentKey = key;

  return socket;
}
