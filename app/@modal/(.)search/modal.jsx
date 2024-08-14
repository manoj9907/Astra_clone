"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export default function Modal({ children }) {
  const router = useRouter();
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  function onDismiss() {
    router.back();
  }

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null; // Handle the case where modal-root is not found

  return createPortal(
    <div className="modal-backdrop">
      <dialog ref={dialogRef} className="modal" onClose={onDismiss}>
        <button type="button" className="close-button" onClick={onDismiss}>
          &times;
        </button>
        {children}
      </dialog>
    </div>,
    modalRoot,
  );
}
