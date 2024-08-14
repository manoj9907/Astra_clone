let trades = [];
let tradesDisplay = {};
export default function processTrades(jsonData) {
  const localTrades = trades;
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

  trades = localTrades;
  const depth = 50;
  tradesDisplay = localTrades.slice(-depth, localTrades.length);
  return tradesDisplay;
}
