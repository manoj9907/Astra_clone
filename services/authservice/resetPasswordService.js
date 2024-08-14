"use server";

import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import emailTemplate from "../../template/emailtemplate";
import { createRedisInstance } from "@/redis";
import { SECRET_KEY, RETYPE_PASSWORD_URL } from "../../constants";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const resetPasswordLink = async (useEmail, subject, text, html, formData) => {
  const redis = createRedisInstance();

  try {
    const email = formData.get("email");
    const id = formData.get("id");
    const payload = { email, date: Date.now(), id };
    const settoken = jwt.sign(payload, SECRET_KEY);
    const url = `${RETYPE_PASSWORD_URL}/${settoken}`;
    const htmlMessage = emailTemplate(url);
    const msg = {
      to: useEmail,
      from: {
        name: "Astra",
        email: process.env.FROM_EMAIL,
      },
      subject: subject || "This is a verification link from Astra",
      text: text || "Find the Verification link below",
      html: html || htmlMessage,
    };

    await sgMail.send(msg);

    const value = JSON.stringify({ token: settoken, email, id });
    await redis.set(email, value);

    return { message: "Success: email was sent" };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    redis.quit();
  }
};

export default resetPasswordLink;
