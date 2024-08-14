"use server";

import {
  ASTRA_BASE_HTTP_URL,
  API_KEY,
  CONTENT_TYPE_JSON,
} from "../../constants";
import { createRedisInstance } from "@/redis";

export const validateToken = async (userData) => {
  const formData = userData;
  const email = formData.get("email");
  const token = formData.get("token");
  const redis = createRedisInstance();
  const storedValue = await redis.get(email);

  if (storedValue) {
    const parsedValue = JSON.parse(storedValue);
    if (parsedValue.token === token) return true;
    throw new Error("Token is not match");
  } else throw new Error("Email not found in Redis");
};

export const updateUserStatus = async (userData) => {
  try {
    const response = await fetch(`${ASTRA_BASE_HTTP_URL}/user`, {
      method: "PUT",
      headers: {
        "Content-Type": CONTENT_TYPE_JSON,
        "x-astra-api-key": API_KEY,
      },
      body: JSON.stringify(userData),
    });

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
