"use server";

import { API_KEY, CONTENT_TYPE_JSON, SIGNUP_API_URL } from "@/constants";

const createUser = async (userData) => {
  try {
    const response = await fetch(SIGNUP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": CONTENT_TYPE_JSON,
        "x-astra-api-key": API_KEY,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      // const error = await response.json();
      // throw error.Error[0];
      throw new Error("User already created");
    }
    return await response.json();
  } catch (error) {
    return false;
  }
};

export default createUser;
