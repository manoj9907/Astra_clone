import Deposit from "../../assets/balance/deposit-button.svg";
import bitcoin from "@/assets/otcpage/bitcoin.png";
import etherum from "@/assets/otcpage/etherum-icon.svg";
import fantom from "@/assets/otcpage/fantom-icon.svg";
import tetherIcon from "@/assets/otcpage/tether-icon.svg";

export const options = [
  { value: "A", image: Deposit.src, text1: "Withdrawal", text2: "Option A" },
  { value: "B", image: Deposit.src, text1: "Withdrawal", text2: "Option B" },
  { value: "C", image: Deposit.src, text1: "Withdrawal", text2: "Option C" },
  { value: "D", image: Deposit.src, text1: "Withdrawal", text2: "Option C" },
  { value: "E", image: Deposit.src, text1: "Withdrawal", text2: "Option C" },
  { value: "F", image: Deposit.src, text1: "Withdrawal", text2: "Option C" },
  { value: "G", image: Deposit.src, text1: "Withdrawal", text2: "Option C" },
  { value: "H", image: Deposit.src, text1: "Withdrawal", text2: "Option C" },
  { value: "I", image: Deposit.src, text1: "Withdrawal", text2: "Option C" },
  { value: "J", image: Deposit.src, text1: "Withdrawal", text2: "Option C" },
  { value: "K", image: Deposit.src, text1: "Withdrawal", text2: "Option C" },
  { value: "L", image: Deposit.src, text1: "Withdrawal", text2: "Option C" },
  { value: "M", image: Deposit.src, text1: "Withdrawal", text2: "Option C" },
];

export const market = [
  { value: "usdt", text1: "USDT Tether ", text2: "" },
  { value: "binance", text1: "Binance Exchange", text2: "" },
  { value: "kucoin", text1: "KuCoin Exchange", text2: "" },
  // Add more options here
];

export const methods = [
  { value: "bank", text1: "Bank Transfer", text2: "" },
  { value: "paypal", text1: "PayPal", text2: "" },
  { value: "crypto", text1: "Crypto Wallet", text2: "" },
  // Add more options here
];
export const coins = [
  { name: "Bitcoin", text1: "BTC", value: "BTC", image: bitcoin },
  { name: "Ethereum", text1: "ETH", value: "ETH", image: etherum },
  { name: "Fantom", text1: "FTM", value: "FTM", image: fantom },
  { name: "Tether", text1: "USDT", value: "USDT", image: tetherIcon },
];
