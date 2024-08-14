// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from "react";
import "./chart.css";

function getSymbol(subs) {
  const { market } = subs;
  const { exchange } = subs;
  if (market.baseAsset.type === "SPOT") {
    return `${exchange}:${market.baseAsset.asset}${market.quoteAsset}`;
  }
  if (market.baseAsset.type === "PERPETUAL") {
    return `${exchange}:${market.baseAsset.underlying}${market.quoteAsset}.p`;
  }
  return `${exchange}:${market.baseAsset.underlying}${market.quoteAsset}.u`;
}

function TradingViewWidgetInner({ subscription }) {
  // const [symbol, setSymbol] = useState(
  //   getSymbol(subscription.ConstructSubscriptionObject()),
  // ); // ["NASDAQ:AAPL", "NASDAQ:GOOGL", "NASDAQ:MSFT"
  const container = useRef();
  useEffect(() => {
    // Clean up any previously appended scripts
    const containerElement = container.current;
    if (!containerElement) return;
    while (containerElement.firstChild) {
      containerElement.removeChild(containerElement.firstChild);
    }
    // Set symbol and create new script element
    const symbol = getSymbol(subscription.ConstructSubscriptionObject());
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${symbol}",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "backgroundColor": "rgba(0, 0, 0, 1)",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "hide_top_toolbar": true,
        "hide_legend": true,
        "save_image": false,
        "calendar": false,
        "isTransparent": true,
        "support_host": "https://www.tradingview.com"
      }`;

    // Append the script to the container
    containerElement.appendChild(script);
    containerElement.style.border = "none";
  }, [subscription]);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: "100%", width: "100%" }}
    >
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

const mapMarketToTradingViewSymbol = (market) => {
  const segments = market.split("-");
  const exchange = segments[0];
  const assetType = segments[1];
  const baseAsset = segments[2];
  const quoteAsset = segments[3];

  let symbol = `${exchange}:${baseAsset}${quoteAsset}`;

  // TradingView's format for representing perps
  if (assetType === "PERP") {
    symbol = `${symbol}.P`;
  }

  return symbol;
};

function TradingViewWidgetNewInner({ market }) {
  const symbol = mapMarketToTradingViewSymbol(market);
  const container = useRef();

  useEffect(() => {
    const randomId = Math.random().toString(36);
    const script = document.createElement("script");
    script.id = randomId;
    script.src = "http://localhost:3000/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "autosize": true,
          "symbol": "${symbol}",
          "interval": "1",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "backgroundColor": "rgba(0, 0, 0, 1)",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "hide_top_toolbar": true,
          "hide_legend": true,
          "save_image": false,
          "calendar": false,
          "isTransparent": true,
          "support_host": "https://www.tradingview.com"
        }`;
    container.current.appendChild(script);

    return () => {
      const getScript = document.getElementById(randomId);
      if (!getScript) return;
      container.current.removeChild(getScript);
    };
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: "100%", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      />
    </div>
  );
}

export const TradingViewWidgetNew = memo(TradingViewWidgetNewInner);
export const TradingViewWidget = memo(TradingViewWidgetInner);
