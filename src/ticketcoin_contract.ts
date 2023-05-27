export type TicketcoinContract = {
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
  
  export const IDL: TicketcoinContract = {
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
  