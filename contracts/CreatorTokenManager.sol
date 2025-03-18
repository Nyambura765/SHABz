// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CreatorToken is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) Ownable(msg.sender) {}
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function burnFrom(address account, uint256 amount) external onlyOwner {
        uint256 currentAllowance = allowance(account, address(this));
        require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
        
        _approve(account, address(this), currentAllowance - amount);
        _burn(account, amount);
    }
}

contract CreatorTokenManager is Ownable {
    struct Tier {
        string name;       // Name of the tier (e.g., Bronze, Silver, Gold)
        uint256 supply;    // Maximum supply for the tier
        uint256 minted;    // Number of tokens minted for the tier
        uint256 price;     // Price per token in the tier (in wei)
        bool isActive;     // Whether the tier is active for purchase
    }

    struct TokenDetails {
        string name;
        string symbol;
        address token;
    }

    struct MyStats {
        address token;
        string name;
        string symbol;
        uint256 totalSales; 
        uint256 totalTokens;
        uint256 totalHolders;
    }

    // Mapping from creator address to token contract
    mapping(address => address) public creatorTokens;
    // Mapping from token contract to tier metadata
    mapping(address => mapping(uint256 => Tier)) public tokenTiers;
    // Mapping to track creator balances from sales
    mapping(address => uint256) public creatorBalances;
    //get creator
    mapping(address => address) public getTokenCreator;
    //token details
    mapping(string => TokenDetails[]) public PlatformTokens;
    //tokens owned by user
    mapping(address => address[]) public TokensOwned;
    //my stats
    mapping(address => MyStats) public CreatorStats;

    // Platform fee percentage (in basis points, 100 = 1%)
    uint256 public platformFeePercent = 250; 
    address public platformWallet;

    // Events
    event TokenCreated(address indexed creator, address tokenAddress);
    event TierAdded(address indexed token, uint256 tierId, string name, uint256 supply, uint256 price);
    event TierStatusChanged(address indexed token, uint256 tierId, bool isActive);
    event TokensMinted(address indexed token, address indexed recipient, uint256 tierId, uint256 amount);
    event TokensBurned(address indexed token, address indexed from, uint256 amount);
    event TokensPurchased(address indexed token, address indexed buyer, uint256 tierId, uint256 amount, uint256 paid);
    event CreatorWithdrawal(address indexed creator, uint256 amount);
    event PlatformFeeUpdated(uint256 newFeePercent);

    // Constructor explicitly calls the Ownable constructor with msg.sender
    constructor() Ownable(msg.sender) {
        platformWallet = msg.sender;
    }

    /**
     * @dev Creates a new token for a creator
     * @param name Token name
     * @param symbol Token symbol
     */
    function createToken(string memory name, string memory symbol) external {
        require(creatorTokens[msg.sender] == address(0), "Token already created");
        
        // Create new token with CreatorTokenManager as the owner
        address tokenAddress = address(new CreatorToken(name, symbol));
        
        creatorTokens[msg.sender] = tokenAddress;
        getTokenCreator[tokenAddress] = msg.sender;

        //add to PlatformTokens
        PlatformTokens["token"].push(TokenDetails(name, symbol, tokenAddress));

        //create creator stats
        CreatorStats[msg.sender] = MyStats(tokenAddress, name, symbol, 0, 0, 0);

        emit TokenCreated(msg.sender, tokenAddress);
    }

    /**
     * @dev Function to get the token of the message sender
     * @return Token address of the caller
     */
    function getMyToken() external view returns (address) {
        return creatorTokens[msg.sender];
    }

    function getPlatformTokens() public view returns (TokenDetails[] memory) {
        return PlatformTokens["token"];
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
            price: price,
            isActive: true // Active by default
        });
        
        emit TierAdded(token, tierId, name, supply, price);
    }

    /**
     * @dev Set tier active status
     * @param token Token address
     * @param tierId Tier identifier
     * @param isActive Active status
     */
    function setTierActive(address token, uint256 tierId, bool isActive) external {
        require(creatorTokens[msg.sender] == token, "Not your token");
        require(tokenTiers[token][tierId].supply > 0, "Tier does not exist");
        
        tokenTiers[token][tierId].isActive = isActive;
        
        emit TierStatusChanged(token, tierId, isActive);
    }

    /**
     * @dev Purchase tokens directly (for any user)
     * @param token Token address
     * @param tierId Tier identifier
     * @param amount Amount to purchase
     */
    function purchaseTokens(address token, uint256 tierId, uint256 amount) external payable {
        require(amount > 0, "Amount must be greater than zero");
        
        Tier storage tier = tokenTiers[token][tierId];
        require(tier.supply > 0, "Tier does not exist");
        require(tier.isActive, "Tier is not active for purchase");
        require(tier.minted + amount <= tier.supply, "Exceeds tier supply");
        
        uint256 totalCost = tier.price * amount;
        require(msg.value >= totalCost, "Insufficient payment");
        
        // Calculate platform fee
        uint256 platformFee = (totalCost * platformFeePercent) / 10000;
        uint256 creatorAmount = totalCost - platformFee;
        
        // Find the creator address from the token
        address creator = getTokenCreator[token];
        require(creator != address(0), "Creator not found");
        
        // Update balances
        creatorBalances[creator] += creatorAmount;
        
        // Mint tokens to the buyer
        tier.minted += amount;
        CreatorToken(token).mint(msg.sender, amount);

        //add token to ownership
        TokensOwned[msg.sender].push(token);  

        // Send platform fee to platform wallet
        (bool feeSuccess, ) = platformWallet.call{value: platformFee}("");
        require(feeSuccess, "Platform fee transfer failed");

        // Send creator fee to creator wallet
        (bool creatorFee, ) = creator.call{value: creatorAmount}("");
        require(creatorFee, "Creator fee transfer failed");

        //update creator stats
        CreatorStats[creator].totalTokens += amount;
        CreatorStats[creator].totalSales += creatorAmount; 
        CreatorStats[creator].totalHolders++;
        
        //add token to ownership
        TokensOwned[msg.sender].push(token);
        
        // Refund excess payment if any
        if (msg.value > totalCost) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - totalCost}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit TokensPurchased(token, msg.sender, tierId, amount, totalCost);
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

    //get user token balance
    function getUserTokenBalance(address token) public  view returns (uint256) {
        return CreatorToken(token).balanceOf(msg.sender);
    }

    //get  user owned tokens balance
    function getUserOwnedTokens() public view returns (address[] memory) {
        return TokensOwned[msg.sender];
    }

    //get creator stats
    function getCreatorStats() public view returns (MyStats memory stats) {
       return CreatorStats[msg.sender]; 
    }

    /**
     * @dev Withdraw creator earnings
     */
    function withdrawCreatorBalance() external {
        uint256 amount = creatorBalances[msg.sender];
        require(amount > 0, "No balance to withdraw");
        
        creatorBalances[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit CreatorWithdrawal(msg.sender, amount);
    }

    /**
     * @dev Update platform fee percentage (onlyOwner)
     * @param newFeePercent New fee percentage in basis points (100 = 1%)
     */
    function updatePlatformFee(uint256 newFeePercent) external onlyOwner {
        require(newFeePercent <= 1000, "Fee too high"); // Max 10%
        platformFeePercent = newFeePercent;
        emit PlatformFeeUpdated(newFeePercent);
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
     * @return isActive Whether the tier is active for purchase
     */
    function getTierDetails(address token, uint256 tierId) public view returns (
        string memory name,
        uint256 supply,
        uint256 minted,
        uint256 price,
        bool isActive
    ) {
        Tier storage tier = tokenTiers[token][tierId];
        require(tier.supply > 0, "Tier does not exist");
        
        return (
            tier.name,
            tier.supply,
            tier.minted,
            tier.price,
            tier.isActive
        );
    }
}