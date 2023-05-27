"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var Web3 = __toESM(require("@solana/web3.js"));
var import_cors = __toESM(require("cors"));
var import_express = __toESM(require("express"));
var import_js = require("@metaplex-foundation/js");
var import_semaphore_async_await = __toESM(require("semaphore-async-await"));
var collectionAuthorityKey = Web3.Keypair.fromSecretKey(
  Uint8Array.from([100, 218, 28, 88, 90, 31, 202, 200, 105, 72, 96, 24, 31, 246, 50, 57, 151, 60, 149, 141, 43, 223, 167, 143, 28, 2, 94, 104, 234, 179, 102, 114, 145, 1, 117, 91, 193, 118, 183, 70, 160, 142, 139, 28, 243, 129, 103, 12, 62, 181, 184, 220, 153, 179, 13, 231, 90, 58, 192, 49, 154, 207, 241, 139])
);
var connection = new Web3.Connection(Web3.clusterApiUrl("devnet"));
var collectNFT;
var collectNftPubKey;
var collectNFTlock = new import_semaphore_async_await.default(1);
var verifierPubKey = new Web3.PublicKey("Bn3Jyfx6hBYGHhgKWBK16ar65F2Rdir4pENPBxTXfNDr");
var ticketcoinSolanaProgram = new Web3.PublicKey("7CfS9hfXmqejz69Dx7kPhKxyNUwt1F8gmRTvAp1KyD3f");
var metaplex = new import_js.Metaplex(connection).use((0, import_js.keypairIdentity)(collectionAuthorityKey));
var app = (0, import_express.default)();
app.use(import_express.default.json());
app.use((0, import_cors.default)());
app.get("/infos", (req, res) => {
  if (collectNFT != void 0) {
    res.send('{nft_collections_authority: "' + collectionAuthorityKey.publicKey + '", concerts:[{1, name: "' + collectNFT.nft.name + '", address: "' + collectNftPubKey.toString() + '"}], verifier: "' + verifierPubKey.toString() + '", "smart contract": "' + ticketcoinSolanaProgram.toString() + '"}');
  } else {
    res.status(404).send("Call /create_event before getting /infos");
  }
});
app.get("/create_event", (req, res) => __async(exports, null, function* () {
  yield collectNFTlock.acquire();
  try {
    if (collectNFT == void 0) {
      console.log("Creating NFT Collection");
      collectNFT = yield metaplex.nfts().create({
        name: "Ed Sheeran - Exclusive Concert",
        sellerFeeBasisPoints: 0,
        uri: "https://github.com/zigtur",
        //maybe changing it to an Ed Sheeran image will be good
        isMutable: false,
        isCollection: true
      }, { commitment: "finalized" });
      console.log("Collection NFT address: ", collectNFT.nft.address);
      collectNftPubKey = collectNFT.nft.address;
    }
  } finally {
    yield collectNFTlock.release();
    res.send('{nft_collections_authority: "' + collectionAuthorityKey.publicKey + '", concerts:[{1, name: "' + collectNFT.nft.name + '", address: "' + collectNftPubKey.toString() + '"}], verifier: "' + verifierPubKey.toString() + '", "smart contract": "' + ticketcoinSolanaProgram.toString() + '"}');
  }
}));
app.get("/verify_collection/:nft_mint_address", (req, res) => __async(exports, null, function* () {
  if (collectNFT != void 0) {
    const nft_mint_address = req.params.nft_mint_address;
    const collectionVerificationForNFT = yield metaplex.nfts().verifyCollection({
      mintAddress: new Web3.PublicKey(nft_mint_address),
      collectionMintAddress: collectNFT.mintAddress,
      collectionAuthority: collectionAuthorityKey
    });
    res.send('NFT "' + nft_mint_address.toString() + '": verified');
  } else {
    res.status(404).send("Call /create_event before getting /verify_collection");
  }
}));
app.all("*", (req, res) => {
  res.status(404).send("Not found");
});
app.listen(8e3, () => console.log("Server running on port 8000"));
