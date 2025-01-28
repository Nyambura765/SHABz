// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interfaces for ERC-20 and ERC-721
interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address);
    function transferFrom(address from, address to, uint256 tokenId) external;
    function mint(address to, string memory metadataURI) external returns (uint256);
}

contract NFTMarketplace {

    IERC20 public token;  // Reference to the ERC-20 token
    IERC721 public nftContract;  // Reference to the ERC-721 NFT contract

    uint256 public marketplaceFee = 2;  // 2% marketplace fee
    address public feeRecipient;

    struct Auction {
        uint256 tokenId;
        uint256 highestBid;
        address highestBidder;
        uint256 endTime;
    }

    mapping(uint256 => uint256) public nftPrice;
    mapping(uint256 => address) public nftSeller;
    mapping(uint256 => Auction) public nftAuctions;
    mapping(uint256 => string) public nftUpgrades;

    event NFTListed(uint256 indexed tokenId, uint256 price, address seller);
    event NFTSold(uint256 indexed tokenId, address buyer, uint256 price);
    event NFTUpgraded(uint256 indexed tokenId, string newMetadata);
    event AuctionStarted(uint256 indexed tokenId, uint256 startingBid, uint256 endTime);
    event BidPlaced(uint256 indexed tokenId, address bidder, uint256 bidAmount);
    event AuctionEnded(uint256 indexed tokenId, address winner, uint256 finalBid);

    constructor(address _nftContract, address _token, address _feeRecipient) {
        nftContract = IERC721(_nftContract);
        token = IERC20(_token);
        feeRecipient = _feeRecipient;
    }

    modifier onlyOwner(uint256 tokenId) {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Only owner can perform this action");
        _;
    }

    modifier auctionEnded(uint256 tokenId) {
        require(block.timestamp >= nftAuctions[tokenId].endTime, "Auction not yet ended");
        _;
    }

    // Mint and list NFT for sale
    function mintAndListNFT(string memory metadataURI, uint256 price) public returns (uint256) {
        uint256 tokenId = nftContract.mint(msg.sender, metadataURI);
        listNFTForSale(tokenId, price);
        return tokenId;
    }

    // List NFT for sale at a specific price
    function listNFTForSale(uint256 tokenId, uint256 price) public onlyOwner(tokenId) {
        nftPrice[tokenId] = price;
        nftSeller[tokenId] = msg.sender;
        emit NFTListed(tokenId, price, msg.sender);
    }

    // Buy NFT using ERC-20 token
    function buyNFT(uint256 tokenId) public {
        uint256 price = nftPrice[tokenId];
        address seller = nftSeller[tokenId];
        require(price > 0, "NFT not for sale");

        uint256 fee = (price * marketplaceFee) / 100;
        uint256 sellerAmount = price - fee;

        // Transfer fee to marketplace and the rest to the seller
        token.transferFrom(msg.sender, feeRecipient, fee);
        token.transferFrom(msg.sender, seller, sellerAmount);

        // Transfer NFT ownership
        nftContract.transferFrom(seller, msg.sender, tokenId);

        // Reset sale data
        nftPrice[tokenId] = 0;
        nftSeller[tokenId] = address(0);

        emit NFTSold(tokenId, msg.sender, price);
    }

    // Start an auction for an NFT
    function startAuction(uint256 tokenId, uint256 startingBid, uint256 duration) public onlyOwner(tokenId) {
        require(nftPrice[tokenId] == 0, "NFT already listed for sale");
        nftAuctions[tokenId] = Auction({
            tokenId: tokenId,
            highestBid: startingBid,
            highestBidder: address(0),
            endTime: block.timestamp + duration
        });

        emit AuctionStarted(tokenId, startingBid, block.timestamp + duration);
    }

    // Place a bid on an auction
    function placeBid(uint256 tokenId) public payable {
        Auction storage auction = nftAuctions[tokenId];
        require(block.timestamp < auction.endTime, "Auction ended");
        require(msg.value > auction.highestBid, "Bid must be higher than the current bid");

        // Refund the previous highest bidder
        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }

        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;

        emit BidPlaced(tokenId, msg.sender, msg.value);
    }

    // End auction and transfer the NFT to the highest bidder
    function endAuction(uint256 tokenId) public auctionEnded(tokenId) {
        Auction storage auction = nftAuctions[tokenId];
        address winner = auction.highestBidder;
        uint256 finalBid = auction.highestBid;

        // Transfer NFT to the winner
        nftContract.transferFrom(nftSeller[tokenId], winner, tokenId);

        // Transfer funds to the seller
        payable(nftSeller[tokenId]).transfer(finalBid);

        // Reset auction data
        delete nftAuctions[tokenId];

        emit AuctionEnded(tokenId, winner, finalBid);
    }

    // Upgrade NFT metadata
    function upgradeNFT(uint256 tokenId, string memory newMetadata) public onlyOwner(tokenId) {
        nftUpgrades[tokenId] = newMetadata;
        emit NFTUpgraded(tokenId, newMetadata);
    }

    // Allow users to buy NFTs using tokens
    function buyNFTWithToken(uint256 tokenId, uint256 amount) public {
        uint256 price = nftPrice[tokenId];
        require(amount >= price, "Insufficient token balance");

        uint256 fee = (price * marketplaceFee) / 100;
        uint256 sellerAmount = price - fee;

        // Transfer fee to marketplace and the rest to the seller
        token.transferFrom(msg.sender, feeRecipient, fee);
        token.transferFrom(msg.sender, nftSeller[tokenId], sellerAmount);

        // Transfer NFT ownership
        nftContract.transferFrom(nftSeller[tokenId], msg.sender, tokenId);

        // Reset sale data
        nftPrice[tokenId] = 0;
        nftSeller[tokenId] = address(0);

        emit NFTSold(tokenId, msg.sender, price);
    }

    // Set marketplace fee (only owner can change)
    function setMarketplaceFee(uint256 newFee) external {
        require(msg.sender == feeRecipient, "Only fee recipient can change fee");
        marketplaceFee = newFee;
    }

    // Set new fee recipient (only owner can change)
    function setFeeRecipient(address newFeeRecipient) external {
        require(msg.sender == feeRecipient, "Only fee recipient can change");
        feeRecipient = newFeeRecipient;
    }
}
