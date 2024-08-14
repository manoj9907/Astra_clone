"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ibmPlexMono from "./font";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import { AuthContextProvider } from "@/app/context/AuthContext";
import SubscriptionContextProvider from "@/app/context/SubscriptionContext";
import Header from "@/components/responsiveHeader/Header";
import { getDataFromDatabase } from "@/services/authservice/credientalmanagement";
import { GOOGLE_OAUTH_CLIENT_ID } from "../constants";
import { collectMarketData } from "./actions";

function RootLayout({ searchModal, modal, children }) {
  const clientId = GOOGLE_OAUTH_CLIENT_ID;
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleKeyDown = (e) => {
    if (e.keyCode === 75 && e.metaKey) {
      router.push("/search");
    }
    if (e.keyCode === 27) {
      router.back();
    }
  };
  useEffect(() => {
    (async () => {
      await getDataFromDatabase()
        .then((data) => {
          setToken(data);
        })
        .catch(() => {});
        // collectMarketData()
    })();
  }, []);
  return (
    <html lang="en" className={ibmPlexMono.variable}>
      <body
        className="custom-body border-gray-399/25 relative flex h-full w-full flex-col border bg-black"
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex="0"
      >
        <AuthContextProvider>
          <SubscriptionContextProvider>
            <GoogleOAuthProvider clientId={clientId}>
              <div
                id="Subscription"
                style={{
                  position: "absolute",
                  width: "99%",
                  margin: "0,auto",
                  padding: "9px",
                  zIndex: "9999",
                  pointerEvents: "none",
                }}
              />
              {token && (
                <Header isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
              )}
              <div className="col-start-1 row-start-1 flex h-full w-full flex-row place-items-stretch place-self-stretch font-mono">
                <Navbar setIsNavOpen={setIsNavOpen} />
                {children}
              </div>
              {searchModal}
              {modal}
              <div id="modal-root" />
            </GoogleOAuthProvider>
          </SubscriptionContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}

export default RootLayout;
