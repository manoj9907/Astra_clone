/ eslint-disable no-bitwise /
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import sqlite3 from 'sqlite3';
import dns from 'dns';
import lunr from 'lunr';
import fetch from 'node-fetch';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Add your provided code here

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

dns.setDefaultResultOrder("ipv4first");

const fetchMarket = async (exchange) => {
  const url = `https://stag.astra-api.dev/market?exchange=${exchange}`;

  try {
    console.info(`Fetching market data for ${exchange} from URL: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch market data (${response.status} ${response.statusText})`,
      );
    }

    const data = await response.json();
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
        this.add({ id: market.id, market: market.market });
      }, this);
    });

    return JSON.stringify(idx);
  } catch (error) {
    console.error("Error indexing market data:", error);
    throw error;
  }
};

const collectMarketData = async () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(
      "./marketData.db",
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err) => {
        if (err) {
          console.error("Failed to connect to the SQLite database:", err);
          reject(err); // Reject if the database connection fail
          return;
        }

        console.info("Connected to the SQLite database.");

        db.serialize(() => {
          db.run(
            `CREATE TABLE IF NOT EXISTS marketData (
                  id INTEGER PRIMARY KEY,
                  ftsindex TEXT
              )`,
            (err) => {
              if (err) {
                console.error("Failed to create marketData table:", err);
                reject(err); // Reject if table creation fails
                return;
              }

              console.info("marketData table created or already exists.");

              // Continue with data insertion and processing
              Promise.allSettled(exchanges.map((exchange) => fetchMarket(exchange)))
                .then(async (results) => {
                  const marketData = results
                    .filter((result) => result.status === "fulfilled")
                    .map((result) => result.value);

                  const ftsIndex = await triggerFtsIndex(marketData);

                  db.run(
                    `INSERT OR REPLACE INTO marketData (id, ftsindex) VALUES(1, ?)`,
                    ftsIndex,
                    (err) => {
                      if (err) {
                        console.error("Failed to insert market data:", err);
                        reject(err); // Reject if insertion fails
                        return;
                      }

                      console.info("Market data inserted into the marketData table.");
                      resolve(); // Resolve on success
                    }
                  );
                })
                .catch((error) => {
                  console.error("Failed to process market data:", error);
                  reject(error); // Reject if market data processing fails
                });
            }
          );
        });
      }
    );
  });
};

// Modify the server setup to include data collection before starting the server
app.prepare().then(async () => {
  try {
    // Call the collectMarketData function before starting the server
    await collectMarketData();
    console.info("Market data collected and stored successfully.");

    // Start the server after data collection
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(3000, (err) => {
      if (err) throw err;
    });
  } catch (error) {
    console.error("Failed to collect market data:", error);
    process.exit(1); // Exit the process with an error code if data collection fails
  }
});

