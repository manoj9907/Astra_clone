import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Subscription from "@/components/utilities/subscription";
import { UserAuth } from "@/app/context/AuthContext";
// import dynamic from "next/dynamic";
// import SearchBar from "@/app/components/searchBar/searchBar";

const SubscriptionContext = createContext();

function SubscriptionContextProvider({ children }) {
  // const [showSearchBar, setShowSearchBar] = useState(false);

  const [subscription, setSubscription] = useState(
    new Subscription(
      // Check local storage for a previously selected subscription
      typeof window !== "undefined" &&
      localStorage.getItem("selectedSubscription")
        ? localStorage.getItem("selectedSubscription")
        : "BINANCE-SPOT-BTC-USDT",
    ),
  );

  const workerRef = useRef(null);
  const { user, tokenFetched, tabId } = UserAuth();

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("/orderbookWorker.mjs", import.meta.url),
      { type: "module" },
    );
    if (tokenFetched && user) {
      workerRef.current.postMessage({
        action: "init",
        subscription: subscription.subscription,
        userId: tabId,
      });
    }
  }, [subscription]);

  const changeSubscription = (newSubscription) => {
    const uppercaseSubscription = newSubscription.toUpperCase();
    const newSub = new Subscription(uppercaseSubscription);
    setSubscription(newSub);
    workerRef.current.postMessage({
      action: "open",
      subscription: newSub.ConstructSubscriptionObject(),
    });
  };
  const optimizeValue = useMemo(
    () => ({ changeSubscription, subscription }),
    [subscription, changeSubscription],
  );
  return (
    <SubscriptionContext.Provider value={optimizeValue}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export default SubscriptionContextProvider;

export const UserSubscription = () => useContext(SubscriptionContext);
