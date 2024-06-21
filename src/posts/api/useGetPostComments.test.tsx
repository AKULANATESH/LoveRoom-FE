import { MockAppWrapper } from "@src/mocks/MockAppWrapper";
import { mockApiServer } from "@src/mocks/server";
import { renderHook, waitFor } from "@testing-library/react";

import { getCommentsErrorScenario } from "./testUtils/handlers";
import { mockComments } from "./testUtils/mocks";
import { useGetPostComments } from "./useGetPostComments";

describe("useGetPostComments", () => {
  const requestParams = {
    postId: 1,
  };

  it("should successfully return post comments", async () => {
    const { result } = renderHook(() => useGetPostComments(requestParams), {
      wrapper: MockAppWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockComments);
  });

  it("should handle errors", async () => {
    mockApiServer.use(getCommentsErrorScenario);

    const { result } = renderHook(() => useGetPostComments(requestParams), {
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
