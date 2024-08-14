"use client";

import { cache } from "react";
import { fetchAccessToken, loadFTSIndex } from "@/app/actions";
import {
  getDataFromDatabase,
  setDataToDatabase,
} from "@/services/authservice/credientalmanagement";

export function isObjectEmpty(objectName) {
  return (
    objectName &&
    Object.keys(objectName).length === 0 &&
    objectName.constructor === Object
  );
}

export const loadFTS = cache(async () => {
  const getIndex = await loadFTSIndex();
  return getIndex;
});

export async function getAccessToken() {
  const userInfo = (await getDataFromDatabase()).userdetails;
  const expiryInMicro = userInfo?.expiresAt;
  const expiryInMilli = Math.trunc(expiryInMicro / 1000);
  const now = Date.now();
  const bufferTime = 120000; // 2 minutes
  if (now >= expiryInMilli - bufferTime) {
    console.info("Access token refreshed");
    const accessToken = await fetchAccessToken(userInfo?.email);
    accessToken.email = userInfo?.email;
    await setDataToDatabase(accessToken);
    return accessToken;
  }
  return userInfo;
}
