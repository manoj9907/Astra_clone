import React from "react";
import AuthPage from "./auth/signin/page";

export default function Home() {
  return (
    <main className="flex grow flex-col">
      <AuthPage />
    </main>
  );
}
