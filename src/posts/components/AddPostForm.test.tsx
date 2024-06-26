import { ModalStatus, type UseModalState } from "@src/lib/modals/useModalState";
import { MockAppWrapper } from "@src/mocks/MockAppWrapper";
import { mockApiServer } from "@src/mocks/server";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createPostErrorScenario } from "../api/testUtils/handlers";
import { AddPostForm } from "./AddPostForm";

describe("AddPostForm", () => {
  const mockCloseModal = vi.fn();
  const mockOnSucess = vi.fn();

  const mockModalState: UseModalState = {
    openModal: () => undefined,
    closeModal: mockCloseModal,
    modalIsOpen: true,
    modalIsClosed: false,
    modalStatus: ModalStatus.OPEN,
    setModalStatus: () => undefined,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <MockAppWrapper>
        <AddPostForm modalState={mockModalState} onSuccess={mockOnSucess} />
      </MockAppWrapper>,
    );
  };

  it("should render add post form correctly", async () => {
    renderComponent();

    expect(screen.getByLabelText("Title for post")).toBeInTheDocument();
    expect(screen.getByLabelText("Body for post")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  it("should enable submit button if all required fields are filled", async () => {
    renderComponent();

    await userEvent.type(screen.getByLabelText("Title for post"), "Post Title");
    await userEvent.type(screen.getByLabelText("Body for post"), "Sample Post Body");
    expect(screen.getByRole("button", { name: "Submit" })).not.toBeDisabled();
  });

  it("should show the success message & call onSucess when a post is successfully added", async () => {
    renderComponent();

    await userEvent.type(screen.getByLabelText("Title for post"), "Post Title");
    await userEvent.type(screen.getByLabelText("Body for post"), "Sample Post Body");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByRole("alert", { hidden: true })).toHaveTextContent(
      "Successfully added the post",
    );
    expect(mockOnSucess).toHaveBeenCalledOnce();
    expect(mockCloseModal).toHaveBeenCalledOnce();
  });

  it("should show the error message if the attempt to add a post fails", async () => {
    mockApiServer.use(createPostErrorScenario);
    renderComponent();

    await userEvent.type(screen.getByLabelText("Title for post"), "Post Title");
    await userEvent.type(screen.getByLabelText("Body for post"), "Sample Post Body");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(async () => {
      expect(screen.getByRole("alert", { hidden: true })).toHaveTextContent(
        "Error while adding the post",
      );
    });

    expect(mockOnSucess).not.toHaveBeenCalled();
  });
});
