// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PaymentEscrow is Ownable (address(this)) {
    struct Purchase {
        address buyer;
        address creator;
        uint256 amount;
        bool buyerApproval;
        bool creatorApproval;
        uint256 deadline;
        bool refunded;
    }

    mapping(uint256 => Purchase) public purchases;
    mapping(address => uint256) public creatorBalances;
    mapping(address => uint256) public buyerRewards;
    mapping(address => uint256) public ratings;
    mapping(address => uint256) public totalRatings;
    uint256 public purchaseCounter;
    address public stablecoin;
    uint256 public escrowTimeLimit = 3 days;
    uint256 public platformFeePercentage = 5; // Platform fee (5%)
    address public platformWallet;

    event PaymentReceived(uint256 purchaseId, address indexed buyer, address indexed creator, uint256 amount, string method);
    event FiatPaymentVerified(uint256 purchaseId, address indexed buyer, uint256 amount, string paymentReference);
    event ContentApproved(uint256 purchaseId, address indexed approver);
    event RefundIssued(uint256 purchaseId, address indexed buyer);
    event CreatorWithdraw(address indexed creator, uint256 amount);
    event BuyerRated(address indexed creator, uint8 rating);
    
    constructor(address _stablecoin, address _platformWallet) {
        stablecoin = _stablecoin;
        platformWallet = _platformWallet;
    }

    function payWithETH(address creator) external payable {
        require(msg.value > 0, "Payment must be greater than 0");
        uint256 fee = (msg.value * platformFeePercentage) / 100;
        uint256 creatorAmount = msg.value - fee;
        
        purchaseCounter++;
        purchases[purchaseCounter] = Purchase(msg.sender, creator, creatorAmount, false, false, block.timestamp + escrowTimeLimit, false);
        payable(platformWallet).transfer(fee);
        
        emit PaymentReceived(purchaseCounter, msg.sender, creator, msg.value, "ETH");
    }

    function payWithStablecoin(address creator, uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        uint256 fee = (amount * platformFeePercentage) / 100;
        uint256 creatorAmount = amount - fee;
        
        require(IERC20(stablecoin).transferFrom(msg.sender, platformWallet, fee), "Fee transfer failed");
        require(IERC20(stablecoin).transferFrom(msg.sender, address(this), creatorAmount), "Stablecoin transfer failed");
        
        purchaseCounter++;
        purchases[purchaseCounter] = Purchase(msg.sender, creator, creatorAmount, false, false, block.timestamp + escrowTimeLimit, false);
        
        emit PaymentReceived(purchaseCounter, msg.sender, creator, amount, "Stablecoin");
    }
//Verification done offchain then the transaction details are stored on chain.
    function processMPesaPayment(address buyer, address creator, uint256 amount, string memory paymentReference) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        uint256 fee = (amount * platformFeePercentage) / 100;
        uint256 creatorAmount = amount - fee;
        
        payable(platformWallet).transfer(fee);
        
        purchaseCounter++;
        purchases[purchaseCounter] = Purchase(buyer, creator, creatorAmount, false, false, block.timestamp + escrowTimeLimit, false);
        
        emit FiatPaymentVerified(purchaseCounter, buyer, amount, paymentReference);
    }

    function approveContent(uint256 purchaseId) external {
        require(purchases[purchaseId].buyer == msg.sender, "Only buyer can approve");
        require(!purchases[purchaseId].buyerApproval, "Already approved");

        purchases[purchaseId].buyerApproval = true;
        emit ContentApproved(purchaseId, msg.sender);
        finalizeEscrow(purchaseId);
    }

    function confirmDelivery(uint256 purchaseId) external {
        require(purchases[purchaseId].creator == msg.sender, "Only creator can confirm");
        require(!purchases[purchaseId].creatorApproval, "Already approved");

        purchases[purchaseId].creatorApproval = true;
        emit ContentApproved(purchaseId, msg.sender);
        finalizeEscrow(purchaseId);
    }

    function finalizeEscrow(uint256 purchaseId) internal {
        if (purchases[purchaseId].buyerApproval && purchases[purchaseId].creatorApproval) {
            creatorBalances[purchases[purchaseId].creator] += purchases[purchaseId].amount;
        }
    }

    function requestRefund(uint256 purchaseId) external {
        require(purchases[purchaseId].buyer == msg.sender, "Only buyer can request refund");
        require(block.timestamp > purchases[purchaseId].deadline, "Escrow time not expired");
        require(!purchases[purchaseId].creatorApproval, "Creator has already approved");
        require(!purchases[purchaseId].refunded, "Already refunded");

        purchases[purchaseId].refunded = true;
        payable(msg.sender).transfer(purchases[purchaseId].amount);
        emit RefundIssued(purchaseId, msg.sender);
    }

    function withdrawFunds() external {
        uint256 balance = creatorBalances[msg.sender];
        require(balance > 0, "No funds available");
        creatorBalances[msg.sender] = 0;
        payable(msg.sender).transfer(balance);
        emit CreatorWithdraw(msg.sender, balance);
    }

    function rateCreator(address creator, uint8 rating) external {
        require(rating > 0 && rating <= 5, "Rating must be between 1 and 5");
        require(creator != msg.sender, "You cannot rate yourself");
        ratings[creator] += rating;
        totalRatings[creator]++;
        emit BuyerRated(creator, rating);
    }

    function getBuyerRewards(address buyer) external view returns (uint256) {
        return buyerRewards[buyer];
    }

    function getAverageRating(address creator) external view returns (uint256) {
        if (totalRatings[creator] == 0) {
            return 0;
        }
        return ratings[creator] / totalRatings[creator];
    }
}
