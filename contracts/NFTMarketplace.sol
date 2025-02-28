// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./NFT.sol";

interface IERC721Mintable is IERC721 {
    function mint(address to, string memory metadataURI) external returns (uint256);
}

contract NFTMarketplace is Ownable {
    using SafeERC20 for IERC20;
    IERC20 public token;
    IERC721Mintable public nftContract;
    
    uint256 public marketplaceFee = 2;
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

    constructor(address _nftContract, address _token, address _feeRecipient, address _owner) Ownable(_owner) {

        require(_nftContract != address(0) && _token != address(0) && _feeRecipient != address(0), "Invalid address");
        nftContract = IERC721Mintable(_nftContract);
        token = IERC20(_token);
        feeRecipient = _feeRecipient;
    
    }

    modifier onlyOwnerOf(uint256 tokenId) {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not NFT owner");
        _;
    }

    function mintAndListNFT(string memory metadataURI, uint256 price) external returns (uint256) {
        uint256 tokenId = nftContract.mint(msg.sender, metadataURI);
        listNFTForSale(tokenId, price);
        return tokenId;
    }

    function listNFTForSale(uint256 tokenId, uint256 price) public onlyOwnerOf(tokenId) {
        require(price > 0, "Price must be greater than 0");
        nftPrice[tokenId] = price;
        nftSeller[tokenId] = msg.sender;
        emit NFTListed(tokenId, price, msg.sender);
    }

    function buyNFT(uint256 tokenId) external payable {
        uint256 price = nftPrice[tokenId];
        address seller = nftSeller[tokenId];
        require(price > 0, "NFT not for sale");
        uint256 fee = (price * marketplaceFee) / 100;
        uint256 sellerAmount = price - fee;
        
        token.safeTransferFrom(msg.sender, feeRecipient, fee);
        
        token.safeTransferFrom(msg.sender, seller, sellerAmount);
        nftContract.transferFrom(seller, msg.sender, tokenId);
        
        delete nftPrice[tokenId];
        delete nftSeller[tokenId];
        emit NFTSold(tokenId, msg.sender, price);
    }

    function setMarketplaceFee(uint256 newFee) external onlyOwner {
        require(newFee <= 10, "Fee too high");
        marketplaceFee = newFee;
    }

    function setFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid address");
        feeRecipient = newRecipient;
    }
}
