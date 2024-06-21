import { MockAppWrapper } from "@src/mocks/MockAppWrapper";
import { mockApiServer } from "@src/mocks/server";
import { renderHook, waitFor } from "@testing-library/react";

import { deletePostErrorScenario } from "./testUtils/handlers";
import { useDeletePost } from "./useDeletePost";

describe("useDeletePost", () => {
  const requestParams = {
    postId: 1,
  };

  it("should successfully delete post", async () => {
    const { result } = renderHook(() => useDeletePost(requestParams), {
      wrapper: MockAppWrapper,
    });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({});
  });

  it("should handle errors", async () => {
    mockApiServer.use(deletePostErrorScenario);

    const { result } = renderHook(() => useDeletePost(requestParams), {
      wrapper: MockAppWrapper,
    });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(true);
  });
});
