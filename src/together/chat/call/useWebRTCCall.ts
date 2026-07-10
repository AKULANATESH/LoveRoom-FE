import { useAuthContext } from "@src/auth/useAuth";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";

import { getChatSocket } from "../realtime/chatSocket";
import type { CallStatus, CallType } from "../types";

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

interface IncomingCall {
  callType: CallType;
  fromName?: string;
}

export interface WebRTCCall {
  status: CallStatus;
  callType?: CallType;
  incoming?: IncomingCall;
  localStream?: MediaStream;
  remoteStream?: MediaStream;
  isMuted: boolean;
  isCameraOff: boolean;
  startCall: (callType: CallType) => Promise<void>;
  acceptCall: () => Promise<void>;
  declineCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
}

export function useWebRTCCall(): WebRTCCall {
  const { authState } = useAuthContext();
  const relationshipId = authState?.relationshipId;
  const userId = authState?.user.id;
  const myName = authState?.user.name;

  const [status, setStatus] = useState<CallStatus>("idle");
  const [callType, setCallType] = useState<CallType>();
  const [incoming, setIncoming] = useState<IncomingCall>();
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const socketRef = useRef<Socket>();
  const pcRef = useRef<RTCPeerConnection>();
  const localStreamRef = useRef<MediaStream>();
  const isCallerRef = useRef(false);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  const cleanup = useCallback(() => {
    pcRef.current?.getSenders().forEach((sender) => {
      try {
        sender.track?.stop();
      } catch {
        /* noop */
      }
    });
    pcRef.current?.close();
    pcRef.current = undefined;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = undefined;
    pendingCandidatesRef.current = [];
    isCallerRef.current = false;
    setLocalStream(undefined);
    setRemoteStream(undefined);
    setIsMuted(false);
    setIsCameraOff(false);
  }, []);

  const resetToIdle = useCallback(() => {
    cleanup();
    setStatus("idle");
    setCallType(undefined);
    setIncoming(undefined);
  }, [cleanup]);

  const getMedia = useCallback(async (type: CallType) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: type === "video",
    });
    localStreamRef.current = stream;
    setLocalStream(stream);
    return stream;
  }, []);

  const createPeerConnection = useCallback(
    (stream: MediaStream) => {
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current && relationshipId) {
          socketRef.current.emit("webrtc:ice", {
            relationshipId,
            candidate: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        setStatus("connected");
      };

      pc.onconnectionstatechange = () => {
        if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed" ||
          pc.connectionState === "closed"
        ) {
          resetToIdle();
        }
      };

      pcRef.current = pc;
      return pc;
    },
    [relationshipId, resetToIdle],
  );

  const flushPendingCandidates = useCallback(async () => {
    const pc = pcRef.current;
    if (!pc) {
      return;
    }
    for (const candidate of pendingCandidatesRef.current) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch {
        /* noop */
      }
    }
    pendingCandidatesRef.current = [];
  }, []);

  useEffect(() => {
    if (!relationshipId || !userId) {
      return undefined;
    }

    const socket = getChatSocket({ relationshipId, userId });
    socketRef.current = socket;

    const onIncoming = (payload: { callType: CallType; fromName?: string }) => {
      if (pcRef.current || status === "connected") {
        socket.emit("call:decline", { relationshipId });
        return;
      }
      setIncoming({ callType: payload.callType, fromName: payload.fromName });
      setCallType(payload.callType);
      setStatus("incoming");
    };

    const onAccepted = async () => {
      if (!isCallerRef.current || !pcRef.current) {
        return;
      }
      setStatus("connecting");
      const pc = pcRef.current;
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("webrtc:offer", { relationshipId, sdp: offer });
    };

    const onOffer = async (payload: { sdp: RTCSessionDescriptionInit }) => {
      const pc = pcRef.current;
      if (!pc) {
        return;
      }
      await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      await flushPendingCandidates();
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("webrtc:answer", { relationshipId, sdp: answer });
    };

    const onAnswer = async (payload: { sdp: RTCSessionDescriptionInit }) => {
      const pc = pcRef.current;
      if (!pc) {
        return;
      }
      await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      await flushPendingCandidates();
    };

    const onIce = async (payload: { candidate: RTCIceCandidateInit }) => {
      const pc = pcRef.current;
      if (!payload?.candidate) {
        return;
      }
      if (!pc || !pc.remoteDescription) {
        pendingCandidatesRef.current.push(payload.candidate);
        return;
      }
      try {
        await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
      } catch {
        /* noop */
      }
    };

    const onDeclined = () => resetToIdle();
    const onCancelled = () => resetToIdle();
    const onEnded = () => resetToIdle();

    socket.on("call:incoming", onIncoming);
    socket.on("call:accepted", onAccepted);
    socket.on("call:declined", onDeclined);
    socket.on("call:cancelled", onCancelled);
    socket.on("call:ended", onEnded);
    socket.on("webrtc:offer", onOffer);
    socket.on("webrtc:answer", onAnswer);
    socket.on("webrtc:ice", onIce);

    return () => {
      socket.off("call:incoming", onIncoming);
      socket.off("call:accepted", onAccepted);
      socket.off("call:declined", onDeclined);
      socket.off("call:cancelled", onCancelled);
      socket.off("call:ended", onEnded);
      socket.off("webrtc:offer", onOffer);
      socket.off("webrtc:answer", onAnswer);
      socket.off("webrtc:ice", onIce);
    };
  }, [relationshipId, userId, status, flushPendingCandidates, resetToIdle]);

  const startCall = useCallback(
    async (type: CallType) => {
      if (!relationshipId || !socketRef.current) {
        return;
      }
      try {
        const stream = await getMedia(type);
        createPeerConnection(stream);
        isCallerRef.current = true;
        setCallType(type);
        setStatus("calling");
        socketRef.current.emit("call:invite", {
          relationshipId,
          callType: type,
          fromName: myName,
        });
      } catch {
        resetToIdle();
      }
    },
    [relationshipId, myName, getMedia, createPeerConnection, resetToIdle],
  );

  const acceptCall = useCallback(async () => {
    if (!relationshipId || !socketRef.current || !incoming) {
      return;
    }
    try {
      const stream = await getMedia(incoming.callType);
      createPeerConnection(stream);
      isCallerRef.current = false;
      setStatus("connecting");
      setIncoming(undefined);
      socketRef.current.emit("call:accept", { relationshipId });
    } catch {
      resetToIdle();
    }
  }, [relationshipId, incoming, getMedia, createPeerConnection, resetToIdle]);

  const declineCall = useCallback(() => {
    if (relationshipId && socketRef.current) {
      socketRef.current.emit("call:decline", { relationshipId });
    }
    resetToIdle();
  }, [relationshipId, resetToIdle]);

  const endCall = useCallback(() => {
    if (relationshipId && socketRef.current) {
      const event = status === "calling" ? "call:cancel" : "call:end";
      socketRef.current.emit(event, { relationshipId });
    }
    resetToIdle();
  }, [relationshipId, status, resetToIdle]);

  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) {
      return;
    }
    const enabled = stream.getAudioTracks().some((track) => track.enabled);
    stream.getAudioTracks().forEach((track) => {
      track.enabled = !enabled;
    });
    setIsMuted(enabled);
  }, []);

  const toggleCamera = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) {
      return;
    }
    const enabled = stream.getVideoTracks().some((track) => track.enabled);
    stream.getVideoTracks().forEach((track) => {
      track.enabled = !enabled;
    });
    setIsCameraOff(enabled);
  }, []);

  return {
    status,
    callType,
    incoming,
    localStream,
    remoteStream,
    isMuted,
    isCameraOff,
    startCall,
    acceptCall,
    declineCall,
    endCall,
    toggleMute,
    toggleCamera,
  };
}
