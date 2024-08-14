"use server";

import { PUT_PASSWORD, API_KEY, CONTENT_TYPE_JSON } from "../../constants";

const updatePassword = async (userId, newPassword) => {
  try {
    const requestBody = {
      id: userId,
      passwordHash: newPassword,
    };

    const response = await fetch(PUT_PASSWORD, {
      method: "PUT",
      headers: {
        "Content-Type": CONTENT_TYPE_JSON,
        "x-astra-api-key": API_KEY,
      },
      body: JSON.stringify(requestBody),
    });
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
export default updatePassword;
