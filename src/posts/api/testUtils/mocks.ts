import { type CommentsResponse } from "../useGetPostComments";
import { type PostsResponse } from "../useGetPosts";

export const mockPosts: PostsResponse = [
  {
    id: 1,
    userId: 1,
    title: "Test Post",
    body: "Test Body",
  },
  {
    id: 2,
    userId: 1,
    title: "Some Post",
    body: "Some Body",
  },
];

export const mockComments: CommentsResponse = [
  {
    id: 1,
    postId: 1,
    name: "Test User",
    email: "test@email.com",
    body: "Test Body",
  },
  {
    id: 2,
    postId: 1,
    name: "Some User",
    email: "some@email.com",
    body: "Some Body",
  },
];
