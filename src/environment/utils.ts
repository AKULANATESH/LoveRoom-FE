import { NodeEnvironment } from "./types";

export function isDevelopmentNodeEnvironment() {
  return import.meta.env.VITE_NODE_ENV === NodeEnvironment.DEVELOPMENT;
}

export function isTestNodeEnvironment() {
  return import.meta.env.VITE_NODE_ENV === NodeEnvironment.TEST;
}

export function isProductionNodeEnvironment() {
  return import.meta.env.VITE_NODE_ENV === NodeEnvironment.PRODUCTION;
}
