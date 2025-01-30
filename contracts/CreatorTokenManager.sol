// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CreatorToken.sol"; // Import the CreatorToken contract

contract CreatorTokenManager is Ownable (msg.sender) {
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
    event TokensBurned(address indexed token, address indexed creator, uint256 amount);

    function createToken(string memory name, string memory symbol) external {
        require(creatorTokens[msg.sender] == address(0), "Token already created");
        address newToken = address(new CreatorToken(name, symbol, msg.sender));
        creatorTokens[msg.sender] = newToken;
        emit TokenCreated(msg.sender, newToken);
    }

    function addTier(address token, uint256 tierId, string memory name, uint256 supply, uint256 price) external {
        require(creatorTokens[msg.sender] == token, "Not your token");
        require(tokenTiers[token][tierId].supply == 0, "Tier already exists");
        tokenTiers[token][tierId] = Tier({
            name: name,
            supply: supply,
            minted: 0,
            price: price
        });
        emit TierAdded(token, tierId, name, supply, price);
    }

    function mintTokens(address token, uint256 tierId, uint256 amount, address recipient) external payable {
        require(creatorTokens[msg.sender] == token, "Not your token");
        Tier storage tier = tokenTiers[token][tierId];
        require(tier.supply > 0, "Tier does not exist");
        require(tier.minted + amount <= tier.supply, "Exceeds tier supply");
        require(msg.value >= tier.price * amount, "Insufficient payment");
        tier.minted += amount;
        CreatorToken(token).mint(recipient, amount);
        emit TokensMinted(token, recipient, tierId, amount);
    }

    function burnTokens(address token, uint256 amount) external {
        require(creatorTokens[msg.sender] == token, "Not your token");
        CreatorToken(token).burn(msg.sender, amount);
        emit TokensBurned(token, msg.sender, amount);
    }

    // Function to get the token address for a creator
    function getTokenAddress(address creatorAddress) public view returns (address) {
        return creatorTokens[creatorAddress];
    }
}