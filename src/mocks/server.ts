import { postsTestHandlers } from "@src/posts/api/testUtils/handlers";
import { setupServer } from "msw/node";

export const mockApiServer = setupServer(...postsTestHandlers);
