// E:\astra\astra-terminal\components\modal\modal.js

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";

function Modal({
  isOpen,
  onClose,
  submit,
  children,
  inputValue,
  isDisable,
  buttonLabel,
}) {
  const [isMd, setIsMd] = useState(false);
  const [isInputEmpty, setIsInputEmpty] = useState(true);

  const checkScreenWidth = () => {
    setIsMd(window.innerWidth < 768);
  };

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  useEffect(() => {
    setIsInputEmpty(inputValue ? !inputValue.trim() : true);
  }, [inputValue]);

  return (
    <div
      className={`fixed inset-0 z-10 overflow-y-auto ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="flex min-h-screen  items-center justify-center p-5 sm:p-0">
        <div className="fixed inset-0 bg-black opacity-100" />
        <div className="relative z-20 w-full max-w-lg overflow-hidden  bg-black shadow-xl">
          <button
            className="absolute right-0 top-0 m-5"
            type="button"
            onClick={() => onClose()}
            aria-label="Close"
          >
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          {children}
          <div>
            {buttonLabel === "Next" && (
              <Button
                className={`w-full max-w-lg ${isMd ? "mb-6" : ""}`}
                onClick={() => {
                  submit();
                }}
                disabled={isInputEmpty || isDisable}
              >
                Next
              </Button>
            )}
            {buttonLabel === "Done" && (
              <Button
                className="  w-full"
                onClick={() => {
                  submit();
                }}
              >
                Done
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
