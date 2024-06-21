import { environmentConfigMock } from "@src/environment/mocks/environmentConfigMock";
import { http, type HttpHandler, HttpResponse } from "msw";

import { mockPosts } from "./mocks";

const TEST_API_URL = environmentConfigMock.BACKEND_API_URL;

const getPostsSuccessScenario = http.get(`${TEST_API_URL}/posts`, () => {
  return HttpResponse.json(mockPosts);
});

export const getPostsErrorScenario = http.get(`${TEST_API_URL}/posts`, () => {
  return new HttpResponse(null, {
    status: 500,
  });
});

const getPostSuccessScenario = http.get(`${TEST_API_URL}/posts/*`, () => {
  return HttpResponse.json(mockPosts[0]);
});

export const getPostErrorScenario = http.get(`${TEST_API_URL}/posts/*`, () => {
  return new HttpResponse(null, {
    status: 500,
  });
});

const createPostSuccessScenario = http.post(`${TEST_API_URL}/posts`, () => {
  return HttpResponse.json(mockPosts[0]);
});

export const createPostErrorScenario = http.post(`${TEST_API_URL}/posts`, () => {
  return new HttpResponse(null, {
    status: 500,
  });
});

const deletePostSuccessScenario = http.delete(`${TEST_API_URL}/posts`, () => {
  return HttpResponse.json({});
});

export const deletePostErrorScenario = http.delete(`${TEST_API_URL}/posts`, () => {
  return new HttpResponse(null, {
    status: 500,
  });
});

const getCommentsSuccessScenario = http.get(`${TEST_API_URL}/posts/*/comments`, () => {
  return HttpResponse.json({});
});

export const getCommentsErrorScenario = http.get(`${TEST_API_URL}/posts/*/comments`, () => {
  return new HttpResponse(null, {
    status: 500,
  });
});

export const postsTestHandlers: HttpHandler[] = [
  getPostsSuccessScenario,
  getPostSuccessScenario,
  createPostSuccessScenario,
  deletePostSuccessScenario,
  getCommentsSuccessScenario,
];
