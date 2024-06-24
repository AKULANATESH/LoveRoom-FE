import { environmentConfigMock } from "@src/environment/mocks/environmentConfigMock";
import { http, HttpResponse } from "msw";

const TEST_API_URL = environmentConfigMock.BACKEND_API_URL;

export const apiTestHandlers = [
  http.get(`${TEST_API_URL}/test`, async ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get("firstName") ?? "Test User";
    return HttpResponse.json({ id: 1, name });
  }),
  http.post(`${TEST_API_URL}/test`, () => {
    return HttpResponse.json({ id: 2, name: "New User" }, { status: 201 });
  }),
  http.put(`${TEST_API_URL}/test/1`, () => {
    return HttpResponse.json({ id: 1, name: "Some User" });
  }),
  http.delete(`${TEST_API_URL}/test/1`, () => {
    return HttpResponse.json({});
  }),
  http.get(`${TEST_API_URL}/error`, async () => {
    return HttpResponse.json(
      {},
      {
        status: 500,
        statusText: "Internal Server Error",
      },
    );
  }),
  http.post(`${TEST_API_URL}/error`, () => {
    return HttpResponse.json(
      {},
      {
        status: 500,
        statusText: "Internal Server Error",
      },
    );
  }),
  http.put(`${TEST_API_URL}/error/1`, () => {
    return HttpResponse.json(
      {},
      {
        status: 500,
        statusText: "Internal Server Error",
      },
    );
  }),
  http.delete(`${TEST_API_URL}/error/1`, () => {
    return HttpResponse.json(
      {},
      {
        status: 500,
        statusText: "Internal Server Error",
      },
    );
  }),
];
