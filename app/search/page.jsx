"use client";

// Initially tried to lazy load the searchBar but its not needed now since we return null
// when it takes time to load search index
// import dynamic from "next/dynamic";
// const SearchBar = dynamic(() => import("@/app/components/searchBar/searchBar"), {
//     loading: () => <p>Loading...</p>,
// });
import React, { useEffect, useState } from "react";
import { isObjectEmpty, loadFTS } from "@/app/util";

// import Modal from "@/app/@searchModal/modal/modal";
import SearchBar from "@/components/searchBar/searchBar";
import showAlert from "@/services/commonservice/AlertService";

// export const revalidate = 3600; // revalidate the data at most every hour

export default function Page() {
  const [indexDump, setIndexDump] = useState({});
  const [isClient, setIsClient] = useState(true);
  const [showLoader, setshowLoader] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }

    const callLoadIndex = async () => {
      loadFTS()
        .then((res) => {
          setIndexDump(res);
          setshowLoader(false);
        })
        .catch((err) => {
          console.warn(err,"indexDump")
          setshowLoader(false);
          showAlert("error", "Please try again later")
        });
    };
    callLoadIndex().then();
  }, []);

  // if (!isClient || isObjectEmpty(indexDump)) {
  //   return null;
  // }
  console.warn(indexDump,"indexDump")
  return (
    <div className="h-full w-full ">
      {showLoader && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="text-center text-white">
            <div className="loader"> Loading...</div>
          </div>
        </div>
      )}
      {
        Object.keys(indexDump).length > 0 &&(
          <SearchBar indexDump={indexDump} />
        )
      }
    </div>
  );
}
