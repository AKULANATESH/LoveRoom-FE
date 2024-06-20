import axios from "axios";
import type * as z from "zod";

import { environmentConfig, isDevelopmentNodeEnvironment } from "../environment";

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface CommonApiParams<ResponseSchema> {
  url: string;
  responseSchema: z.ZodType<ResponseSchema>;
  queryParams?: Record<string, unknown>;
}

export interface ApiParams<RequestSchema, ResponseSchema> extends CommonApiParams<ResponseSchema> {
  data?: RequestSchema;
}

const apiClient = axios.create({
  baseURL: environmentConfig.BACKEND_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error instanceof Error) {
      throw error;
    }
  },
);

export async function get<ResponseSchema>({
  url,
  queryParams,
  responseSchema,
}: CommonApiParams<ResponseSchema>): Promise<ApiResponse<ResponseSchema>> {
  const response = await apiClient.get<ResponseSchema>(url, { params: queryParams });

  if (isDevelopmentNodeEnvironment()) {
    try {
      responseSchema.parse(response.data);
    } catch (error) {
      throw new Error(`${String(error)}: ${JSON.stringify({ url, queryParams })}`);
    }
  }

  return response;
}

export async function post<RequestSchema, ResponseSchema>({
  url,
  data,
  queryParams,
  responseSchema,
}: ApiParams<RequestSchema, ResponseSchema>): Promise<ApiResponse<ResponseSchema>> {
  const response = await apiClient.post<ResponseSchema>(url, data, { params: queryParams });

  if (isDevelopmentNodeEnvironment()) {
    try {
      responseSchema.parse(response.data);
    } catch (error) {
      throw new Error(`${String(error)}: ${JSON.stringify({ url, data, queryParams })}`);
    }
  }

  return response;
}

export async function put<RequestSchema, ResponseSchema>({
  url,
  data,
  queryParams,
  responseSchema,
}: ApiParams<RequestSchema, ResponseSchema>): Promise<ApiResponse<ResponseSchema>> {
  const response = await apiClient.put<ResponseSchema>(url, data, { params: queryParams });

  if (isDevelopmentNodeEnvironment()) {
    try {
      responseSchema.parse(response.data);
    } catch (error) {
      throw new Error(`${String(error)}: ${JSON.stringify({ url, data, queryParams })}`);
    }
  }

  return response;
}

export async function patch<RequestSchema, ResponseSchema>({
  url,
  data,
  queryParams,
  responseSchema,
}: ApiParams<RequestSchema, ResponseSchema>): Promise<ApiResponse<ResponseSchema>> {
  const response = await apiClient.patch<ResponseSchema>(url, data, { params: queryParams });

  if (isDevelopmentNodeEnvironment()) {
    try {
      responseSchema.parse(response.data);
    } catch (error) {
      throw new Error(`${String(error)}: ${JSON.stringify({ url, data, queryParams })}`);
    }
  }

  return response;
}

export async function remove<RequestSchema, ResponseSchema>({
  url,
  data,
  responseSchema,
  queryParams,
}: ApiParams<RequestSchema, ResponseSchema>): Promise<ApiResponse<ResponseSchema>> {
  const response = await apiClient.delete<ResponseSchema>(url, { params: queryParams });

  if (isDevelopmentNodeEnvironment()) {
    try {
      responseSchema.parse(response.data);
    } catch (error) {
      throw new Error(`${String(error)}: ${JSON.stringify({ url, data, queryParams })}`);
    }
  }

  return response;
}
