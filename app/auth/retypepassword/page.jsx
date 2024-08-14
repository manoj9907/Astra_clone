"use client";

import React, { useState } from "react";
import Image from "next/image";
import sha256 from "crypto-js/sha256";
import {
  validatePassword,
  validateConfirmPassword,
} from "../../../utils/validationUtils";
import updatePassword from "../../../services/authservice/authenticationService";
import "./retype.css";
import hidePasswordIcon from "@/assets/login/password-eye.svg";
import showPasswordIcon from "@/assets/login/signin-password.svg";
import back from "@/assets/login/backward-icon.svg";
import showAlert from "@/services/commonservice/AlertService";
import { Button } from "@/components/ui/button";

function Reenter({ decodedData }) {
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [retypePasswordError, setRetypePasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [reshowPassword, setReshowPassword] = useState(false);
  const id = decodedData ? decodedData.id : null;

  const onSubmit = async () => {
    const passwordValidation = validatePassword(password, {});
    const retypePasswordValidation = validateConfirmPassword(
      password,
      retypePassword,
      {},
      false,
    );

    if (passwordValidation.valid && retypePasswordValidation.valid) {
      const passwordHash = sha256(password).toString();
      setShowLoader(true);
      await updatePassword(id, passwordHash);
      setShowLoader(false);
      showAlert("success", "Password has been updated sucessfully.");
      window.location.href = "/auth/signin";
    } else {
      setPasswordError(passwordValidation.newErrors.password || "");
      setRetypePasswordError(
        retypePasswordValidation.newErrors.confirmPassword || "",
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const retogglePasswordVisibility = () => {
    setReshowPassword(!reshowPassword);
  };
  const onCancel = () => {
    window.location.href = "/auth/resetpassword";
  };
  return (
    <div className="container mx-auto">
      <div>
        <Image
          onClick={onCancel}
          src={back.src}
          height={5}
          width={5}
          alt="back Icon"
          className="m-custom-15 h-custom-21 w-custom-21 md:ml-6 md:h-custom-35 md:w-custom-35"
        />
      </div>
      {showLoader && (
        <div className="absolute bottom-0 left-0 right-0 top-0 z-20 flex items-center justify-center bg-black bg-opacity-50 text-center text-white">
          <div className="loader"> Loading...</div>
        </div>
      )}

      <div className="md:justify-centre flex h-3/4 flex-col items-center justify-center md:items-center">
        <p className="mb-7 font-mono text-2xl font-medium text-gray-300">
          New Password
        </p>

        <div>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="font-figTree placeholder-reset md:placeholder-reset mb-2 h-8 w-72 rounded border border-gray-300 bg-transparent pl-2 text-xs  tracking-tracking-43 text-white placeholder-white md:h-custom-60 md:w-96 md:rounded-lg md:pl-4 md:text-base"
              placeholder="Create new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Image
              src={showPassword ? showPasswordIcon.src : hidePasswordIcon.src}
              alt="Password"
              height={10}
              width={10}
              className="absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 transform cursor-pointer md:h-3 md:w-4"
              onClick={togglePasswordVisibility}
            />
          </div>
          <div className="mb-custom-18 text-xs text-red-500 md:text-sm">
            {passwordError}
          </div>
        </div>

        <div>
          <div className="relative w-full">
            <input
              type={reshowPassword ? "text" : "password"}
              id="retypePassword"
              className="font-figTree placeholder-reset md:placeholder-reset mb-2	 h-8 w-72 rounded border border-gray-300 bg-transparent pl-2 text-xs tracking-tracking-43 text-white placeholder-white md:h-custom-60 md:w-96 md:rounded-lg md:pl-4 md:text-base"
              placeholder="Create new password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
            />

            <Image
              src={reshowPassword ? showPasswordIcon.src : hidePasswordIcon.src}
              alt="Password"
              height={10}
              width={10}
              className="absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 transform cursor-pointer md:h-3 md:w-4"
              onClick={retogglePasswordVisibility}
            />
          </div>
          <div className="mb-custom-18 text-xs text-red-500 md:text-sm">
            {retypePasswordError}
          </div>

          <Button
            onClick={onSubmit}
            type="button"
            className="mb-3.5  w-72 md:mb-6 md:w-96"
          >
            Save{" "}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Reenter;
