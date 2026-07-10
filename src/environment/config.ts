import { DeploymentEnvironmentName } from "./types";

export enum EnvironmentVariableKeys {
  BACKEND_API_URL = "BACKEND_API_URL",
}

type Environments = Record<DeploymentEnvironmentName, Record<EnvironmentVariableKeys, string>>;

const environmentConfigs: Environments = {
  [DeploymentEnvironmentName.LOCAL]: { BACKEND_API_URL: "http://localhost:3000" },
  [DeploymentEnvironmentName.DEVELOPMENT]: { BACKEND_API_URL: "https://api.backend.com" },
  [DeploymentEnvironmentName.PRODUCTION]: {
    BACKEND_API_URL: "https://api.backend.com",
  },
};

export function getEnvironmentConfig(environmentName?: DeploymentEnvironmentName) {
  const backendApiUrlOverride = import.meta.env.VITE_BACKEND_API_URL as string | undefined;
  if (backendApiUrlOverride) {
    return { BACKEND_API_URL: backendApiUrlOverride };
  }

  const selectedEnvironment =
    environmentName && environmentConfigs[environmentName]
      ? environmentConfigs[environmentName]
      : environmentConfigs[DeploymentEnvironmentName.LOCAL];

  return selectedEnvironment;
}

const environmentName = import.meta.env.VITE_ENVIRONMENT_NAME as
  | DeploymentEnvironmentName
  | undefined;

export const environmentConfig = getEnvironmentConfig(environmentName);
