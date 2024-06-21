import { MockAppWrapper } from "@src/mocks/MockAppWrapper";
import { mockApiServer } from "@src/mocks/server";
import { renderHook, waitFor } from "@testing-library/react";

import { createPostErrorScenario } from "./testUtils/handlers";
import { mockPosts } from "./testUtils/mocks";
import { useCreatePost } from "./useCreatePost";

describe("useCreatePost", () => {
  const requestBody = {
    userId: 1,
    title: "Test Post",
    body: "Test Body",
  };

  it("should successfully add post", async () => {
    const { result } = renderHook(() => useCreatePost(), {
      wrapper: MockAppWrapper,
    });

    result.current.mutate(requestBody);

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockPosts[0]);
  });

  it("should handle errors", async () => {
    mockApiServer.use(createPostErrorScenario);

    const { result } = renderHook(() => useCreatePost(), {
      wrapper: MockAppWrapper,
    });

    result.current.mutate(requestBody);

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(true);
  });
});
