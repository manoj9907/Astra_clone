"use server";

import { GET_SETTING_API, SETTING_API, API_KEY } from "@/constants";

export const getApikey = async (userid) => {
  const url = `${GET_SETTING_API}?userId=${userid}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-astra-api-key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(response);
    }
    const jsonResponse = await response.json();
    return { data: jsonResponse };
  } catch (error) {
    return error;
  }
};

export const createApiKey = async (payload) => {
  try {
    const response = await fetch(SETTING_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-astra-api-key": API_KEY,
      },
      body: JSON.stringify(payload),
    });
    const jsonResponse = await response.json();
    return { status: response.ok, data: jsonResponse };
  } catch (error) {
    return { status: false, data: error?.message };
  }
};

export const deleteApikey = async (apiKey) => {
  try {
    const response = await fetch(SETTING_API, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-astra-api-key": API_KEY,
      },
      body: JSON.stringify({ id: apiKey }),
    });
    return response.ok;
  } catch (error) {
    return { status: false, data: error?.message };
  }
};

export const editApikey = async (editInputvalue, editInputId) => {
  try {
    const response = await fetch(SETTING_API, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-astra-api-key": API_KEY,
      },
      body: JSON.stringify({
        name: editInputvalue,
        id: editInputId,
      }),
    });
    return response.ok;
  } catch (error) {
    return { status: false, data: error?.message };
  }
};
