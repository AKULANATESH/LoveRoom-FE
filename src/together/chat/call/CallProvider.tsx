import constate from "constate";

import { useWebRTCCall } from "./useWebRTCCall";

export const [CallProvider, useCall] = constate(useWebRTCCall);
