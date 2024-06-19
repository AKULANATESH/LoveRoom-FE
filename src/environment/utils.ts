import { NodeEnvironment } from "./types";

export function isDevelopmentNodeEnvironment() {
  return process.env.NODE_ENV === NodeEnvironment.DEVELOPMENT;
}

export function isTestNodeEnvironment() {
  return process.env.NODE_ENV === NodeEnvironment.TEST;
}

export function isProductionNodeEnvironment() {
  return process.env.NODE_ENV === NodeEnvironment.PRODUCTION;
}
