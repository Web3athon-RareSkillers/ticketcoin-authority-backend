import * as Web3 from '@solana/web3.js'
import cors from 'cors'
import express from 'express'
//import { Metadata, createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
import { keypairIdentity, Metaplex, SendAndConfirmTransactionResponse } from '@metaplex-foundation/js';
import Semaphore from 'semaphore-async-await';
import { TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createInitializeMintInstruction, MINT_SIZE, mintTo, mintToInstructionData, createMint } from '@solana/spl-token';
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { TicketcoinContract, IDL } from "./ticketcoin_contract";


/// IMPORTANT DATA

    // private Key of the collection authority
const collectionAuthorityKey: Web3.Keypair = Web3.Keypair.fromSecretKey(
    Uint8Array.from([100,218,28,88,90,31,202,200,105,72,96,24,31,246,50,57,151,60,149,141,43,223,167,143,28,2,94,104,234,179,102,114,145,1,117,91,193,118,183,70,160,142,139,28,243,129,103,12,62,181,184,220,153,179,13,231,90,58,192,49,154,207,241,139])
    );
const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'), 'finalized')
let collectNFT: { name?: any; nft: any; response?: SendAndConfirmTransactionResponse; mintAddress?: Web3.PublicKey; metadataAddress?: Web3.PublicKey; masterEditionAddress?: Web3.PublicKey; tokenAddress?: Web3.PublicKey; };
let collectNftPubKey: Web3.PublicKey;
const collectNFTlock = new Semaphore(1);


const verifierPubKey = new Web3.PublicKey("Bn3Jyfx6hBYGHhgKWBK16ar65F2Rdir4pENPBxTXfNDr");
const ticketcoinSolanaProgram = new Web3.PublicKey("7CfS9hfXmqejz69Dx7kPhKxyNUwt1F8gmRTvAp1KyD3f")

const metaplex = new Metaplex(connection).use(keypairIdentity(collectionAuthorityKey));

// END USER KEY, NEEDS TO BE REPLACED BY PHANTOM WALLET
const endUser: Web3.Keypair = Web3.Keypair.fromSecretKey(Uint8Array.from(
    [218,9,254,249,11,50,214,60,208,41,81,90,186,25,160,86,152,205,33,105,168,58,240,194,154,65,24,255,11,18,97,173,165,247,128,240,20,123,248,29,147,22,248,161,164,38,240,158,120,101,74,246,228,24,170,208,224,46,102,189,220,34,82,233]
));


const app = express()

/**
 * JSON only
 *
 * @example app.post('/', (req) => req.body.prop)
 */
app.use(express.json())


app.use(cors())


//app.get('/', (req, res) => res.send('🏠'))
app.get('/infos', (req, res) => {
    if (collectNFT != undefined) {
        res.send('{nft_collections_authority: "' + collectionAuthorityKey.publicKey + '", concerts:[{1, name: "' + collectNFT.nft.name + '", address: "' + collectNftPubKey.toString() + '"}], verifier: "'+ verifierPubKey.toString() +'", "smart contract": "' + ticketcoinSolanaProgram.toString() +'"}');
    }
    else {
        res.status(404).send("Call /create_event before getting /infos");
    }
    
});

app.get('/create_event', async(req,res) => {
    await collectNFTlock.acquire()
    try{
        if (collectNFT == undefined) {
            console.log("Creating NFT Collection");
            
            // A metaplex NFT does the job for the NFT collection
            collectNFT = await metaplex.nfts().create({
            name: "Ed Sheeran - Exclusive Concert",
            sellerFeeBasisPoints: 0,
            uri: "https://github.com/zigtur", //maybe changing it to an Ed Sheeran image will be good
            isMutable: false,
            isCollection: true,
            },{ commitment: "finalized" });

            //console.log("Metaplex logs", collectNFT);

            console.log("Collection NFT address: ", collectNFT.nft.address);
            collectNftPubKey = collectNFT.nft.address;

        }
    } finally {
        await collectNFTlock.release();
        res.send('{nft_collections_authority: "' + collectionAuthorityKey.publicKey + '", concerts:[{1, name: "' + collectNFT.nft.name + '", address: "' + collectNftPubKey.toString() + '"}], verifier: "'+ verifierPubKey.toString() +'", "smart contract": "' + ticketcoinSolanaProgram.toString() +'"}');
    }
    
});

app.get('/verify_collection/:nft_mint_address', async(req,res) => {
    if (collectNFT != undefined) {
        const nft_mint_address = req.params.nft_mint_address;
        const collectionVerificationForNFT = await metaplex.nfts().verifyCollection({
            mintAddress: new Web3.PublicKey(nft_mint_address),
            collectionMintAddress: collectNFT.mintAddress,
            collectionAuthority: collectionAuthorityKey,
      });
      //console.log("Collection of NFT: ", (await Metadata.fromAccountAddress(provider.connection, metadataAddress)).collection);
      res.send('NFT "'+ nft_mint_address.toString() + '": verified');
    }
    else {
        res.status(404).send("Call /create_event before getting /verify_collection");
    }
});

