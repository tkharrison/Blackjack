import React, { useRef, useEffect, ReactNode } from "react";
import styles from "./styles.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (isOpen) {
        if (!dialog.open) {
          dialog.showModal();
        }
      } else {
        if (dialog.open) {
          dialog.close();
        }
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose && onClose();
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  return (
    <>
      {isOpen && (
        <>
          <div className={styles.modalOverlay} onClick={onClose}></div>
          <dialog ref={dialogRef} className={styles.modalDialog}>
            <div className={styles.modalContent}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <div className={styles.modalBody}>{children}</div>
            </div>
          </dialog>
        </>
      )}
    </>
  );
};

export default Modal;
