import bitcoinIcon from "@/assets/otcpage/bitcoin.svg";
import usdIcon from "@/assets/otcpage/usd-icon.svg";
import tetherIcon from "@/assets/otcpage/tether-icon.svg";
import fantomIcon from "@/assets/otcpage/fantom-icon.svg";
import ethereumIcon from "@/assets/otcpage/etherum-icon.svg";

export const TOKEN_ICONS = {
  BTC: bitcoinIcon.src,
  USD: usdIcon.src,
  USDT: tetherIcon.src,
  ETH: ethereumIcon.src,
  FTM: fantomIcon.src,
};

export const INSTRUMENT_ID_TO_SYMBOL = {
  "4bb14c43-0dd4-45bf-835d-e77a1544828e": "BTC",
  "dbfe5994-1a72-4fdd-8f2f-6f86a98be9b4": "USD",
  /// added
  "9d7e289e-4dce-4fbd-bdf0-d2f98d267a84": "BTC",
  "cf24749a-5c09-4dd0-99a6-b3a98df605ed": "USD",
};
