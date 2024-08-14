"use client";

import React, { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import Reenter from "../page";
import ModalErrorToken from "../../../../components/modalcomponent/modal_error_token";
import { SECRET_KEY } from "../../../../constants";
import verifyUserToken from "@/services/authservice/updatepassword";

function VerifyToken({ params }) {
  const [checkToken, setCheckToken] = useState(false);
  const [error, setError] = useState(false);
  const [decodedData, setDecodedData] = useState(null);

  const verifyToken = async (val) => {
    try {
      const token = val;
      const secretKey = SECRET_KEY;
      if (!token) {
        throw new Error("Token is missing");
      }
      const decoded = jwt.decode(token, secretKey);
      if (!decoded) {
        throw new Error("Invalid Token");
      }
      setDecodedData(decoded);
      const userData = new FormData();

      userData.append("id", decoded.id);
      userData.append("email", decoded.email);
      userData.append("token", token);
      await verifyUserToken(userData);
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
    window.location.href = "/auth/resetpassword";
  };

  if (error) {
    return (
      <>
        <ModalErrorToken onClose={() => closeModal()} />
        <Reenter decodedData={decodedData} />
      </>
    );
  }

  return checkToken && <Reenter decodedData={decodedData} />;
}

export default VerifyToken;
