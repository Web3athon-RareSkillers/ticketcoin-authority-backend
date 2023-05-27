# ticketcoin-authority-backend

This repository is the Ticketcoin Authority Backend.

This is a REST API server that allows users to:
- get the NFT collection wallet addresses for the Ticketcoin events
    - So, they can mint their NFT with the right NFT collection
- get the NFT verifier wallet address
    - So, they can set the NFT verifier as Use Authority for their NFT
- request to get their minted NFT being verified as part of the NFT collection (collection verified = `true`)