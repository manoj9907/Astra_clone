import React, { useState, useEffect } from "react";

function TradesbookSide({ message }) {
  const [precisionPrice, setPrecisionPrice] = useState(0);
  const [precisionQuantity, setPrecisionQuantity] = useState(0);

  useEffect(() => {
    const maxQuantity = () => {
      let max = 0;
      let tempPrecisionPrice = 0;
      let tempPrecisionQuantity = 0;

      if (Array.isArray(message)) {
        message.forEach((item) => {
          const quantityDec = `${item.quantity}`.split(".")[1];
          const priceDec = `${item.price}`.split(".")[1];
          const quantityDecLength = quantityDec ? quantityDec.length : 0;
          const priceDecLength = priceDec ? priceDec.length : 0;

          if (quantityDecLength > tempPrecisionQuantity) {
            tempPrecisionQuantity = quantityDecLength;
          }
          if (priceDecLength > tempPrecisionPrice) {
            tempPrecisionPrice = priceDecLength;
          }
          if (item.quantity > max) {
            max = item.quantity;
          }
        });
      }
      setPrecisionPrice(tempPrecisionPrice);
      setPrecisionQuantity(tempPrecisionQuantity);
    };

    maxQuantity();
  }, [message]);

  const timeWithoutTimezone = (time) => {
    const date = new Date(time);
    const tzoffset = date.getTimezoneOffset() * 60000;
    const withoutTimezone = new Date(date.valueOf() - tzoffset)
      .toISOString()
      .slice(0, -1);
    return withoutTimezone.split("T")[1].split(".")[0];
  };

  const processMessage = () => {
    let sorted = message;
    const itemTemplates = [];

    if (!(sorted instanceof Array)) {
      sorted = [];
    }

    sorted = sorted.map((element) => {
      const max = Math.max(...sorted.map((item) => item.quantity));
      const percentage = (element.quantity / (max * 1.1)) * 100;
      return { percentage, ...element };
    });

    for (const i of sorted) {
      const isBuy = i.side.toLowerCase() === "buy";
      itemTemplates.push(
        <div
          className="relative z-10 flex w-full flex-row justify-between px-2 text-gray-400"
          key={i.id}
        >
          {isBuy ? (
            <div
              className="underlying h-full bg-green-400/20"
              style={{ width: `${i.percentage}%` }}
            />
          ) : (
            <div
              className="underlying h-full bg-red-400/20"
              style={{ width: `${i.percentage}%` }}
            />
          )}
          <div className="basis-1/3 text-start">
            {i.price.toFixed(precisionPrice)}
          </div>
          <div
            className={`basis-1/3 text-center ${isBuy ? "text-green-500" : "text-red-500"}`}
          >
            {i.quantity.toFixed(precisionQuantity)}
          </div>
          <div className="basis-1/3 text-end">
            {timeWithoutTimezone(i.time)}
          </div>
        </div>,
      );
    }
    return itemTemplates;
  };

  return (
    <div className="flex  h-full flex-col gap-0.5 font-mono text-xs text-white">
      {processMessage()}
    </div>
  );
}

export default TradesbookSide;
