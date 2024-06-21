import { MockAppWrapper } from "@src/mocks/MockAppWrapper";
import { mockApiServer } from "@src/mocks/server";
import { renderHook, waitFor } from "@testing-library/react";

import { getPostsErrorScenario } from "./testUtils/handlers";
import { mockPosts } from "./testUtils/mocks";
import { useGetPosts } from "./useGetPosts";

describe("useGetPosts", () => {
  it("should successfully return posts", async () => {
    const { result } = renderHook(() => useGetPosts(), {
      wrapper: MockAppWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockPosts);
  });

  it("should handle errors", async () => {
    mockApiServer.use(getPostsErrorScenario);

    const { result } = renderHook(() => useGetPosts(), {
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
