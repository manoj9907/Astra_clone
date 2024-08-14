import Dexie from "dexie";

export const userdb = new Dexie("UserCredentialsDB");
export const appDB = new Dexie("app");
export const vaultDB = new Dexie("vault");
export const marketDB = new Dexie("marketData");

userdb.version(1).stores({
  astra_credential: "++id, userdetails",
});

vaultDB.version(1).stores({
  exchange: "key, value",
});

appDB.version(1).stores({
  userData: "key, value",
});

marketDB.version(1).stores({
  marketData: `++id, data.exchange, data.market.type, data.market.asset, 
  data.market.underlying, data.market.expiry, data.market.strike, 
  data.market.option_type, data.market.quoteAsset, data.market.market`,
  metaData: "key, value",
  ftsIndex: "key, value",
  //                 [exchange, market.baseAsset.type + market.quoteAsset +  market.baseAsset.asset ] \
  //                 [exchange, market.baseAsset.type + market.quoteAsset +  market.baseAsset.underlying] '
});
