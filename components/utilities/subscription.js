export default class Subscription {
  // subscription = "";

  constructor(subs) {
    this.subscription = subs || "";
  }

  getSubscription() {
    return this.subscription;
  }

  setSubscription(subs) {
    this.subscription = subs;
  }

  ConstructSubscriptionQueryParam(sub) {
    let subscription = "";
    // console.log('construct ', sub.market.baseAsset.type)
    switch (sub.market.baseAsset.type) {
      case "SPOT":
        subscription =
          `${sub.exchange}-` +
          `SPOT` +
          `-${sub.market.baseAsset.asset}-${sub.market.quoteAsset}`;
        break;
      case "PERPETUAL":
        subscription =
          `${sub.exchange}-` +
          `PERP` +
          `-${sub.market.baseAsset.underlying}-${sub.market.quoteAsset}`;
        break;
      case "DATED_FUTURE":
        subscription =
          `${sub.exchange}-` +
          `FUT` +
          `-${sub.market.baseAsset.underlying}-${
            sub.market.quoteAsset
          }-${sub.market.baseAsset.expiry.replaceAll("-", "")}`;
        break;
      case "OPTION":
        subscription =
          `${sub.exchange}-` +
          `OPT` +
          `-${sub.market.baseAsset.underlying}-${
            sub.market.quoteAsset
          }-${sub.market.baseAsset.expiry.replaceAll("-", "")}-${
            sub.market.baseAsset.strike
          }-${sub.market.baseAsset.option_type.charAt(0)}`;
        break;
      default:
        subscription = "";
    }
    //  console.log('orderbook sub', subscription)
    this.setSubscription(subscription);
    return subscription;
  }

  ExtractAssets() {
    const { subscription } = this;
    const parts = subscription.split("-");
    // let exchange = parts[0];
    // let type = parts[1];
    const asset = parts[2];
    const quoteAsset = parts[3];

    return { baseAsset: asset, quoteAsset };
  }

  ConstructSubscriptionObject() {
    const { subscription } = this;
    const parts = subscription.split("-");
    const exchange = parts[0];
    const type = parts[1];
    const asset = parts[2];
    const quoteAsset = parts[3];
    const object = {
      exchange,
      market: {
        baseAsset: {},
        quoteAsset,
      },
    };
    const [, , , , , strike] = parts;
    switch (type) {
      case "SPOT":
        object.market.baseAsset.type = "SPOT";
        object.market.baseAsset.asset = asset;
        break;
      case "PERP":
        object.market.baseAsset.type = "PERPETUAL";
        object.market.baseAsset.underlying = asset;
        break;
      case "FUT":
        object.market.baseAsset.type = "DATED_FUTURE";
        object.market.baseAsset.underlying = asset;
        object.market.baseAsset.expiry = parts[4].replace(
          /(\d{4})(\d{2})(\d{2})/,
          "$1-$2-$3",
        );
        break;
      case "OPT":
        object.market.baseAsset.type = "OPTION";
        object.market.baseAsset.underlying = asset;
        object.market.baseAsset.expiry = parts[4].replace(
          /(\d{4})(\d{2})(\d{2})/,
          "$1-$2-$3",
        );
        object.market.baseAsset.strike = strike;
        object.market.baseAsset.option_type = parts[6] === "C" ? "CALL" : "PUT";
        break;
      default:
        return object;
    }

    return object;
  }

  static TransformSubscription(subscription) {
    const { market } = subscription;
    switch (market.type) {
      case "SPOT":
        return {
          exchange: subscription.exchange,
          market: {
            baseAsset: {
              type: "SPOT",
              asset: market.asset,
            },
            quoteAsset: market.quoteAsset,
          },
        };
      case "PERPETUAL":
        return {
          exchange: subscription.exchange,
          market: {
            baseAsset: {
              type: "PERPETUAL",
              underlying: market.underlying,
            },
            quoteAsset: market.quoteAsset,
          },
        };
      case "DATED_FUTURE":
        return {
          exchange: subscription.exchange,
          market: {
            baseAsset: {
              type: "DATED_FUTURE",
              underlying: market.underlying,
              expiry: market.expiry,
            },
            quoteAsset: market.quoteAsset,
          },
        };
      case "OPTION":
        return {
          exchange: subscription.exchange,
          market: {
            baseAsset: {
              type: "OPTION",
              underlying: market.underlying,
              expiry: market.expiry,
              strike: market.strike,
              option_type: market.option_type,
            },
            quoteAsset: market.quoteAsset,
          },
        };

      default:
        return subscription;
    }
  }
}
