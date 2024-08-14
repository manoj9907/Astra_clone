"use server";

import { createRedisInstance } from "@/redis";

const verifyUserToken = async (req) => {
  const formData = req;
  const email = formData.get("email");
  const token = formData.get("token");

  const redis = createRedisInstance();

  try {
    const storedValue = await redis.get(email);
    if (storedValue) {
      const parsedValue = JSON.parse(storedValue);
      if (parsedValue.token === token) {
        return true;
      }
      throw new Error("Token does not match");
    } else {
      throw new Error("Token does not match");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  } finally {
    redis.quit();
  }
};

export default verifyUserToken;
