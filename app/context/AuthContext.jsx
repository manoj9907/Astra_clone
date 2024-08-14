import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useMemo,
} from "react";
// import { auth } from "@/app/firebase";
import { VALIDATE_EMAIL_API, API_KEY, USER_TOKEN } from "../../constants";
import {
  getDataFromDatabase,
  clearDatabase,
} from "@/services/authservice/credientalmanagement";
import { appDB } from "../../db";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [wsInit, setWsInit] = useState(false);
  const [tokenFetched, setTokenFetched] = useState(true);
  const [controllNav, setControllNav] = useState(false);
  const [tabId] = useState("");

  const logOut = async () => {
    setWsInit(false);
    setUser(null);
    setTokenFetched(false);
    await clearDatabase();
    window.location.href = "/";
  };

  const getUserDetails = async (email) => {
    try {
      const response = await fetch(VALIDATE_EMAIL_API, {
        method: "POST",
        headers: {
          "x-astra-api-key": API_KEY,
        },
        body: JSON.stringify({ userEmail: email }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    } catch (errr) {
      return errr;
    }
  };

  const getToken = async (email) => {
    try {
      const response = await fetch(USER_TOKEN, {
        method: "POST",
        headers: {
          "x-astra-api-key": API_KEY,
        },
        body: JSON.stringify({ user_email: email }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    } catch (errr) {
      return errr;
    }
  };

  const getTokenFromFirebase = async (email) => {
    setWsInit(true);

    const getuserdetails = await getUserDetails(email);

    if (getuserdetails.id) {
      const result = await getToken(email);

      if (result.token) {
        let { token } = result;

        token = token.split(".");

        const decodedToken = JSON.parse(atob(token[1]));

        setUser(getuserdetails);

        Object.entries(decodedToken).forEach(([key, value]) => {
          appDB.userData.put({ key, value });
        });

        setTokenFetched(true);
      } else {
        console.error("Error on getting User Token");
      }
    } else {
      console.error("Error on getting User Details");
    }
  };

  useEffect(() => {
    (async () => {
      const getlocaltoken = await getDataFromDatabase()
        .then((data) => data)
        .catch(() => false);

      const userdetails = getlocaltoken?.userdetails;
      if (userdetails && userdetails != null && userdetails !== undefined) {
        const userdata = userdetails;
        setUser(userdata);
      }

      if (wsInit && tokenFetched) {
        setWsInit(false);
        // setUser(null);
        setTokenFetched(false);
      }

      if (
        !wsInit &&
        userdetails &&
        userdetails != null &&
        !tokenFetched &&
        userdetails !== undefined
      ) {
        const userdata = JSON.parse(userdetails);
        setUser(userdata);
        getTokenFromFirebase(userdata.email).then(() => {});
      } else {
        setWsInit(false);
        // setUser(null);
        setTokenFetched(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const getlocaltoken = await getDataFromDatabase()
        .then((data) => data)
        .catch(() => false);

      const allowPages = ["", "/", "auth"];
      const path = window.location.pathname.split("/")[1];
      if (!getlocaltoken && !allowPages.includes(path)) {
        window.location.href = "/auth/signin";
      } else if (getlocaltoken && allowPages.includes(path)) {
        window.location.href = "/dashboard";
      }
    })();
  }, [user]);
  const optimizeValue = useMemo(
    () => ({ user, logOut, tokenFetched, tabId, setControllNav, controllNav }),
    [tokenFetched, user, controllNav],
  );
  return (
    <AuthContext.Provider value={optimizeValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const UserAuth = () => useContext(AuthContext);
