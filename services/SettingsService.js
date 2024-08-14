import showAlert from "@/services/AlertService";
import { GET_SETTING_API, SETTING_API, API_KEY } from "@/constants";

export const getApikey = async (userid) => {
  const body = btoa(
    JSON.stringify({
      user_id: userid,
    }),
  );

  const url = `${GET_SETTING_API}?q=${body}`;

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

    if (!response.ok) {
      throw new Error(response.ok);
    }

    const jsonResponse = await response.json();
    showAlert("success", "API Key Create Successfully");
    return { status: response.ok, data: jsonResponse };
  } catch (error) {
    return error;
  }
};

export const deleteApikey = async (id) => {
  try {
    const response = await fetch(SETTING_API, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-astra-api-key": API_KEY,
      },
      body: JSON.stringify({ apikey: id }),
    });
    if (!response.ok) {
      throw new Error(response.ok);
    }
    showAlert("success", "API Key delete Successfully");
    return response.ok;
  } catch (error) {
    showAlert("error", "Error in delete API Key");
    return error;
  }
};

export const editApikey = async (editInputvalue, editInputId) => {
  if (editInputvalue?.length > 0) {
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

      if (!response.ok) {
        throw new Error(response.ok);
      }

      showAlert("success", "API Key Edit Successfully");
      return response.ok;
    } catch (error) {
      showAlert("error", "Error in Edit API Key");
      return error;
    }
  } else {
    showAlert("error", "Invalid input value");
    return false;
  }
};
