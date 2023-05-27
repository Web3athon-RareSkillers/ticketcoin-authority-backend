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
var import_spl_token = require("@solana/spl-token");
var import_anchor = require("@coral-xyz/anchor");

// src/ticketcoin_contract.ts
var IDL = {
  "version": "0.1.0",
  "name": "ticketcoin_contract",
  "instructions": [
    {
      "name": "mintNft",
      "accounts": [
        {
          "name": "mintAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "collection",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "useAuthorityRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "verifier",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "burner",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "creatorKey",
          "type": "publicKey"
        },
        {
          "name": "uri",
          "type": "string"
        },
        {
          "name": "title",
          "type": "string"
        }
      ]
    },
    {
      "name": "verifyNft",
      "accounts": [
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "verifier",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "useAuthorityRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "burner",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ]
};

// src/index.ts
var collectionAuthorityKey = Web3.Keypair.fromSecretKey(
  Uint8Array.from([100, 218, 28, 88, 90, 31, 202, 200, 105, 72, 96, 24, 31, 246, 50, 57, 151, 60, 149, 141, 43, 223, 167, 143, 28, 2, 94, 104, 234, 179, 102, 114, 145, 1, 117, 91, 193, 118, 183, 70, 160, 142, 139, 28, 243, 129, 103, 12, 62, 181, 184, 220, 153, 179, 13, 231, 90, 58, 192, 49, 154, 207, 241, 139])
);
var connection = new Web3.Connection(Web3.clusterApiUrl("devnet"), "finalized");
var collectNFT;
var collectNftPubKey;
var collectNFTlock = new import_semaphore_async_await.default(1);
var verifierPubKey = new Web3.PublicKey("Bn3Jyfx6hBYGHhgKWBK16ar65F2Rdir4pENPBxTXfNDr");
var ticketcoinSolanaProgram = new Web3.PublicKey("7CfS9hfXmqejz69Dx7kPhKxyNUwt1F8gmRTvAp1KyD3f");
var metaplex = new import_js.Metaplex(connection).use((0, import_js.keypairIdentity)(collectionAuthorityKey));
var endUser = Web3.Keypair.fromSecretKey(Uint8Array.from(
  [218, 9, 254, 249, 11, 50, 214, 60, 208, 41, 81, 90, 186, 25, 160, 86, 152, 205, 33, 105, 168, 58, 240, 194, 154, 65, 24, 255, 11, 18, 97, 173, 165, 247, 128, 240, 20, 123, 248, 29, 147, 22, 248, 161, 164, 38, 240, 158, 120, 101, 74, 246, 228, 24, 170, 208, 224, 46, 102, 189, 220, 34, 82, 233]
));
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
    try {
      const collectionVerificationForNFT = yield metaplex.nfts().verifyCollection({
        mintAddress: new Web3.PublicKey(nft_mint_address),
        collectionMintAddress: collectNFT.mintAddress,
        collectionAuthority: collectionAuthorityKey
      });
    } catch (e) {
      res.status(501).send("Error during process");
    }
    res.send('NFT "' + nft_mint_address.toString() + '": verified');
  } else {
    res.status(404).send("Call /create_nft before getting /verify_collection");
  }
}));
app.get("/create_nft", (req, res) => __async(exports, null, function* () {
  const TOKEN_METADATA_PROGRAM_ID = new Web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );
  const lamports = yield connection.getMinimumBalanceForRentExemption(
    import_spl_token.MINT_SIZE
  );
  const getMetadata = (mint) => __async(exports, null, function* () {
    return (yield Web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer()
      ],
      TOKEN_METADATA_PROGRAM_ID
    ))[0];
  });
  const getUseAuthority = (mint, verifier) => __async(exports, null, function* () {
    return (yield Web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("user"),
        verifier.toBuffer()
      ],
      TOKEN_METADATA_PROGRAM_ID
    ))[0];
  });
  const getBurner = () => __async(exports, null, function* () {
    return (yield Web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        Buffer.from("burn")
      ],
      TOKEN_METADATA_PROGRAM_ID
    ))[0];
  });
  const getMasterEdition = (mint) => __async(exports, null, function* () {
    return (yield Web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition")
      ],
      TOKEN_METADATA_PROGRAM_ID
    ))[0];
  });
  if (collectNFT != void 0) {
    try {
      const mintKey = Web3.Keypair.generate();
      const NftTokenAccount = yield (0, import_spl_token.getAssociatedTokenAddress)(
        mintKey.publicKey,
        endUser.publicKey
      );
      console.log("NFT Account: ", NftTokenAccount.toBase58());
      const mint_tx = new Web3.Transaction().add(
        Web3.SystemProgram.createAccount({
          fromPubkey: endUser.publicKey,
          newAccountPubkey: mintKey.publicKey,
          space: import_spl_token.MINT_SIZE,
          programId: import_spl_token.TOKEN_PROGRAM_ID,
          lamports
        }),
        (0, import_spl_token.createInitializeMintInstruction)(
          mintKey.publicKey,
          0,
          endUser.publicKey,
          endUser.publicKey
        ),
        (0, import_spl_token.createAssociatedTokenAccountInstruction)(
          endUser.publicKey,
          NftTokenAccount,
          endUser.publicKey,
          mintKey.publicKey
        )
      );
      const tx_result = yield connection.sendTransaction(mint_tx, [endUser, mintKey]);
      console.log("Confirm transaction: ", yield connection.confirmTransaction(tx_result));
      console.log(
        yield connection.getParsedAccountInfo(mintKey.publicKey)
      );
      console.log(
        yield connection.getParsedAccountInfo(NftTokenAccount)
      );
      console.log("NFT Account: ", tx_result);
      const metadataAddress = yield getMetadata(mintKey.publicKey);
      const masterEdition = yield getMasterEdition(mintKey.publicKey);
      const authorityRecord = yield getUseAuthority(mintKey.publicKey, verifierPubKey);
      const burnerAddress = yield getBurner();
      let program = new import_anchor.Program(IDL, ticketcoinSolanaProgram, new import_anchor.AnchorProvider(connection, new import_anchor.Wallet(endUser), {}));
      const tx = yield program.methods.mintNft(
        mintKey.publicKey,
        "https://github.com/zigtur",
        "Zigtur Collection"
      ).accounts(
        {
          mintAuthority: endUser.publicKey,
          collection: collectNftPubKey,
          mint: mintKey.publicKey,
          tokenAccount: NftTokenAccount,
          tokenProgram: import_spl_token.TOKEN_PROGRAM_ID,
          metadata: metadataAddress,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          payer: endUser.publicKey,
          systemProgram: Web3.SystemProgram.programId,
          rent: Web3.SYSVAR_RENT_PUBKEY,
          masterEdition,
          useAuthorityRecord: authorityRecord,
          verifier: verifierPubKey,
          burner: burnerAddress
        }
      ).rpc();
      res.send("Mint Key: " + mintKey.publicKey.toString());
    } catch (e) {
      res.status(501).send("Error during process");
    }
  } else {
    res.status(404).send("Call /create_event before calling /create_nft");
  }
}));
app.get("/verify_nft/:nft_mint_address", (req, res) => __async(exports, null, function* () {
  if (collectNFT != void 0) {
  } else {
    res.status(404).send("Call /create_nft before getting /verify_collection");
  }
}));
app.all("*", (req, res) => {
  res.status(404).send("Not found");
});
app.listen(8e3, () => console.log("Server running on port 8000"));
