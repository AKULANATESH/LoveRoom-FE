import { MockAppWrapper } from "@src/mocks/MockAppWrapper";
import { mockApiServer } from "@src/mocks/server";
import { renderHook, waitFor } from "@testing-library/react";

import { getPostErrorScenario } from "./testUtils/handlers";
import { mockPosts } from "./testUtils/mocks";
import { useGetPost } from "./useGetPost";

describe("useGetPost", () => {
  const requestParams = {
    postId: 1,
  };

  it("should successfully return post", async () => {
    const { result } = renderHook(() => useGetPost(requestParams), {
      wrapper: MockAppWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockPosts[0]);
  });

  it("should handle errors", async () => {
    mockApiServer.use(getPostErrorScenario);

    const { result } = renderHook(() => useGetPost(requestParams), {
      wrapper: MockAppWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(true);
  });
});
