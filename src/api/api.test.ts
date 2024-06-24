import { z } from "zod";

import { get, post, put, remove } from "./api";

describe("API Client", () => {
  it("should GET data from the API", async () => {
    const responseSchema = z.object({ id: z.number(), name: z.string() });

    const response = await get({
      url: "/test",
      queryParams: {},
      responseSchema,
    });

    expect(response.data).toEqual({
      id: 1,
      name: "Test User",
    });
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("OK");
  });

  it("should GET data from the API with query params", async () => {
    const responseSchema = z.object({ id: z.number(), name: z.string() });

    const response = await get({
      url: "/test",
      queryParams: { firstName: "Karam" },
      responseSchema,
    });

    expect(response.data).toEqual({
      id: 1,
      name: "Karam",
    });
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("OK");
  });

  it("should handle errors for GET requests", async () => {
    const responseSchema = z.object({});

    await expect(
      get({
        url: "/error",
        queryParams: {},
        responseSchema,
      }),
    ).rejects.toThrow("Request failed with status code 500");
  });

  it("should POST data to the API", async () => {
    const responseSchema = z.object({ id: z.number(), name: z.string() });

    const mockData = {
      name: "New User",
      email: "user@example.com",
    };
    const response = await post({
      url: "/test",
      data: mockData,
      queryParams: {},
      responseSchema,
    });

    expect(response.data).toEqual({
      id: 2,
      name: "New User",
    });
    expect(response.status).toBe(201);
    expect(response.statusText).toBe("Created");
  });

  it("should handle errors for POST requests", async () => {
    const responseSchema = z.object({ id: z.number(), name: z.string() });

    const mockData = {
      name: "New User",
      email: "user@example.com",
    };
    await expect(
      post({
        url: "/error",
        data: mockData,
        responseSchema,
      }),
    ).rejects.toThrow("Request failed with status code 500");
  });

  it("should PUT data in the API", async () => {
    const responseSchema = z.object({ id: z.number(), name: z.string() });

    const mockData = {
      name: "Some User",
      email: "some.user@example.com",
    };
    const response = await put({
      url: "/test/1",
      data: mockData,
      queryParams: {},
      responseSchema,
    });

    expect(response.data).toEqual({
      id: 1,
      name: "Some User",
    });
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("OK");
  });

  it("should handle errors for PUT requests", async () => {
    const responseSchema = z.object({ id: z.number(), name: z.string() });

    const mockData = {
      name: "Some User",
      email: "some.user@example.com",
    };
    await expect(
      put({
        url: "/error/1",
        data: mockData,
        responseSchema,
      }),
    ).rejects.toThrow("Request failed with status code 500");
  });

  it("should DELETE data from the API", async () => {
    const responseSchema = z.object({});

    const response = await remove({
      url: "/test/1",
      data: {},
      queryParams: {},
      responseSchema,
    });
    expect(response.data).toEqual({});
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("OK");
  });

  it("should handle errors for DELETE requests", async () => {
    const responseSchema = z.object({});
    await expect(
      remove({
        url: "/error/1",
        data: {},
        responseSchema,
      }),
    ).rejects.toThrow("Request failed with status code 500");
  });
});
