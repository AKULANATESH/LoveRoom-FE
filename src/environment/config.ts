import { DeploymentEnvironmentName } from "./types";

export enum EnvironmentVariableKeys {
  BACKEND_API_URL = "BACKEND_API_URL",
}

type Environments = Record<DeploymentEnvironmentName, Record<EnvironmentVariableKeys, string>>;

const environmentConfigs: Environments = {
  [DeploymentEnvironmentName.LOCAL]: { BACKEND_API_URL: "https://jsonplaceholder.typicode.com" },
  [DeploymentEnvironmentName.DEVELOPMENT]: { BACKEND_API_URL: "https://api.backend.com" },
  [DeploymentEnvironmentName.PRODUCTION]: {
    BACKEND_API_URL: "https://api.backend.com",
  },
};

export function getEnvironmentConfig(environmentName: DeploymentEnvironmentName) {
  const selectedEnvironment = environmentConfigs[environmentName];
  return selectedEnvironment ?? environmentConfigs[DeploymentEnvironmentName.PRODUCTION];
}

export const environmentConfig = getEnvironmentConfig(
  import.meta.env.VITE_ENVIRONMENT_NAME as DeploymentEnvironmentName,
);
