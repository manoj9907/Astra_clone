// E:\astra_components\astra-terminal\app\components\lit\components\orderbook\orderbook-side.js

import React, { useState, useEffect } from "react";

function OrderbookSide({ name, message }) {
  const [precisionPrice, setPrecisionPrice] = useState(0);
  const [precisionQuantity, setPrecisionQuantity] = useState(0);

  useEffect(() => {
    const maxQuantity = (array) => {
      let max = 0;
      let maxPrecisionPrice = precisionPrice;
      let maxPrecisionQuantity = precisionQuantity;

      if (Array.isArray(array)) {
        array.forEach((item) => {
          const quantityDec = `${item.quantity}`.split(".")[1];
          const priceDec = `${item.price}`.split(".")[1];
          const quantityDecLength = quantityDec ? quantityDec.length : 0;
          const priceDecLength = priceDec ? priceDec.length : 0;
          if (quantityDecLength > maxPrecisionQuantity) {
            maxPrecisionQuantity = quantityDecLength;
          }
          if (priceDecLength > maxPrecisionPrice) {
            maxPrecisionPrice = priceDecLength;
          }
          if (item.quantity > max) {
            max = item.quantity;
          }
        });
      }

      setPrecisionPrice(maxPrecisionPrice);
      setPrecisionQuantity(maxPrecisionQuantity);

      return max;
    };

    if (Array.isArray(message)) {
      maxQuantity(message);
    }
  }, [message]);

  const processMessage = () => {
    const isBid = name === "bid";
    let sorted = message;
    const itemTemplates = [];

    if (!Array.isArray(sorted)) {
      sorted = [];
    }

    sorted.forEach((element) => {
      const updatedElement = { ...element };
      updatedElement.percentage =
        (element.quantity / (precisionQuantity * 1.1)) * 100;
      itemTemplates.push(
        <div
          className=" relative z-10 flex flex-row justify-between px-2 font-mono text-gray-400"
          key={element.id}
        >
          {isBid ? (
            <div
              className=" underlying h-full bg-green-400/20 font-mono"
              style={{ width: `${updatedElement.percentage}%` }}
            />
          ) : (
            <div
              className="underlying h-full bg-red-400/20 font-mono"
              style={{ width: `${updatedElement.percentage}%` }}
            />
          )}
          <div className="text-start font-mono">
            {element.price.toFixed(precisionPrice)}
          </div>
          <div className="text-end font-mono">
            {element.quantity.toFixed(precisionQuantity)}
          </div>
        </div>,
      );
    });

    return itemTemplates;
  };

  return (
    <div className="flex flex-col gap-1 font-mono text-xs text-white">
      {processMessage()}
    </div>
  );
}

export default OrderbookSide;
