import { MockAppWrapper } from "@src/mocks/MockAppWrapper";
import { mockApiServer } from "@src/mocks/server";
import { render, screen, waitFor, waitForElementToBeRemoved, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getPostsErrorScenario } from "../api/testUtils/handlers";
import { mockPosts } from "../api/testUtils/mocks";
import { Posts } from "./Posts";

const mockedUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actualRouterDom = await vi.importActual("react-router-dom");
  return {
    ...actualRouterDom,
    useNavigate: () => mockedUseNavigate,
  };
});

describe("Posts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <MockAppWrapper>
        <Posts />
      </MockAppWrapper>,
    );
  };

  it("should render posts list correctly", async () => {
    renderComponent();

    await waitForElementToBeRemoved(screen.getByRole("progressbar"));

    expect(screen.getByText(mockPosts[0].title)).toBeInTheDocument();
    expect(screen.getByText(mockPosts[0].body)).toBeInTheDocument();
    expect(screen.getByText(mockPosts[1].title)).toBeInTheDocument();
    expect(screen.getByText(mockPosts[1].body)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Add Post" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Post" })).not.toBeDisabled();
  });

  it("should navigate to post detail page on clicking the post", async () => {
    renderComponent();

    await waitForElementToBeRemoved(screen.getByRole("progressbar"));

    await userEvent.click(screen.getByText(mockPosts[0].title));

    expect(mockedUseNavigate).toHaveBeenCalledWith(`/posts/${mockPosts[0].id}`);
  });

  it("should show the error message if posts list call fails", async () => {
    mockApiServer.use(getPostsErrorScenario);
    renderComponent();

    await waitForElementToBeRemoved(screen.getByRole("progressbar"));

    await waitFor(async () => {
      expect(screen.getByRole("alert", { hidden: true })).toHaveTextContent(
        "Error while getting posts",
      );
    });
  });

  it("should open add post form on clicking the add post button", async () => {
    renderComponent();

    await waitForElementToBeRemoved(screen.getByRole("progressbar"));

    await userEvent.click(screen.getByRole("button", { name: "Add Post" }));

    const addPostDialog = within(await screen.findByRole("dialog"));
    expect(addPostDialog.getByText("Add Post")).toBeInTheDocument();

    await userEvent.type(addPostDialog.getByLabelText("Title for post"), "Post Title");
    await userEvent.type(addPostDialog.getByLabelText("Body for post"), "Sample Post Body");
    await userEvent.click(addPostDialog.getByRole("button", { name: "Submit" }));

    expect(screen.getByRole("alert", { hidden: true })).toHaveTextContent(
      "Successfully added the post",
    );
    await waitForElementToBeRemoved(screen.queryByRole("dialog"));
  });
});
