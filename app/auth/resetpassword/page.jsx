"use client";

import React, { useState } from "react";
import Image from "next/image";
import Modal from "../../../components/modalcomponent/modal_reset";
import { validateEmail } from "../../../utils/validationUtils";
import { SIGNIN_PAGE } from "../../../constants";
import { showAlert } from "@/services/commonservice/AlertService";
import { resetPassword } from "@/app/actions";
import resetPasswordLink from "../../../services/authservice/resetPasswordService";
import back from "@/assets/login/backward-icon.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/input";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const openModal = async (val) => {
    setIsSending(true);
    setShowLoader(true);
    const success = await resetPasswordLink(
      email,
      "Verification Link",
      "Find the verification link below",
      null,
      val,
    );
    setShowLoader(false);
    if (success) {
      setIsModalOpen(true);
    } else {
      showAlert("error", "Please try again later");
    }
    setIsSending(false);
  };

  const onCancel = () => {
    setEmail("");
    window.location.href = SIGNIN_PAGE;
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleForm = async () => {
    const { valid } = validateEmail(email, { email: "" }, true);
    if (valid) {
      try {
        setShowLoader(true);
        const getResponse = await resetPassword(email);
        if (getResponse?.id) {
          const getFormData = new FormData();
          getFormData.append("id", getResponse.id);
          getFormData.append("email", getResponse.email);
          setFormData(getFormData);
          openModal(getFormData);
          setEmail("");
        } else {
          setShowLoader(false);
          showAlert("error", getResponse?.Error[0] || "Please try again later");
        }
      } catch (err) {
        showAlert("error", "User Not Found");
        setShowLoader(false);
      }
    } else {
      setEmailError("Please enter a valid email address");
      setShowLoader(false);
    }
  };
  return (
    <div className="jusify-center h-screen  w-full items-center">
      <div>
        <Image
          onClick={onCancel}
          src={back}
          alt="back Icon"
          height={10}
          width={10}
          className="m-4 h-5 w-5 cursor-pointer md:m-6 md:h-9 md:w-9"
        />
      </div>
      <div className=" mt-10 flex flex-col items-center">
        {showLoader && (
          <div className="absolute bottom-0 left-0 right-0 top-0 z-20 flex items-center justify-center bg-black bg-opacity-50 text-center text-white">
            <div className="loader"> Loading...</div>
          </div>
        )}
      </div>
      <div className="md:justify-centre flex  h-custom-70% items-center justify-center md:items-center">
        <div className="md:justify-centre flex flex-col items-center justify-center md:items-center">
          <p className="font-ibm-plex-mono text-medium mb-custom-18 text-left font-medium text-gray-300 md:mb-8 md:text-3xl">
            Forgot Password
          </p>

          <div>
            <div>
              <Input
                type="email"
                id="emailid"
                name="email"
                placeholder="Enter your email address"
                value={email}
                onChange={handleEmailChange}
              />
              <div className="mb-6 pt-1 text-xs text-red-500 md:text-sm ">
                {emailError}
              </div>
              <Button
                type="button"
                onClick={handleForm}
                className="mb-3.5 w-72 md:mb-6 md:w-96"
              >
                {isSending ? "Continue" : "Continue"}
              </Button>
              {isModalOpen && (
                <Modal formData={formData} onClose={closeModal} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
