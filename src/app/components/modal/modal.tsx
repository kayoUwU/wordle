import { memo, RefObject } from "react";
import styles from "./modal.module.css";

function Modal({
  modalRef,
  onCloseModal,
  closeButtonText,
  modalTitle,
  modalContent,
}: {
  modalRef: RefObject<HTMLDialogElement>;
  onCloseModal: () => void;
  closeButtonText?: string;
  modalTitle?: string;
  modalContent: JSX.Element;
}) {
  return (
    <dialog
      ref={modalRef}
      onClick={(e) => {
        // Closes if you click the backdrop (outside the white box)
        if (e.target === modalRef.current) onCloseModal();
      }}
      className={`${styles["modal"]} slideUp`}
    >
      <div>
        {modalTitle && <h1>{modalTitle}</h1>}

        {modalContent}

        <button onClick={onCloseModal}>{closeButtonText || "Got it!"}</button>
      </div>
    </dialog>
  );
}

export default memo(Modal);
