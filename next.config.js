/* eslint-disable import/extensions */
/* eslint-disable no-bitwise */
/** @type {import('next').NextConfig} */
import dns from "node:dns";
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
} from "next/constants.js";
// import task from "@/app/cronJob.js";
import cron from "node-cron";
import sqlite3 from "sqlite3";
import lunr from "lunr";
// import { open } from "sqlite";
import { MARKET_URL } from "./constants.js";

const exchanges = [
  "BINANCE",
  "COINBASEPRO",
  "COINBASE",
  "KUCOIN",
  "OKX",
  "HUOBI",
  "KRAKEN",
  "KRAKENFUTURES",
];

// https://github.com/node-fetch/node-fetch/issues/1624#issuecomment-1407717012
dns.setDefaultResultOrder("ipv4first");

const fetchMarket = async (exchange) => {
  const url = `${MARKET_URL}?exchange=${exchange}`;

  try {
    console.info(`Fetching market data for ${exchange} from URL: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch market data (${response.status} ${response.statusText})`,
      );
    }

    const data = await response.json();
    // console.log(`Market Data for ${exchange}:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching market data for ${exchange}:`, error);
    throw error;
  }
};
const triggerFtsIndex = async (marketData) => {
  try {
    if (!Array.isArray(marketData)) {
      throw new Error("Market data is not an array.");
    }

    const transformedMarketData = marketData.map((marketValue, index) => ({
      id: index,
      market: marketValue,
    }));

    const idx = lunr(function lunrIndex() {
      this.ref("id");
      this.field("market");

      transformedMarketData.forEach((market) => {
        // console.log("Adding document to the index:", market); // Log the document being added
        this.add({ id: market.id, market: market.market });
      }, this);
    });
    // console.log(idx, "idx in lunr");
    // const indexedData = idx.toJSON();
    // console.log("Lunr Index:", indexedData); // Log the Lunr index

    return JSON.stringify(idx);
  } catch (error) {
    console.error("Error indexing market data:", error);
    throw error;
  }
};
const fetchAllMarkets = async () => {
  try {
    // Map each exchange to a promise returned by fetchMarket
    const fetchPromises = exchanges.map((exchange) => fetchMarket(exchange));

    // Execute all promises concurrently
    const marketDatas = await Promise.all(fetchPromises);

    // Process market data
    marketDatas.forEach((marketData) => {
      triggerFtsIndex(marketData);
      // Handle market data here
      // console.log("Received market data:", marketData);
      // For example, iterate through the market data
      marketData.forEach(() => {
        // console.log(item, "itemin Fetch All Markets");
      });
    });
  } catch (error) {
    // Handle error
    console.error("Error fetching market data:", error);
  }
};

// Call the function to fetch data for all exchanges
// fetchAllMarkets();
// Function to trigger the full-text search index

const collectMarketData = async () => {
  try {
    // Connect to SQLite database, and if it doesn't exist, create it
    const db = new sqlite3.Database(
      "./marketData.db",
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err) => {
        // Error handling for connection
        if (err) {
          throw err; // Throw error to be caught by the outer try-catch block
        } else {
          // Success message for successful connection
          console.info("Connected to the SQLite database.");
        }
      },
    );

    // Query the database for all market data
    const results = await Promise.allSettled(
      exchanges.map((exchange) => fetchMarket(exchange)),
    );

    // Extract market data from the results
    const marketData = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    // Trigger full-text search index
    const ftsIndex = await triggerFtsIndex(marketData);
    await db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS marketData (
              id INTEGER PRIMARY KEY,
              ftsindex TEXT
          )`,
        (err) => {
          // Error handling for table creation
          if (err) {
            throw err; // Throw error to be caught by the outer try-catch block
          }
        },
      );

      const insertSql = `INSERT OR REPLACE INTO marketData (id, ftsindex) VALUES(1, ?)`;

      // Execute insert commands for each value
      db.run(insertSql, ftsIndex, (err) => {
        if (err) {
          throw err; // Throw error to be caught by the outer try-catch block
        }
      });

      // Close the database connection
      db.close((err) => {
        if (err) {
          throw err; // Throw error to be caught by the outer try-catch block
        }
      });
    });
  } catch (error) {
    console.error("Error collecting market data:", error);
  }
};

const task = async () => {
  await collectMarketData();

  // every 5 min
  cron.schedule("* * 5 * *", async () => {
    try {
      // Your data collection logic here
      //     const data = await fetchData();
      await collectMarketData();

      // Save or process data as needed
      // console.log('Data fetched:', data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });
};

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    const newConfig = { ...config };
    if (!isServer) {
      newConfig.resolve.fallback = {
        fs: false,
      };
    }
    newConfig.module.rules.push({
      test: /lit-styles.js$/,
      use: [
        //  MiniCssExtractPlugin.loader,
        // "css-loader",
        { loader: "postcss-loader", options: { sourceMap: false } },
      ],
    });
    // config.plugins.push(new MiniCssExtractPlugin())
    return newConfig;
  },
};

const bootServices = async () => {
  // When running against a local astra-server and db-proxy, this is sending a bunch of HTTP
  // requests, which presumably causes a bottleneck in the db-proxy connection, which makes WS
  // connections timeout.

  // if (process.env.LOAD_MARKET_DATA !== "false") {
  //   await task();
  // }

  return true;
};

const start = async (phase) => {
  if (process.argv.includes("dev") && phase === PHASE_DEVELOPMENT_SERVER) {
    //  console.log('[ next.config.mjs (dev) ]');

    const bootedServices = await bootServices();

    console.info(
      `[ next.config.mjs (dev) ] => bootedServices: ${bootedServices}`,
    );
  } else if (
    process.argv.includes("start") &&
    phase === PHASE_PRODUCTION_SERVER
  ) {
    console.info("[ next.config.mjs (start) ]");

    const bootedServices = await bootServices();
    console.info(
      `[ next.config.mjs (start) ] => bootedServices: ${bootedServices}`,
    );
  } else if (
    process.argv.includes("build") &&
    phase === PHASE_PRODUCTION_BUILD
  ) {
    console.info("[ next.config.mjs (build) ]");

    // Boot into static pages? getStaticProps ?
    // pages/staticpage.tsx
    // import bootHandler from '@/boot';
    // const bootedServices = await bootHandler();
  }

  return nextConfig;
};

export default start;
