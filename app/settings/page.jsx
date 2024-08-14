"use client";

import React, { useEffect, useState } from "react";
import Headers from "../header";
import Sidebar from "../sidebar";
import Footer from "../footer";
import Table from "../../components/settingtable/Table";

function Page() {
  const [isMd, setIsMd] = useState(false);
  const checkScreenWidth = () => {
    setIsMd(window.innerWidth < 768);
  };
  useEffect(() => {
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col">
      {!isMd && <Headers text="Settings" />}
      <div className="flex h-full w-full">
        {!isMd && <Sidebar />}
        <div className="h-full w-full">
          <Table />
        </div>
      </div>
      {!isMd && <Footer />}
    </div>
  );
}

export default Page;
