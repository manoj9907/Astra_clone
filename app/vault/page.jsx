"use client";

import React from "react";
// import {ApiVault as ApiVaultWS} from "@/app/components/lit/components/api-vault/api-vault.js";

// const ApiVault = createComponent({
//     react: React,
//     tagName: 'my-api-vault',
//     elementClass: ApiVaultWS,
//     // Defines props that will be event handlers for the named events
//     // events: {
//     //
//     // },
// });

function Page() {
  return (
    <main className="grid-row-19 max-h-50 grid-cols-3 p-4">
      <h2 className="row-start-1"> About Page</h2>
      <div className="row-start-2 h-10">{/* <ApiVault> </ApiVault> */}</div>
    </main>
  );
}

export default Page;
