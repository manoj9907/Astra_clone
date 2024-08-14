"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useGoogleLogin } from "@react-oauth/google";
import sha256 from "crypto-js/sha256";
import Modal from "../../../components/modalcomponent/modal_verifiy";
import { showAlert } from "@/services/commonservice/AlertService";
import {
  validateEmail,
  validatePassword,
} from "../../../utils/validationUtils";
import { AUTH_RESET_PASSWORD, DASHBOARD_LINK } from "../../../constants";
import createUser from "@/services/authservice/loginauthentication";
import {
  signInWithEmailPassword,
  verifyGoogleLogin,
} from "../../../services/authservice/signinservice";
import { setDataToDatabase } from "../../../services/authservice/credientalmanagement";
import sendEmail from "../../../services/signupService";
import Header from "@/components/header/header";
import { fetchAccessToken } from "@/app/actions";
import { Button } from "@/components/ui/button";
import ToggleGroupButton from "@/components/ui/toggle";
import { GoogleIcon, ShowHideIcon, ShowPasswordIcon } from "@/components/icons";
import { Input } from "@/components/input";
import hidePasswordIcon from "@/assets/login/eye-icon-close.svg";
import showPasswordIcon from "@/assets/login/eye-icon-open.svg";

function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [getSelectedValue, setGetSelectedvalue] = useState("log in");
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setshowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setshowPassword(!showPassword);
  };

  const toggleBtnVal = [
    {
      name: "Log In",
      value: "log in",
    },
    {
      name: "Sign Up",
      value: "sign up",
    },
  ];
  const validateForm = () => {
    let valid = true;
    let newErrors = { ...formErrors };

    if (!isSignIn) {
      // Validate Name
      if (!name.trim()) {
        newErrors.name = "Name is required";
        valid = false;
      }
    }

    // Validate Email
    const { newErrors: emailErrors, valid: emailValid } = validateEmail(
      email,
      newErrors,
      isSignIn,
    );
    newErrors = emailErrors;
    valid = emailValid && valid;

    // Validate Password
    const { newErrors: passwordErrors, valid: passwordValid } =
      validatePassword(password, newErrors);
    newErrors = passwordErrors;
    valid = passwordValid && valid;
    setFormErrors(newErrors);
    return valid;
  };

  const onSubmit = async () => {
    setLoading(true);
    setShowLoader(true);

    const hashedPassword = sha256(password).toString();
    const userPayload = {
      name,
      email,
      password,
      passwordHash: hashedPassword,
      status: "unverified",
      userType: "paid",
    };

    if (validateForm()) {
      const user = await createUser(userPayload);
      if (user) {
        showAlert("success", "User Created");
        const userData = new FormData();
        userData.append("userdata", JSON.stringify({ ...user, email }));
        await sendEmail(
          email,
          "Verification Link",
          "Find the verification link below",
          null,
          userData,
        )
          .then(() => {
            setName("");
            setEmail("");
            setPassword("");
            setIsModalOpen(true);
            showAlert("success", "Verification link sent successfully.");
          })
          .catch(() => {
            showAlert("error", "Failed to send verification link.");
          });
      } else {
        showAlert("error", "User already created");
      }
    }
    setLoading(false);
    setShowLoader(false);
  };

  const handleSignIn = async () => {
    try {
      setShowLoader(true);

      if (validateForm()) {
        try {
          const getResponse = await signInWithEmailPassword(email, password);
          try {
            getResponse.email = email;
            await setDataToDatabase(getResponse);
            window.location.href = DASHBOARD_LINK;
          } catch (error) {
            // showAlert("error", error);
            showAlert("error", "The user is not Signed up yet");
          }
        } catch (error) {
          setShowLoader(false);
          showAlert("error", error.message);
        }
      } else {
        setShowLoader(false);
        return;
      }
      setShowLoader(false);
    } catch (error) {
      setShowLoader(false);
      showAlert("error", "Error occurred during sign-in. Please try again.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getGoogleUserDetails = async (accessToken) =>
    fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((userInfo) => {
        const { email: userEmail, name: userNmae } = userInfo;
        return { userEmail, userNmae };
      })
      .catch((error) => error);

  const signinWithGoogleCredential = async (userDetails) => {
    try {
      const accessToken = await fetchAccessToken(userDetails?.email);
      accessToken.email = userDetails?.email;
      // accessToken.expiresAt = (Date.now()+180000)*1000; // code to verify token refresh logic
      await setDataToDatabase(accessToken);
      window.location.href = "/dashboard";
    } catch (error) {
      showAlert("error", "Error occurred during sign-in. Please try again.");
      setShowLoader(false);
    }
  };

  const createUserWithGoogleCredential = async (userdetails) => {
    const userPayload = {
      name: userdetails?.userNmae,
      email: userdetails.userEmail,
      status: "verified",
      userType: "paid",
    };
    const createUserResponse = await createUser(userPayload);
    if (createUserResponse.id) {
      showAlert("success", "User Create Successfully");
      try {
        const getGoogleResponse = await verifyGoogleLogin(
          userdetails.userEmail,
        );
        if (getGoogleResponse?.email) {
          signinWithGoogleCredential(getGoogleResponse);
        } else {
          showAlert("error", "Error in sign-in");
          setShowLoader(false);
        }
      } catch (error) {
        showAlert("error", "Error occurred during sign-in. Please try again.");
        setShowLoader(false);
      }
    } else {
      showAlert("error", "Error occurred during sign-in. Please try again.");
      setShowLoader(false);
    }
  };

  const handleResponse = async (response) => {
    if (response && response.access_token) {
      const userDetails = await getGoogleUserDetails(response.access_token);
      if (userDetails.userEmail) {
        setShowLoader(true);
        try {
          const getGoogleResponse = await verifyGoogleLogin(
            userDetails.userEmail,
          );
          if (isSignIn) {
            if (getGoogleResponse?.email) {
              signinWithGoogleCredential(getGoogleResponse);
            } else {
              showAlert("error", "User ID not found");
              setShowLoader(false);
            }
          } else if (getGoogleResponse?.email) {
            showAlert("error", "User already exists");
            setShowLoader(false);
          } else {
            createUserWithGoogleCredential(userDetails, response);
          }
        } catch (error) {
          setShowLoader(false);
          showAlert("error", error.message);
        }
      } else {
        setShowLoader(false);
        showAlert("error", "Error in Google sigin");
      }
    } else {
      setShowLoader(false);
      showAlert("error", "Error in Google sigin");
    }
  };

  const handleError = () => {
    showAlert("error", "Failed to login");
    setShowLoader(false);
  };

  const login = useGoogleLogin({
    onSuccess: handleResponse,
    onError: handleError,
  });

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
  };

  const handleToggle = () => {
    setGetSelectedvalue((prevState) =>
      prevState === "log in" ? "sign up" : "log in",
    );
    setIsSignIn((prevState) => !prevState);
    resetForm();
  };

  return (
    <div className="authentication_holder h-full w-full overflow-y-auto">
      <div className="flex flex-row justify-center">
        <Header resetForm={resetForm} />
        <div className="ml-auto hidden gap-16 pr-14 pt-14	md:flex">
          <ToggleGroupButton
            onValueChange={handleToggle}
            value={getSelectedValue}
            toggleDatas={toggleBtnVal}
          />
        </div>
      </div>

      {showLoader && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="text-center text-white">
            <div className="loader"> Loading...</div>
          </div>
        </div>
      )}

      <div className="md:justify-centre flex h-custom-70% items-center justify-center md:items-center">
        <div className="md:justify-centre flex flex-col items-center justify-center md:items-center">
          <p className="font-ibm-plex-mono text-medium mb-custom-18 text-left font-medium text-gray-300 md:mb-8 md:text-3xl">
            {isSignIn ? "Log In" : "Sign Up"}
          </p>

          <div>
            <div>
              {!isSignIn && (
                <div>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="mb-custom-18 pt-1 text-xs text-red-500">
                    {formErrors.name}
                  </div>
                </div>
              )}

              <Input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="mb-custom-18 pt-1 text-xs text-red-500">
                {formErrors.email}
              </div>
            </div>
            <div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <ShowHideIcon
                  controllIcon={showPassword}
                  className="absolute bottom-[11px] right-3 h-[17px] w-4"
                  onClick={togglePasswordVisibility}
                />
                {/* {showPassword ? (
                  <ShowPasswordIcon
                    size="compact"
                    className="absolute right-3 top-3"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <HidePasswordIcon
                    size="compact"
                    className="absolute right-3 top-3"
                    onClick={togglePasswordVisibility}
                  />
                )} */}
              </div>
              <div className="mb-custom-18 pt-1 text-xs text-red-500">
                {formErrors.password}
              </div>
            </div>
            <div>
              <div>
                {isSignIn ? (
                  <Button
                    className="mb-3.5 w-72 md:mb-6 md:w-96"
                    onClick={() => handleSignIn()}
                    type="button"
                  >
                    Login
                  </Button>
                ) : (
                  <div>
                    {loading ? (
                      <Button className="mb-6 w-72 md:mb-6 md:w-96">
                        Creating...
                      </Button>
                    ) : (
                      <Button
                        className="mb-6 w-72 md:mb-6 md:w-96"
                        onClick={() => onSubmit()}
                        type="button"
                      >
                        Create Account
                      </Button>
                    )}
                  </div>
                )}
                {isModalOpen && <Modal onClose={closeModal} />}
              </div>
            </div>
            {isSignIn && (
              <div className=" mb-3.5 text-center text-xs font-normal leading-6 text-gray-200 md:mb-6 md:text-base">
                <a
                  href={AUTH_RESET_PASSWORD}
                  className="cursor-pointer hover:underline"
                >
                  {isSignIn ? (
                    <span className="text-sm">Reset your password</span>
                  ) : null}
                </a>
              </div>
            )}

            <div className="divider_style mb-3.5 flex items-center justify-center md:mb-6">
              <span className="line_style h-px flex-1 bg-gray-600" />
              <span className="leading-20 p-2 text-xs text-gray-600">or</span>
              <span className="line_style h-px flex-1 bg-gray-600 " />
            </div>
          </div>
          <div className="sign_google flex justify-center text-center">
            <div className="sign_google flex justify-center text-center">
              <Button onClick={() => login()}>
                <div className="flex items-center gap-4">
                  <GoogleIcon />
                  {isSignIn ? "Login with Google" : "Create with Google"}
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="my-5">
        <div className="flex items-center justify-center gap-8  md:hidden md:gap-16">
          <ToggleGroupButton
            onValueChange={handleToggle}
            value={getSelectedValue}
            toggleDatas={toggleBtnVal}
          />
          {/* 
          <Button
            // className={
            //   isSignIn
            //     ? "h-10 w-36 cursor-pointer rounded-md bg-white text-xs font-medium text-black	md:w-48"
            //     : "h-12 w-36 cursor-pointer rounded-md bg-gray-950 text-xs font-medium text-white	hover:bg-gray-800 md:w-48"
            // }
            onClick={() => setIsSignIn(true)}
          >
            Sign In
          </Button>
          <Button
            type="button"
            // className={
            //   !isSignIn
            //     ? "h-10 w-36 cursor-pointer rounded-md bg-white text-xs font-medium text-black	md:w-48 "
            //     : "h-12 w-36 cursor-pointer rounded-md bg-gray-950 text-xs font-medium text-white	hover:bg-gray-800 md:w-48"
            // }
            onClick={() => setIsSignIn(false)}
          >
            Sign Up
          </Button> */}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
