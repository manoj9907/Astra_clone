import { userdb } from "../../db";

async function getDataFromDatabase() {
  try {
    const data = await userdb.astra_credential.get({ id: 1 });
    return data;
  } catch (error) {
    console.error("Error getting data from database:", error);
    throw error;
  }
}

async function setDataToDatabase(userData) {
  try {
    await userdb.astra_credential.put({ id: 1, userdetails: userData });
  } catch (error) {
    console.error("Error setting data in database:", error);
    throw error;
  }
}

async function clearDatabase() {
  try {
    await userdb.delete();
    console.info("Database cleared successfully.");
  } catch (error) {
    console.error("Error clearing database:", error);
    throw error;
  }
}

export { setDataToDatabase, getDataFromDatabase, clearDatabase };
