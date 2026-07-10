import { queryClient } from "@src/api";
import { useAuthContext } from "@src/auth/useAuth";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";

import { chatMessagesQueryKey } from "../api/useChatMessages";
import { getChatSocket } from "./chatSocket";

interface UseChatSocketResult {
  socket?: Socket;
  partnerTyping: boolean;
  emitTyping: (isTyping: boolean) => void;
}

export function useChatSocket(): UseChatSocketResult {
  const { authState } = useAuthContext();
  const relationshipId = authState?.relationshipId;
  const userId = authState?.user.id;
  const [partnerTyping, setPartnerTyping] = useState(false);
  const socketRef = useRef<Socket>();
  const typingTimeoutRef = useRef<number>();

  useEffect(() => {
    if (!relationshipId || !userId) {
      return undefined;
    }

    const socket = getChatSocket({ relationshipId, userId });
    socketRef.current = socket;

    const handleNew = () => {
      void queryClient.invalidateQueries({ queryKey: chatMessagesQueryKey });
    };
    const handleRead = () => {
      void queryClient.invalidateQueries({ queryKey: chatMessagesQueryKey });
    };
    const handleSnapOpened = () => {
      void queryClient.invalidateQueries({ queryKey: chatMessagesQueryKey });
    };
    const handleReaction = () => {
      void queryClient.invalidateQueries({ queryKey: chatMessagesQueryKey });
    };
    const handleTyping = (payload: { isTyping?: boolean }) => {
      setPartnerTyping(Boolean(payload?.isTyping));
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
      if (payload?.isTyping) {
        typingTimeoutRef.current = window.setTimeout(() => setPartnerTyping(false), 4000);
      }
    };

    socket.on("chat:new", handleNew);
    socket.on("chat:read", handleRead);
    socket.on("chat:snap-opened", handleSnapOpened);
    socket.on("chat:reaction", handleReaction);
    socket.on("chat:typing", handleTyping);

    return () => {
      socket.off("chat:new", handleNew);
      socket.off("chat:read", handleRead);
      socket.off("chat:snap-opened", handleSnapOpened);
      socket.off("chat:reaction", handleReaction);
      socket.off("chat:typing", handleTyping);
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [relationshipId, userId]);

  const emitTyping = useCallback(
    (isTyping: boolean) => {
      if (!socketRef.current || !relationshipId) {
        return;
      }
      socketRef.current.emit("chat:typing", { relationshipId, isTyping });
    },
    [relationshipId],
  );

  return { socket: socketRef.current, partnerTyping, emitTyping };
}
