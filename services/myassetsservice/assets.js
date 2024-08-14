"use server";

import { API_KEY, CONTENT_TYPE_JSON, BALANCES_URL } from "@/constants";

const getAssetsData = async (id) => {
  const response = await fetch(`${BALANCES_URL}${id}`, {
    method: "GET",
    headers: {
      "Content-Type": CONTENT_TYPE_JSON,
      "x-astra-api-key": API_KEY,
    },
  });
  if (!response.ok) {
    const errorMessage = await response.text();
    throw errorMessage;
  }
  const data = await response.json();
  return data;
};

export default getAssetsData;
