// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CreatorTokenManager.sol"; // Full Token contract 
import "./MarketPlace.sol"; // Full NFT marketplace contract
import "./PaymentEscrow.sol"; // Full Payment escrow contract

contract SHABzPlatform is Ownable (msg.sender) {
    CreatorTokenManager public creatorTokenManagerInstance;
    NFTMarketplace public nftMarketplaceInstance;
    PaymentEscrow public paymentEscrowInstance;
    
    // Mapping to track user engagement points for gamification
    mapping(address => uint256) public userPoints;
    mapping(address => bool) public isCreator;
    
    // Collaboration structure to represent multi-creator projects
    struct Collaboration {
        address[] creators;
        uint256 startDate;
        uint256 endDate;
        bool isActive;
    }
    
    Collaboration[] public collaborations;
    
    event UserRegistered(address indexed user);
    event CreatorRegistered(address indexed creator);
    event CollaborationCreated(uint256 indexed collaborationId, address[] creators);
    event GamificationPointsAwarded(address indexed user, uint256 points);
    event AirdropDistributed(address indexed user, uint256 amount);
    
    constructor(
        address _tokenManagerAddress,
        address _nftMarketplaceAddress,
        address _paymentEscrowAddress
    ) {
        creatorTokenManagerInstance = CreatorTokenManager(_tokenManagerAddress);
        nftMarketplaceInstance = NFTMarketplace(_nftMarketplaceAddress);
        paymentEscrowInstance = PaymentEscrow(_paymentEscrowAddress);
    }
    
    
    //  USER & CREATOR REGISTRATION
    
    function registerUser() external {
        emit UserRegistered(msg.sender);
    }
    
    function registerCreator() external {
        require(!isCreator[msg.sender], "Already registered as creator");
        isCreator[msg.sender] = true;
        emit CreatorRegistered(msg.sender);
    }
    
    modifier onlyCreator() {
        require(isCreator[msg.sender], "Not a creator");
        _;
    }
    
    
    //  CROSS-CREATOR COLLABORATIONS

    function createCollaboration(address[] memory _creators, uint256 _startDate, uint256 _endDate) external onlyCreator {
        require(_creators.length > 1, "At least two creators are required");
        collaborations.push(Collaboration({
            creators: _creators,
            startDate: _startDate,
            endDate: _endDate,
            isActive: true
        }));
        emit CollaborationCreated(collaborations.length - 1, _creators);
    }
    
    function getCollaboration(uint256 index) external view returns (address[] memory, uint256, uint256, bool) {
        Collaboration memory collab = collaborations[index];
        return (collab.creators, collab.startDate, collab.endDate, collab.isActive);
    }
    
    
    //  GAMIFICATION LOGIC
    
    function awardGamificationPoints(address user, uint256 points) external onlyOwner {
        userPoints[user] += points;
        emit GamificationPointsAwarded(user, points);
    }
    
    function getUserPoints(address user) external view returns (uint256) {
        return userPoints[user];
    }
    
    
    //  AIRDROP MECHANISM
    
    function distributeAirdrop(address user, uint256 amount) external onlyOwner {
        address tokenAddress = creatorTokenManagerInstance.getTokenAddress(user);
        require(tokenAddress != address(0), "Token not found for user");
        require(IERC20(tokenAddress).transfer(user, amount), "Airdrop transfer failed");
        emit AirdropDistributed(user, amount);
    }
}

