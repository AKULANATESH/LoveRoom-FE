import { type Dispatch, useState } from "react";

export enum ModalStatus {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
}

export interface UseModalState {
  modalStatus: ModalStatus;
  setModalStatus: Dispatch<ModalStatus>;
  modalIsClosed: boolean;
  modalIsOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export function useModalState(initialModalStatus = ModalStatus.CLOSED): UseModalState {
  const [modalStatus, setModalStatus] = useState<ModalStatus>(initialModalStatus);
  function openModal() {
    setModalStatus(ModalStatus.OPEN);
  }

  function closeModal() {
    setModalStatus(ModalStatus.CLOSED);
  }

  return {
    modalStatus,
    setModalStatus,
    modalIsClosed: modalStatus === ModalStatus.CLOSED,
    modalIsOpen: modalStatus === ModalStatus.OPEN,
    openModal,
    closeModal,
  };
}
