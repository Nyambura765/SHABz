// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CreatorToken.sol"; 

contract CreatorTokenManager is Ownable {
    struct Tier {
        string name;       // Name of the tier (e.g., Bronze, Silver, Gold)
        uint256 supply;    // Maximum supply for the tier
        uint256 minted;    // Number of tokens minted for the tier
        uint256 price;     // Price per token in the tier (in wei)
    }

    // Mapping from creator address to token contract
    mapping(address => address) public creatorTokens;
    // Mapping from token contract to tier metadata
    mapping(address => mapping(uint256 => Tier)) public tokenTiers;

    // Event for token contract creation
    event TokenCreated(address indexed creator, address tokenAddress);
    // Event for tier added
    event TierAdded(address indexed token, uint256 tierId, string name, uint256 supply, uint256 price);
    // Event for minting tokens
    event TokensMinted(address indexed token, address indexed recipient, uint256 tierId, uint256 amount);
    // Event for burning tokens
    event TokensBurned(address indexed token, address indexed from, uint256 amount);

    // Constructor explicitly calls the Ownable constructor with msg.sender
    constructor() Ownable(msg.sender) {}

    /**
     * @dev Creates a new token for a creator
     * @param name Token name
     * @param symbol Token symbol
     */
    function createToken(string memory name, string memory symbol) external {
        require(creatorTokens[msg.sender] == address(0), "Token already created");
        
        // Create new token with creator as the owner
        CreatorToken newToken = new CreatorToken(name, symbol, address(this));
        address tokenAddress = address(newToken);
        
        creatorTokens[msg.sender] = tokenAddress;
        emit TokenCreated(msg.sender, tokenAddress);
    }
     // Function to get the token of the message sender
    function getMyToken() external view returns (address) {
        return creatorTokens[msg.sender];
    }
    /**
     * @dev Adds a new tier for a token
     * @param token Token address
     * @param tierId Tier identifier
     * @param name Tier name
     * @param supply Maximum supply for this tier
     * @param price Price per token in wei
     */
    function addTier(address token, uint256 tierId, string memory name, uint256 supply, uint256 price) external {
        require(creatorTokens[msg.sender] == token, "Not your token");
        require(tokenTiers[token][tierId].supply == 0, "Tier already exists");
        require(supply > 0, "Supply must be greater than zero");
        require(price > 0, "Price must be greater than zero");
        
        tokenTiers[token][tierId] = Tier({
            name: name,
            supply: supply,
            minted: 0,
            price: price
        });
        
        emit TierAdded(token, tierId, name, supply, price);
    }

    /**
     * @dev Mints tokens for a specific tier
     * @param token Token address
     * @param tierId Tier identifier
     * @param amount Amount to mint
     * @param recipient Recipient of the tokens
     */
    function mintTokens(address token, uint256 tierId, uint256 amount, address recipient) external {
        require(creatorTokens[msg.sender] == token, "Not your token");
        require(recipient != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than zero");
        
        Tier storage tier = tokenTiers[token][tierId];
        require(tier.supply > 0, "Tier does not exist");
        require(tier.minted + amount <= tier.supply, "Exceeds tier supply");
        
        tier.minted += amount;
        CreatorToken(token).mint(recipient, amount);
        
        emit TokensMinted(token, recipient, tierId, amount);
    }

    /**
     * @dev Burns tokens from a specified address (requires approval)
     * @param token Token address
     * @param from Address to burn tokens from
     * @param amount Amount to burn
     */
    function burnTokens(address token, address from, uint256 amount) external {
        require(creatorTokens[msg.sender] == token, "Not your token");
        require(from != address(0), "Cannot burn from zero address");
        require(amount > 0, "Amount must be greater than zero");
        
        // Use burnFrom which requires approval
        CreatorToken(token).burnFrom(from, amount);
        
        emit TokensBurned(token, from, amount);
    }

    /**
     * @dev Returns token address for a creator
     * @param creatorAddress Creator address
     * @return Token address
     */
    function getTokenAddress(address creatorAddress) public view returns (address) {
        return creatorTokens[creatorAddress];
    }

/**
     * @dev Returns tier details
     * @param token Token address
     * @param tierId Tier identifier
     * @return name The name of the tier
     * @return supply The maximum supply for the tier
     * @return minted The number of tokens already minted
     * @return price The price per token in wei
     */
    function getTierDetails(address token, uint256 tierId) public view returns (
        string memory name,
        uint256 supply,
        uint256 minted,
        uint256 price
    ) {
        Tier storage tier = tokenTiers[token][tierId];
        require(tier.supply > 0, "Tier does not exist");
        
        return (
            tier.name,
            tier.supply,
            tier.minted,
            tier.price
        );
    }
}