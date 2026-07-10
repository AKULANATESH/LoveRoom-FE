export type ChatMessageKind = "TEXT" | "IMAGE" | "SNAP";

export interface ChatMessage {
  id: string;
  mine: boolean;
  type: ChatMessageKind;
  text?: string;
  imageData?: string;
  caption?: string;
  viewOnce: boolean;
  opened: boolean;
  reaction?: string;
  readByPartner: boolean;
  createdAt: string;
  timeLabel: string;
}

export interface SendChatMessageRequest {
  type: ChatMessageKind;
  text?: string;
  imageData?: string;
  caption?: string;
  viewOnce?: boolean;
}

export interface OpenSnapResponse {
  id: string;
  imageData?: string;
  caption?: string;
}

export type CallType = "video" | "audio";

export type CallStatus =
  | "idle"
  | "calling"
  | "incoming"
  | "connecting"
  | "connected"
  | "ended";
