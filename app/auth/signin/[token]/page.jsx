"use client";

import React, { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import SignIn from "../page";

import ModalErrorToken from "../../../../components/modalcomponent/modal_error_token";
import Modalconfirmed from "../../../../components/modalcomponent/modal_confirmed";
import {
  validateToken,
  updateUserStatus,
} from "../../../../services/authservice/servicetoken";
import { SECRET_KEY } from "../../../../constants";

function VerifyToken({ params }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkToken, setCheckToken] = useState(false);
  const [error, setError] = useState(false);

  const verifyToken = async (val) => {
    try {
      const token = val;

      if (!token) {
        throw new Error("Token is missing");
      }

      const decoded = jwt.decode(token, SECRET_KEY);

      if (!decoded) {
        throw new Error("Invalid Token");
      }

      const userData = new FormData();

      userData.append("email", decoded.email);

      userData.append("token", token);

      userData.append("id", decoded.id);

      await validateToken(userData);

      await updateUserStatus({
        id: decoded.id,
        status: "active",
      });
      setIsModalOpen(true);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setCheckToken(true);
    }
  };

  useEffect(() => {
    verifyToken(params.token);
  }, [params]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (error) {
    return (
      <>
        <ModalErrorToken onClose={() => closeModal()} />
        <SignIn />
      </>
    );
  }

  return (
    <div className="w-full">
      {checkToken && (
        <>
          {isModalOpen && <Modalconfirmed onClose={() => closeModal()} />}
          <SignIn />
        </>
      )}
    </div>
  );
}

export default VerifyToken;
