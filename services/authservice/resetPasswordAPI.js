import {
  API_KEY,
  CONTENT_TYPE_JSON,
  VALIDATE_EMAIL_API,
} from "../../constants";

export default async function validateUserEmail(email) {
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
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    throw new Error("Error validating user email");
  }
}
