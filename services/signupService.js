"use server";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
import emailTemplate from "../template/emailtemplate";
import { SIGNIN_URL, SECRET_KEY } from "../constants";
import { createRedisInstance } from "@/redis";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function sendEmail(email, subject, text, html, req) {
  const redis = createRedisInstance(); // Create Redis instance
  try {
    const formData = req;

    const userdataField = formData.get("userdata");
    const userData = JSON.parse(userdataField);
    const payload = {
      email: userData.email,
      date: Date.now(),
      id: userData.id,
    };
    const setToken = jwt.sign(payload, SECRET_KEY);
    const url = `${SIGNIN_URL}/${setToken}`;
    const htmlMessage = emailTemplate(url);

    const msg = {
      to: email,
      from: {
        name: "Astra",
        email: process.env.FROM_EMAIL,
      },
      subject: subject || "This is a verification link from Astra",
      text: text || "Find the Verification link below",
      html: html || htmlMessage,
    };

    await sgMail.send(msg);

    const value = JSON.stringify({ token: setToken });
    await redis.set(userData.email, value);
    return true;
  } catch (error) {
    console.error("Error occurred:", error);

    if (error.response) {
      console.error("Error response body:", error.response.body);
    }
    throw error; // Re-throw the error for handling by the caller
  } finally {
    if (redis) {
      redis.quit(); // Close Redis connection in the finally block if it's defined
    }
  }
}
