import { apiTestHandlers } from "@src/api/testUtils/handlers";
import { postsTestHandlers } from "@src/posts/api/testUtils/handlers";
import { setupServer } from "msw/node";

export const mockApiServer = setupServer(...apiTestHandlers, ...postsTestHandlers);