//// FOR TEST PURPOSES ONLY
//// THIS WILL BE DONE IN USER APP
//// REPLACE EndUser WALLET WITH REAL USER WALLET (Phantom)
app.get('/create_nft', async(req, res) => {
    const TOKEN_METADATA_PROGRAM_ID = new Web3.PublicKey(
        "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
      );
    const lamports: number =
      await connection.getMinimumBalanceForRentExemption(
        MINT_SIZE
      );
      const getMetadata = async (
        mint: Web3.PublicKey
      ): Promise<Web3.PublicKey> => {
        return (
          await Web3.PublicKey.findProgramAddress(
            [
              Buffer.from("metadata"),
              TOKEN_METADATA_PROGRAM_ID.toBuffer(),
              mint.toBuffer(),
            ],
            TOKEN_METADATA_PROGRAM_ID
          )
        )[0];
      };
  
      const getUseAuthority = async (
        mint: Web3.PublicKey,
        verifier: Web3.PublicKey
      ): Promise<Web3.PublicKey> => {
        return (
          await Web3.PublicKey.findProgramAddress(
            [
              Buffer.from("metadata"),
              TOKEN_METADATA_PROGRAM_ID.toBuffer(),
              mint.toBuffer(),
              Buffer.from("user"),
              verifier.toBuffer()
            ],
            TOKEN_METADATA_PROGRAM_ID
          )
        )[0];
      };
  
      const getBurner = async (
      ): Promise<Web3.PublicKey> => {
        return (
          await Web3.PublicKey.findProgramAddress(
            [
              Buffer.from("metadata"),
              TOKEN_METADATA_PROGRAM_ID.toBuffer(),
              Buffer.from("burn")
            ],
            TOKEN_METADATA_PROGRAM_ID
          )
        )[0];
      };
  
      const getMasterEdition = async (
        mint: Web3.PublicKey
      ): Promise<Web3.PublicKey> => {
        return (
          await Web3.PublicKey.findProgramAddress(
            [
              Buffer.from("metadata"),
              TOKEN_METADATA_PROGRAM_ID.toBuffer(),
              mint.toBuffer(),
              Buffer.from("edition"),
            ],
            TOKEN_METADATA_PROGRAM_ID
          )
        )[0];
      };
    

      /// REAL CODE STARTING NOW
    
    const mintKey: Web3.Keypair = Web3.Keypair.generate();
    const NftTokenAccount = await getAssociatedTokenAddress(
      mintKey.publicKey,
      endUser.publicKey
    );
    console.log("NFT Account: ", NftTokenAccount.toBase58());

    const mint_tx = new Web3.Transaction().add(
      Web3.SystemProgram.createAccount({
        fromPubkey: endUser.publicKey,
        newAccountPubkey: mintKey.publicKey,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
        lamports,
      }),
      createInitializeMintInstruction(
        mintKey.publicKey,
        0,
        endUser.publicKey,
        endUser.publicKey
      ),
      createAssociatedTokenAccountInstruction(
        endUser.publicKey,
        NftTokenAccount,
        endUser.publicKey,
        mintKey.publicKey
      )
    );

    /*
    async function createAndSendV0Tx(txInstructions: Web3.TransactionInstruction[]) {
        let latestBlockhash = await connection.getLatestBlockhash('confirmed');
        const messageV0 = new Web3.TransactionMessage({
            payerKey: endUser.publicKey,
            recentBlockhash: latestBlockhash.blockhash,
            instructions: txInstructions
        }).compileToV0Message();
        
        const transaction = new Web3.VersionedTransaction(messageV0);
        transaction.sign([mintKey]);
        const txid = await connection.sendTransaction(transaction, { maxRetries: 5 });
        const confirmation = await connection.confirmTransaction({
            signature: txid,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
        })
        return confirmation;
    }*/

    const tx_result = await connection.sendTransaction(mint_tx, [endUser, mintKey]);
    console.log("Confirm transaction: ", await connection.confirmTransaction(tx_result));
    console.log(
      await connection.getParsedAccountInfo(mintKey.publicKey)
    );

    console.log(
        await connection.getParsedAccountInfo(NftTokenAccount)
      );

    

    console.log("NFT Account: ", tx_result);
    //console.log("Mint key: ", mintKey.publicKey.toString());
    //console.log("User: ", wallet.publicKey.toString());

    const metadataAddress = await getMetadata(mintKey.publicKey);
    const masterEdition = await getMasterEdition(mintKey.publicKey);
    const authorityRecord = await getUseAuthority(mintKey.publicKey, verifierPubKey);
    const burnerAddress = await getBurner();

    //console.log("Metadata address: ", metadataAddress.toBase58());
    //console.log("MasterEdition: ", masterEdition.toBase58());
    //console.log("AuthorityRecord: ", authorityRecord.toBase58());
    //console.log("burner: ", burnerAddress.toBase58());

    
    
    let program = new Program(IDL, ticketcoinSolanaProgram, new AnchorProvider(connection, new Wallet(endUser), {})); // TicketcoinContract as Program<TicketcoinContract>;

    const tx = await program.methods.mintNft(
      mintKey.publicKey,
      "https://github.com/zigtur",
      "Zigtur Collection",
    )
      .accounts({
        mintAuthority: endUser.publicKey,
        collection: collectNftPubKey,
        mint: mintKey.publicKey,
        tokenAccount: NftTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        metadata: metadataAddress,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        payer: endUser.publicKey,
        systemProgram: Web3.SystemProgram.programId,
        rent: Web3.SYSVAR_RENT_PUBKEY,
        masterEdition: masterEdition,
        useAuthorityRecord: authorityRecord,
        verifier: verifierPubKey,
        burner: burnerAddress,
      },
      )
      .rpc();
    res.send("Mint Key: "+ mintKey.publicKey.toString());
    
});


/**
 * Pour toutes les autres routes non définies, on retourne une erreur
 */
app.all('*', (req, res) => { res.status(404).send("Not found")})


/**
 * On demande à Express d'ecouter les requêtes sur le port défini dans la config
 */
app.listen(8000, () => console.log('Server running on port 8000'))