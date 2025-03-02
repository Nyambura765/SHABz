
# Shabz Platform Documentation

![Image](https://github.com/user-attachments/assets/9e926a63-832f-46bd-ab24-0d020376cc86)

## Overview
SHABz is a Social Token Platform designed to revolutionize fan-creator engagement. By leveraging blockchain technology, the platform allows creators to mint tier-based tokens, disguised as "gifts," that unlock premium content, personalized experiences, and other exclusive benefits. Fans can purchase these tokens through M-Pesa, cryptocurrency, or stablecoins, unlocking unique opportunities to interact with their favorite creators. The platform also features an NFT marketplace, gamification, staking, a fan escrow system, and cross-creator collaborations, ensuring a dynamic and rewarding ecosystem for both fans and creators.

## Features
- Token Minting and Management: Creators can mint tiered tokens converted into "gifts" with varying levels of exclusivity.
- Accumulate individual tokens exchangeable for event tickets
- Mint and bid on creator NFTs in the marketplace
- Participate in interactive engagement activities for token rewards
- Access exclusive creator content and merchandise
- Trade tokens and NFTs peer-to-peer
- Multiple payment options including M-Pesa, ETH, and stablecoins
- Secure escrow system for all transactions

## Future Implentations
- Platform to host content by creators
- AI for content recommendation
- Enhanced gaming features for better engagement between creators and fans
- Backend Implementation
- Database for profile management


## Technical Stack
- Frontend: React+Typescript
- UI Components:Redux-UI, Tailwind CSS
- Web3 Integration: Wagmi,Viem,Rainbowtoolkit
- Wallet Connect: RainbowToolkit
- Blockchain: Ethereum  (ERC-20, ERC-721)
- Payment Processing: M-Pesa API, Web3 payment handlers
- Contracts deployed on Lisk Sepolia

## Development and Testing

### Prerequisites
- Node.js v14+ and npm
- Ethereum Wallet (e.g., MetaMask)
- Testnet access (e.g., Sepolia)

### Setup

1. Clone this repository
```bash
git clone https://github.com/Nyambura765/SHABz
cd shabz-hub
```

2. Install dependencies:
```bash
npm install
```

3. Run:
```bash
npm run dev
```

## Environment Variables
Create a `.env` file with:
```

ETH_RPC_URL=your_ethereum_rpc_url
LISK_RPC_URL = your_lisk_rpc_url

```

## Usage Guide

### Purchasing Token Packages
1. Connect wallet.
2. Navigate to a Marketplace page.
3. Navigate to the Token page
4. Select your desired package (Gold, Silver, Bronze).
5. Choose payment method (M-Pesa, ETH, stablecoins).
6. Confirm the transaction.
7. Tokens are added to your wallet.

![Image](https://github.com/user-attachments/assets/d84ccd50-f987-4f48-acc2-a39cbcda002b)

### Exploring the NFT Marketplace
1. Navigate to the  Marketplace tab.
2. Browse available NFTs by creator, category, or price.
3. Click on an NFT to view details and bid history.
4. Place a bid by entering your amount and clicking "Place Bid".
5. If you're the highest bidder when the auction ends, the NFT transfers to your wallet.
6. View your NFT collection in the "My Collection" section.

![Image](https://github.com/user-attachments/assets/cb1665be-9563-40dc-a44d-ba744271634a)

### Redeeming Benefits with QR Codes
1. Navigate to "Rewards" in the For fans page.
2. Select the benefit you wish to redeem.
3. Click "Generate QR Code".
4. The system creates a one-time use QR code.
5. Present the QR code at events or scan for digital content access.
6. The QR becomes invalid after single use.




### Trading Tokens and NFTs Peer-to-Peer
1. Navigate to "Marketplace" > "P2P Trading" tab.
2. Click "Create New Listing" for tokens or NFTs you own.
3. Set your asking price and listing duration.
4. Confirm the listing.
5. When a buyer purchases your listing, assets transfer through escrow.
6. Platform fee is automatically deducted.
7. Proceeds are sent to your wallet.



### Exchanging Tokens for Event Tickets
1. Navigate to "Events" tab.
2. Select an event that accepts token exchange.
3. Click "Exchange Tokens for Ticket".
4. Confirm the exchange.
5. A digital ticket is generated in your "My Tickets" section.
6. Generate a QR code for the ticket when attending the event.



## Smart Contract Architecture

### Token Contract
The ShabzToken contract manages the creation, distribution and redemption of creator tokens:
- ERC-20 implementation with tiered tracking
- Token minting functions for creators
- Transfer restrictions based on rules
- Redemption mechanisms for benefits

### NFT Contract
The ShabzNFT contract handles the minting and trading of creator NFTs:
- ERC-721 implementation for unique digital assets
- Creator royalty distribution for secondary sales
- Metadata storage on IPFS
- Bidding functionality integration

### Marketplace Contract
The ShabzMarketplace contract facilitates all trading activities:
- Escrow mechanism for secure transactions
- Fee collection and distribution
- Auction system for NFT sales
- P2P trading facilitation

### Escrow Contract
The ShabzEscrow contract secures all financial transactions:
- Temporary fund holding
- Conditional release mechanisms
- Dispute resolution support
- Multi-signature verification for high-value transactions

## Security Features
- Escrow system for all marketplace transactions
- Smart contract auditing and security testing
- Transparent transaction history and audit trails
- Platform fee collection through secure contract methods

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Submit pull request

## License
MIT License

## Appendices
1. Smart Contract Repository: [Link](https://github.com/Nyambura765/SHABz)
2. Testnet Deployment: [Link](https://sepolia-blockscout.lisk.com/address/0x296EA797C9A5935c4447e638a7a7ce04c1039259)
3. Live Demo: [Link](https://shabz-hub-page.vercel.app/)
```

 