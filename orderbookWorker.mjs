/* eslint-disable no-restricted-globals */
import { ASTRA_BASE_WS_URL, ASTRA_BASE_HTTP_URL } from "./constants";
import { appDB } from "./db";

class LocalOrderbook {
  static properties = {
    docsHint: { type: String },
    count: { type: Number },
    apikey: {},
    _bgcolor: {},
    bids: {},
    asks: {},
    astraWsOrderbook: {},
    astraWsTrade: {},
    subscription: {},
    subscribeTrades: {},
    trades: {},
    tradesDisplay: {},
    broadcastChannelOrderbook: { type: BroadcastChannel },
    broadcastChannelTrades: { type: BroadcastChannel },
    messagebus: { type: BroadcastChannel },
    localDisplayOrderbook: {},
    localOrderbookRemovedEntry: {},
    messageCounter: {},
    initSnapshot: { type: Boolean },
    storeRemovedEntry: { type: Boolean },
    subscribed: { type: Boolean },
    isConnected: { type: Boolean },
    startupTimer: { type: Boolean },
  };

  async getOrderbookSnapshot() {
    const userData = await appDB.userData.get({ key: "token" });
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-astra-jwt-key", userData?.value);
    const raw = JSON.stringify(this.subscription.payload);
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

        await this.processOrdebook(jsonData);
        this.storeRemovedEntry = false;
      })
      .catch((error) => console.error("error", error));
  }

  async startSubscription() {
    this.trades = [];
    this.localOrderbook = {
      bids: [],
      asks: [],
    };
    this.localDisplayOrderbook = this.localOrderbook;
    this.tradesDisplay = this.trades;
    this.broadcastChannelOrderbook.postMessage(this.localOrderbook);
    this.broadcastChannelTrades.postMessage(this.trades);
    this.subscribeOrderbook(this.astraWsOrderbook);
    this.subscribeTrades();
    this.startupTimer = false;

    setTimeout(() => {
      this.startupTimer = true;
    }, 1000);

    this.subscribed = true;
  }

  // This method is used to start the websocket connection
  // and also handle the incoming messages
  async startWS(subs, dataType) {
    await appDB.userData.get({ key: "token" });
    // let wsAddr = `$${ASTRA_BASE_WS_URL}?token=${userData.value}&market=${subs}&dataType=${dataType}`;
    const wsAddr = `${ASTRA_BASE_WS_URL}?market=${subs}&dataType=${dataType}`;
    this.initSnapshot = false;
    const astraWS = new WebSocket(wsAddr);
    this.initSnapshot = false;
    this.messageCounter = 0;

    astraWS.onmessage = async (event) => {
      this.messageCounter = +1;
      const jsonData = JSON.parse(event.data);
      if (dataType === "ORDERBOOK") {
        await this.processOrdebook(jsonData);
      } else if (dataType === "TRADE") {
        this.processTrades(jsonData);
      }
    };

    this.isConnected = true;

    return astraWS;
  }

  subscribeOrderbook() {
    this.astraWsOrderbook.send(JSON.stringify(this.subscription));
  }

  subscribeTrades() {
    this.astraWsTrade.send(JSON.stringify(this.subscriptionTrades));
  }

  // Process the incoming messages and construct the trades to be displayed
  processTrades(jsonData) {
    const localTrades = this.trades;
    if (typeof jsonData.trades !== "undefined") {
      if (jsonData.trades.length > 0) {
        jsonData.trades.forEach((element) => {
          if (localTrades.length < 500) {
            localTrades.push(element);
          } else {
            // console.log(localTrades.shift());
            localTrades.shift();
            localTrades.push(element);
          }
        });
      }
    }

    this.trades = localTrades;
    const depth = 50;
    this.tradesDisplay = localTrades.slice(-depth, localTrades.length);
    this.broadcastChannelTrades.postMessage(this.tradesDisplay);
  }

  // Process the incoming messages and construct the orderbook to be displayed
  async processOrdebook(jsonData) {
    if (typeof jsonData.bids !== "undefined") {
      if (jsonData.bids.length > 0) {
        jsonData.bids.forEach((element) => {
          if (this.localOrderbook.bids.length !== 0) {
            this.localOrderbook.bids = this.localOrderbook.bids.filter(
              (bid) => bid.price !== element.price,
            );
          }
          if (element.quantity !== 0) {
            if (this.storeRemovedEntry) {
              if (!this.localOrderbookRemovedEntry.bids.has(element.price)) {
                this.localOrderbook.bids.push(element);
              } else if (this.initSnapshot) {
                this.localOrderbookRemovedEntry.bids.delete(element.price);
              }
            } else {
              this.localOrderbook.bids.push(element);
            }
          } else if (this.storeRemovedEntry) {
            this.localOrderbookRemovedEntry.bids.set(
              element.price,
              element.quantity,
            );
          }
        });
      }
    }

    if (typeof jsonData.asks !== "undefined") {
      if (jsonData.asks.length > 0) {
        jsonData.asks.forEach((element) => {
          if (this.localOrderbook.asks.length !== 0) {
            this.localOrderbook.asks = this.localOrderbook.asks.filter(
              (ask) => ask.price !== element.price,
            );
          }
          if (element.quantity !== 0) {
            if (this.storeRemovedEntry) {
              if (!this.localOrderbookRemovedEntry.asks.has(element.price)) {
                this.localOrderbook.asks.push(element);
              } else if (this.initSnapshot) {
                this.localOrderbookRemovedEntry.asks.delete(element.price);
              }
            } else {
              this.localOrderbook.asks.push(element);
            }
          } else if (this.storeRemovedEntry) {
            this.localOrderbookRemovedEntry.asks.set(
              element.price,
              element.quantity,
            );
          }
        });
      }
    }

    this.localOrderbook.bids = this.localOrderbook.bids.sort(
      (firstItem, secondItem) => secondItem.price - firstItem.price,
    );
    this.localOrderbook.asks = this.localOrderbook.asks.sort(
      (firstItem, secondItem) => secondItem.price - firstItem.price,
    );

    // correct the bids top of book
    // this.localOrderbook.bids = this.localOrderbook.bids.filter( bid => bid.price < this.localOrderbook.asks[this.localOrderbook.asks.length-1].price )

    const depth = 24;
    this.bids = this.localOrderbook.bids.slice(0, depth);
    this.asks = this.localOrderbook.asks.slice(
      this.localOrderbook.asks.length - depth,
      this.localOrderbook.asks.length,
    );
    this.localDisplayOrderbook = {
      asks: this.asks,
      bids: this.bids,
    };

    if (
      (!this.initSnapshot && this.messageCounter > 30) ||
      (!this.initSnapshot && this.startupTimer)
    ) {
      this.storeRemovedEntry = true;
      this.initSnapshot = true;
      await this.getOrderbookSnapshot();
    }

    this.broadcastChannelOrderbook.postMessage(this.localDisplayOrderbook);
    return null;
  }

  constructor() {
    this.docsHint = "Click on the Vite and Lit logos to learn more";
    this.count = 0;
    this.apikey = "Bearer ";
    this.subscription = {
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
    this.subscriptionTrades = {
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
        dataType: "TRADE",
      },
    };
    //   this.message= streamOrderbook();
    this.initSnapshot = false;
    this.storeRemovedEntry = false;
    this.localOrderbook = {
      bids: [],
      asks: [],
    };
    this.trades = [];
    this.localOrderbookRemovedEntry = {
      bids: new Map(),
      asks: new Map(),
    };
    this.messageCounter = 0;
    this.subscribed = false;
    this.broadcastChannelOrderbook = null;
    this.broadcastChannelTrades = null;
  }

  closeWS() {
    this.astraWS.close();
    this.subscribed = false;
    this.isConnected = false;
  }

  constructSubscription(data) {
    this.subscription = {
      action: "SUBSCRIBE",
      payload: {
        exchange: data.exchange,
        market: data.market,
        dataType: "ORDERBOOK",
      },
    };
  }

  constructSubscriptionTrade(data) {
    this.subscriptionTrades = {
      action: "SUBSCRIBE",
      payload: {
        exchange: data.exchange,
        market: data.market,
        dataType: "TRADE",
      },
    };
  }
}

