"use server";

import sha256 from "crypto-js/sha256";
import {
  API_KEY,
  LOGIN_API,
  CONTENT_TYPE_JSON,
  VALIDATE_EMAIL_API,
} from "../../constants";

export const signInWithEmailPassword = async (email, password) => {
  const hashedPassword = sha256(password).toString();
  const signInData = {
    userEmail: email,
    passwordHash: hashedPassword,
  };
  try {
    const response = await fetch(LOGIN_API, {
      method: "POST",
      headers: {
        "Content-Type": CONTENT_TYPE_JSON,
        "x-astra-api-key": API_KEY,
      },
      body: JSON.stringify(signInData),
    });
    if (response.ok) {
      const responseData = await response.json();
      if (responseData.userId) {
        return responseData;
      }
      throw new Error("Failed to fetch Token");
    } else {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Invalid email or password.");
    }
  } catch (error) {
    if (error.message.includes("no rows")) {
      error.message = "The user is not Signed up yet";
    }
    return error.message || "Error occurred during sign-in. Please try again.";
  }
};

// export const verifyGoogleLogin = async (email) => {
//   try {
//     const response = await fetch(VALIDATE_EMAIL_API, {
//       method: "POST",
//       headers: {
//         "Content-Type": CONTENT_TYPE_JSON,
//         "x-astra-api-key": API_KEY,
//       },
//       body: JSON.stringify({ userEmail: email }),
//     });
//     if (!response.ok) {
//       const error = await response.json();
//       if (error?.Error[0] == "user id not found") return "User id not found";
//       else return error?.Error[0] ? error?.Error[0] : "Error in Google Signin";
//     } else {
//       const returndata = await response.json();
//       return returndata;
//     }
//   } catch (error) {
//     throw error;
//   }
// };

export const verifyGoogleLogin = async (email) => {
  try {
    const response = await fetch(VALIDATE_EMAIL_API, {
      method: "POST",
      headers: {
        "Content-Type": CONTENT_TYPE_JSON,
        "x-astra-api-key": API_KEY,
      },
      body: JSON.stringify({ userEmail: email }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const matcheck = errorText.includes("no rows");
      if (matcheck) return false;
    }

    const returndata = await response.json();
    return returndata;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
