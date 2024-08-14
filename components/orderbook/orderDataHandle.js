import { ASTRA_BASE_HTTP_URL } from "../../constants";
import { getAccessToken } from "@/app/util";

const localOrderbook = {
  bids: [],
  asks: [],
};
const localOrderbookRemovedEntry = { bids: new Map(), asks: new Map() };
let storeRemovedEntry = false;
let initSnapshot = false;
const startupTimer = false;
let asks = {};
let bids = {};
let localDisplayOrderbook = {};
const subscription = {
  action: "SUBSCRIBE",
  payload: {
    exchange: "BINANCE",
    market: {
      baseAsset: {
        type: "SPOT",
        asset: "BTC",
      },
      quoteAsset: "USDT",
    },
    dataType: "ORDERBOOK",
  },
};

async function getOrderbookSnapshot() {
  const auth = await getAccessToken();
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("x-access-token", auth.accessToken);
  const raw = JSON.stringify(subscription.payload);
  const base64Json = btoa(raw);
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  fetch(
    `${ASTRA_BASE_HTTP_URL}/orderbook?${new URLSearchParams({
      q: base64Json,
    })}`,
    requestOptions,
  )
    .then((response) => response.text())
    .then(async (result) => {
      const jsonData = JSON.parse(result);
      // eslint-disable-next-line no-use-before-define
      await processOrdebook(jsonData);
      storeRemovedEntry = false;
    })
    .catch((error) => console.error("jsonData", error));
}

export default async function processOrdebook(jsonData, messageCounter) {
  if (typeof jsonData.bids !== "undefined") {
    if (jsonData.bids.length > 0) {
      jsonData.bids.forEach((element) => {
        if (localOrderbook.bids.length !== 0) {
          localOrderbook.bids = localOrderbook.bids.filter(
            (bid) => bid.price !== element.price,
          );
        }
        if (element.quantity !== 0) {
          if (storeRemovedEntry) {
            if (!localOrderbookRemovedEntry.bids.has(element.price)) {
              localOrderbook.bids.push(element);
            } else if (initSnapshot) {
              localOrderbookRemovedEntry.bids.delete(element.price);
            }
          } else {
            localOrderbook.bids.push(element);
          }
        } else if (storeRemovedEntry) {
          localOrderbookRemovedEntry.bids.set(element.price, element.quantity);
        }
      });
    }
  }

  if (typeof jsonData.asks !== "undefined") {
    if (jsonData.asks.length > 0) {
      jsonData.asks.forEach((element) => {
        if (localOrderbook.asks.length !== 0) {
          localOrderbook.asks = localOrderbook.asks.filter(
            (ask) => ask.price !== element.price,
          );
        }
        if (element.quantity !== 0) {
          if (storeRemovedEntry) {
            if (!localOrderbookRemovedEntry.asks.has(element.price)) {
              localOrderbook.asks.push(element);
            } else if (initSnapshot) {
              localOrderbookRemovedEntry.asks.delete(element.price);
            }
          } else {
            localOrderbook.asks.push(element);
          }
        } else if (storeRemovedEntry) {
          localOrderbookRemovedEntry.asks.set(element.price, element.quantity);
        }
      });
    }
  }

  localOrderbook.bids = localOrderbook.bids.sort(
    (firstItem, secondItem) => secondItem.price - firstItem.price,
  );
  localOrderbook.asks = localOrderbook.asks.sort(
    (firstItem, secondItem) => secondItem.price - firstItem.price,
  );

  // correct the bids top of book
  // localOrderbook.bids = localOrderbook.bids.filter( bid => bid.price < localOrderbook.asks[localOrderbook.asks.length-1].price )

  const depth = 24;
  bids = localOrderbook.bids.slice(0, depth);
  asks = localOrderbook.asks.slice(
    localOrderbook.asks.length - depth,
    localOrderbook.asks.length,
  );
  localDisplayOrderbook = {
    asks,
    bids,
  };

  if (
    (!initSnapshot && messageCounter > 30) ||
    (!initSnapshot && startupTimer)
  ) {
    storeRemovedEntry = true;
    initSnapshot = true;
    await getOrderbookSnapshot();
  }

  return localDisplayOrderbook;
}