const localOrderbookInstance = new LocalOrderbook();
const messagebus = new BroadcastChannel("messagebus");

// Function to intiialize the states
async function initWS(sub, userId) {
  localOrderbookInstance.broadcastChannelOrderbook = new BroadcastChannel(
    `orderbook${userId}`,
  );
  localOrderbookInstance.broadcastChannelOrderbook.postMessage("hi");
  localOrderbookInstance.broadcastChannelTrades = new BroadcastChannel(
    `trades${userId}`,
  );
  localOrderbookInstance.astraWsOrderbook =
    await localOrderbookInstance.startWS(sub, "ORDERBOOK");
  localOrderbookInstance.astraWsTrade = await localOrderbookInstance.startWS(
    sub,
    "TRADE",
  );
  localOrderbookInstance.astraWsOrderbook.onopen = () => {
    localOrderbookInstance.isConnected = true;
    const response = {
      action: "wsconnected",
      result: true,
    };
    postMessage(response);
    messagebus.postMessage({
      type: response.action,
      data: true,
    });
  };
  localOrderbookInstance.astraWsTrade.onopen = () => {
    localOrderbookInstance.isConnected = true;
    const response = {
      action: "wsconnected",
      result: true,
    };
    postMessage(response);
    messagebus.postMessage({
      type: response.action,
      data: true,
    });
  };
}

addEventListener("message", async (e) => {
  if (e.data.action === "init") {
    await initWS(e.data.subscription, e.data.userId);
    // await initWS("BINANCE-PERP-BTC-USDT", e.data.userId);
  }
  if (e.data.action === "open") {
    localOrderbookInstance.constructSubscription(e.data.subscription);
    localOrderbookInstance.constructSubscriptionTrade(e.data.subscription);
    await localOrderbookInstance.startSubscription();
  }

  if (localOrderbookInstance.subscribed && e.data.action === "close") {
    localOrderbookInstance.closeWS();
    initWS("BINANCE-SPOT-BTC-USDT"); // Initially used to the standby WS
  }

  if (e.data.action === "getUserData") {
    appDB.userData.get({ key: "token" }).then((result) => {
      postMessage({
        type: "getUserData",
        data: result,
      });
      return result;
    });
  }
});
