import { act, renderHook } from "@testing-library/react";

import { ModalStatus, useModalState } from "./useModalState";

describe("useModalState", () => {
  it("should default to closed state", () => {
    const { result } = renderHook(() => useModalState());
    expect(result.current.modalStatus).toBe(ModalStatus.CLOSED);
    expect(result.current.modalIsClosed).toBe(true);
    expect(result.current.modalIsOpen).toBe(false);
  });

  it("should be able to start in an opened state", () => {
    const { result } = renderHook(() => useModalState(ModalStatus.OPEN));
    expect(result.current.modalStatus).toBe(ModalStatus.OPEN);
  });

  it("should be able to transition states using helper functions", () => {
    const { result } = renderHook(() => useModalState());
    act(() => {
      result.current.openModal();
    });
    expect(result.current.modalStatus).toBe(ModalStatus.OPEN);
    act(() => {
      result.current.closeModal();
    });
    expect(result.current.modalStatus).toBe(ModalStatus.CLOSED);
  });

  it("should be able to transition states using setter", () => {
    const { result } = renderHook(() => useModalState());
    act(() => {
      result.current.setModalStatus(ModalStatus.CLOSED);
    });
    expect(result.current.modalStatus).toBe(ModalStatus.CLOSED);
  });
});
