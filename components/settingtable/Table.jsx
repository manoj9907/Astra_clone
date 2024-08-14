/* eslint-disable react/no-unstable-nested-components */
// E:\astra\astra-terminal\components\settingtable\Table.js

import React, { useState, useRef, useEffect } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import Image from "next/image";
import { UserAuth } from "@/app/context/AuthContext";
// import Modal from "../modal/modal";
import Modal from "../modal/modal";
import copyToClipboard from "@/utils/copyToClipboard";
import { Button } from "@/components/ui/button";

import {
  getApikey,
  createApiKey,
  deleteApikey,
  editApikey,
} from "@/services/settings/SettingsService";
import {
  copyText,
  Add,
  nextArrow,
  homeIcon,
} from "../../assets/settings/index";
import showAlert from "@/services/commonservice/AlertService";
import CustomTable from "../tanstack-table/table";
import TableCell from "../tanstack-table/TableCell";
import EditCell from "../tanstack-table/EditCell";
import { Input } from "../input";
import useWidth from "../customHooks/useWidth";
// import { Button } from "../ui/button";

function SettingTable() {
  const { user } = UserAuth();
  const inputRef = useRef(null);
  const [apiName, setApiName] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [apikeyList, setApikeyList] = useState([]);
  const [copyApiForm, setCopyApiForm] = useState(false);
  const [createdApikey, setCreatedApikey] = useState(null);
  const [isMd, setIsMd] = useState(false);
  const [showAlertMessage, setShowAlertMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  const fetchApikey = async () => {
    const data = await getApikey(user?.userId);
    if (data?.data) {
      setApikeyList(data.data);
    }
  };
  const createApikeyHandler = async () => {
    if (!apiName) {
      setAlertMessage("API name cannot be empty");
      setShowAlertMessage(true);
      return;
    }
    setDisableBtn(true);
    const payload = {
      nickname: apiName,
      userId: user?.userId,
      scope: "pro-user",
    };
    const response = await createApiKey(payload);
    if (response?.status === true) {
      setDisableBtn(false);
      setApiName("");
      setShowForm(false);
      setCopyApiForm(true);
      setCreatedApikey(response?.data?.keyPlaintext);
      showAlert("success", "API Key Create Successfully");
      fetchApikey();
    } else {
      setDisableBtn(false);
      showAlert("error", "Error occurred please try again later");
    }
  };

  const editApikeyHandler = async (value, id) => {
    const response = await editApikey(value, id);
    if (response === true) {
      showAlert("success", "API Key Edit Successfully");
      fetchApikey();
      return true;
    }
    showAlert("error", "Error in Edit API Key");
    throw new Error("Invalid response");
  };

  const deleteApikeyHandler = async (id) => {
    const status = await deleteApikey(id);
    if (status === true) {
      fetchApikey();
      showAlert("success", "API Key delete Successfully");
    } else showAlert("error", "Error in delete API Key");
  };

  useEffect(() => {
    if (user?.userId) {
      fetchApikey();
    }
  }, [user?.userId]);
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
  const getScreenWidth = useWidth();
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("nickname", {
      header: "API key",
      cell: TableCell,
      meta: {
        type: "text",
      },
    }),
    columnHelper.accessor("createdAt", {
      header: "Created At",
      cell: (info) => {
        const milliseconds = Math.floor(info.getValue() / 1000);
        const date = new Date(milliseconds);
        return <div> {date.toLocaleString()}</div>;
      },
    }),
    columnHelper.accessor("updatedAt", {
      cell: (info) => {
        const milliseconds = Math.floor(info.getValue() / 1000);
        const date = new Date(milliseconds);
        return <div> {date.toLocaleString()}</div>;
      },
      header: "Updated At",
    }),
    columnHelper.accessor("status", {
      header: "Status",
    }),
    columnHelper.display({
      header: "Actions",
      id: "edit",
      cell: (props) => (
        <EditCell
          {...props}
          deleteApicall={deleteApikeyHandler}
          editApikeyHandler={editApikeyHandler}
        />
      ),
    }),
  ];
  const showInputkey = () => {
    if (getScreenWidth < 500 && createdApikey) {
      return createdApikey.slice(0, 25) + "....";
    }
    return createdApikey || "";
  };
  return (
    <>
      <div>
        {isMd && (
          <div className="flex items-center gap-5 border-b border-t border-gray-400/25 px-5 md:hidden">
            <Link href="/dashboard">
              <Image alt="home" src={homeIcon.src} height={20} width={16} />
            </Link>
            <Image
              alt="nextArrow"
              src={nextArrow.src}
              height={12}
              width={12}
              className="mt-0.5"
            />
            <p className="pb-3 pt-3 text-sm text-gray-400">Settings</p>
            <Image
              alt="nextArrow"
              src={nextArrow.src}
              height={12}
              width={12}
              className="mt-0.5"
            />
            <p className="pb-3 pt-3 text-sm text-gray-100">API Key</p>
          </div>
        )}
        {!isMd && (
          <div className="mb-5 mt-5 flex justify-end px-custom-37px">
            <Button
              onClick={() => {
                setShowForm(!showForm);
                setApiName("");
              }}
            >
              <Image
                src={Add.src}
                alt="apikey"
                width={10}
                height={10}
                className="mr-1 h-3 w-5"
              />
              Create API Key
            </Button>
          </div>
        )}
      </div>
      <div className="h-3/4 overflow-y-auto px-4 xl:px-3">
        <CustomTable
          className="w-full"
          data={apikeyList}
          columns={columns}
          showSort
          showSearch
          showPagination
        />
      </div>

      {isMd && (
        <div className=" fixed bottom-0.5 w-full bg-black p-5">
          <div className=" flex items-center justify-center md:flex  md:h-screen md:w-custom-305 md:flex-row md:items-center md:justify-around ">
            <Button
              className="w-72"
              onClick={() => {
                setShowForm(!showForm);
                setApiName("");
              }}
            >
              <Image
                src={Add.src}
                alt="apikey"
                width={10}
                height={10}
                className="mr-1 h-3 w-5"
              />
              Create API Key
            </Button>
          </div>
        </div>
      )}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
        }}
        submit={() => {
          createApikeyHandler();
        }}
        isDisable={disableBtn}
        inputValue={apiName}
        buttonLabel="Next"
      >
        <div className="item-center mb-15 mx-auto mb-5 w-full max-w-lg justify-center rounded-lg border border-white px-6 pt-6">
          <div className="mb-6 pb-6">
            <h1 className="letterSpacing mb-2 text-left text-lg font-bold text-gray-300">
              Create Nickname
            </h1>
            <p className="letterSpacing pt-7 text-left font-semibold text-gray-400">
              API Nickname
            </p>
            <div className="py-2">
              <Input
                value={apiName}
                type="text"
                placeholder="Type name"
                onChange={(e) => {
                  setApiName(e.target.value);
                  setShowAlertMessage(false);
                }}
              />
            </div>
            {showAlertMessage && (
              <div className="alert-message text-red-500">{alertMessage}</div>
            )}
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={copyApiForm}
        onClose={() => {
          setCopyApiForm(false);
          setCreatedApikey(null);
        }}
        submit={() => {
          setCreatedApikey(null);
          setCopyApiForm(false);
        }}
        buttonLabel="Done"
      >
        <div className="item-center mx-auto mb-5 flex h-4/5 w-full max-w-lg flex-col justify-items-start rounded-lg  border border-white px-6 py-6">
          <h1 className="letterSpacing mb-2 text-left text-lg font-bold text-gray-300">
            Copy API Key
          </h1>
          <p className="letterSpacing pt-7 text-left text-gray-100">API Key</p>
          <div className="relative py-3">
            <Input
              ref={inputRef}
              value={showInputkey()}
              disabled
              type="text"
              placeholder="Type name"
              className="text-xs text-gray-200 sm:text-sm"
            />

            <Image
              onClick={() => copyToClipboard(inputRef.current.value)}
              className="absolute bottom-2 right-2 -translate-y-1/2 transform cursor-pointer"
              src={copyText.src}
              width={25}
              height={25}
              alt="copy"
            />
          </div>
          <p className="apikeyalerttext pt-2 text-left text-yellow-400">
            This API key is only displayed once creation. We do NOT store it on
            our servers. Please make sure to note it down, as we will not be
            able to recover it for you.
          </p>
        </div>
      </Modal>
    </>
  );
}

export default SettingTable;
