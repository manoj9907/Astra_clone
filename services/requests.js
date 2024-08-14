import { getAccessToken } from "@/app/util";
import { ASTRA_BASE_HTTP_URL } from "@/constants";

export async function apiRequest(method, path, query, body, accessToken) {
  let url = `${ASTRA_BASE_HTTP_URL}${path}`;
  if (query && Object.keys(query).length !== 0) {
    url += `?${new URLSearchParams(query)}`;
  }

  // const authData = JSON.parse((await getDataFromDatabase()).userdetails);
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-access-token": accessToken,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(text);
    throw new Error(text);
  }

  const data = await response.json();
  return data;
}

export async function apiGet(path, query) {
  const { accessToken } = await getAccessToken();
  return apiRequest("GET", path, query, undefined, accessToken);
}

export async function apiPost(path, body) {
  const { accessToken } = await getAccessToken();
  return apiRequest("POST", path, undefined, body, accessToken);
}
