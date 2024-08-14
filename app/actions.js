/* eslint-disable no-bitwise */

"use server";

import sqlite3 from "sqlite3";
import lunr from "lunr";
import { open } from "sqlite";
import { cache } from "react";
import dns from "node:dns";
import {
  API_KEY,
  CONTENT_TYPE_JSON,
  USER_TOKEN,
  VALIDATE_EMAIL_ACTION,
} from "@/constants";

// const exchanges = [
//   "BINANCE",
//   "COINBASEPRO",
//   "COINBASE",
//   "KUCOIN",
//   "OKX",
//   "HUOBI",
//   "KRAKEN",
//   "KRAKENFUTURES",
// ];

// dns.setDefaultResultOrder("ipv4first");

// const fetchMarket = async (exchange) => {
//   const url = `https://stag.astra-api.dev/market?exchange=${exchange}`;

//   try {
//     console.info(`Fetching market data for ${exchange} from URL: ${url}`);
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(
//         `Failed to fetch market data (${response.status} ${response.statusText})`,
//       );
//     }

//     const data = await response.json();
//     // console.log(`Market Data for ${exchange}:`, data);
//     return data;
//   } catch (error) {
//     console.error(`Error fetching market data for ${exchange}:`, error);
//     throw error;
//   }
// };
// const triggerFtsIndex = async (marketData) => {
//   try {
//     if (!Array.isArray(marketData)) {
//       throw new Error("Market data is not an array.");
//     }

//     const transformedMarketData = marketData.map((marketValue, index) => ({
//       id: index,
//       market: marketValue,
//     }));

//     const idx = lunr(function lunrIndex() {
//       this.ref("id");
//       this.field("market");

//       transformedMarketData.forEach((market) => {
//         // console.log("Adding document to the index:", market); // Log the document being added
//         this.add({ id: market.id, market: market.market });
//       }, this);
//     });
//     // console.log(idx, "idx in lunr");
//     // const indexedData = idx.toJSON();
//     // console.log("Lunr Index:", indexedData); // Log the Lunr index

//     return JSON.stringify(idx);
//   } catch (error) {
//     console.error("Error indexing market data:", error);
//     throw error;
//   }
// };

// Call the function to fetch data for all exchanges
// fetchAllMarkets();
// Function to trigger the full-text search index

// export const collectMarketData = async () => {
//   try {
//     // Connect to SQLite database, and if it doesn't exist, create it
//     const db = new sqlite3.Database(
//       "./marketData.db",
//       sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
//       (err) => {
//         // Error handling for connection
//         if (err) {
//           throw err; // Throw error to be caught by the outer try-catch block
//         } else {
//           // Success message for successful connection
//           console.info("Connected to the SQLite database.");
//         }
//       },
//     );

//     // Query the database for all market data
//     const results = await Promise.allSettled(
//       exchanges.map((exchange) => fetchMarket(exchange)),
//     );

//     // Extract market data from the results
//     const marketData = results
//       .filter((result) => result.status === "fulfilled")
//       .map((result) => result.value);

//     // Trigger full-text search index
//     const ftsIndex = await triggerFtsIndex(marketData);
//     await db.serialize(() => {
//       db.run(
//         `CREATE TABLE IF NOT EXISTS marketData (
//               id INTEGER PRIMARY KEY,
//               ftsindex TEXT
//           )`,
//         (err) => {
//           // Error handling for table creation
//           if (err) {
//             throw err; // Throw error to be caught by the outer try-catch block
//           }
//         },
//       );

//       const insertSql = `INSERT OR REPLACE INTO marketData (id, ftsindex) VALUES(1, ?)`;

//       // Execute insert commands for each value
//       db.run(insertSql, ftsIndex, (err) => {
//         if (err) {
//           throw err; // Throw error to be caught by the outer try-catch block
//         }
//       });

//       // Close the database connection
//       db.close((err) => {
//         if (err) {
//           throw err; // Throw error to be caught by the outer try-catch block
//         }
//       });
//       return true
//     });
//   } catch (error) {
//     console.error("Error collecting market data:", error);
//     throw new Error(error.message);
//   }
// };

export const loadFTSIndex = cache(async () => {
  try {
    // Open the database connection
    const db = await open({
      filename: "./marketData.db",
      driver: sqlite3.Database,
    });

    // Fetch the FTS index from the database
    const index = await db.get(
      "SELECT ftsindex FROM marketData WHERE id = ?",
      1,
    );

    if (!index || !index.ftsindex) {
      throw new Error("No index found in the database.");
    }
    const indexJson = JSON.parse(index.ftsindex);
    return {
      props: {
        indexDump: indexJson,
      },
    };
  } catch (error) {
    console.error("Error loading FTS index:", error);
    return {
      props: {
        indexDump: null,
        error: error.message, // Include the error message
      },
    };
  }
});

export const resetPassword = async (formData) => {
  try {
    const response = await fetch(VALIDATE_EMAIL_ACTION, {
      method: "POST",
      headers: {
        "Content-Type": CONTENT_TYPE_JSON,
        "x-astra-api-key": API_KEY,
      },
      body: JSON.stringify({ userEmail: formData }),
    });

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchAccessToken = async (email) => {
  try {
    const response = await fetch(USER_TOKEN, {
      method: "POST",
      headers: {
        "Content-Type": CONTENT_TYPE_JSON,
        "x-astra-api-key": API_KEY,
      },
      body: JSON.stringify({ userEmail: email }),
    });

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
