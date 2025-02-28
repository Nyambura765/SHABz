// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PaymentEscrow is Ownable {
    struct Purchase {
        address buyer;
        address creator;
        uint256 amount;
        bool buyerApproval;
        bool creatorApproval;
        uint256 deadline;
        bool refunded;
        bool isStablecoin;
    }

    struct Rating {
        uint256 totalRating;
        uint256 ratingCount;
    }

    mapping(uint256 => Purchase) public purchases;
    mapping(address => uint256) public creatorBalances;
    mapping(address => uint256) public creatorStablecoinBalances;
    mapping(address => Rating) private creatorRatings;
   
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
    
    constructor(address _stablecoin, address _platformWallet) Ownable(msg.sender) {
        stablecoin = _stablecoin;
        platformWallet = _platformWallet;
    }

    function payWithETH(address creator) external payable {
        require(msg.value > 0, "Payment must be greater than 0");
        uint256 fee = (msg.value * platformFeePercentage) / 100;
        uint256 creatorAmount = msg.value - fee;
        
        purchaseCounter++;
        purchases[purchaseCounter] = Purchase(
            msg.sender, 
            creator, 
            creatorAmount, 
            false, 
            false, 
            block.timestamp + escrowTimeLimit, 
            false,
            false
        );
        
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
        purchases[purchaseCounter] = Purchase(
            msg.sender, 
            creator, 
            creatorAmount, 
            false, 
            false, 
            block.timestamp + escrowTimeLimit, 
            false,
            true
        );
        
        emit PaymentReceived(purchaseCounter, msg.sender, creator, amount, "Stablecoin");
    }

    function processMPesaPayment(address buyer, address creator, uint256 amount, string memory paymentReference) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        uint256 fee = (amount * platformFeePercentage) / 100;
        uint256 creatorAmount = amount - fee;
        
        purchaseCounter++;
        purchases[purchaseCounter] = Purchase(
            buyer, 
            creator, 
            creatorAmount, 
            false, 
            false, 
            block.timestamp + escrowTimeLimit, 
            false,
            false
        );
        
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
        Purchase storage purchase = purchases[purchaseId];
        if (purchase.buyerApproval && purchase.creatorApproval) {
            if (purchase.isStablecoin) {
                creatorStablecoinBalances[purchase.creator] += purchase.amount;
            } else {
                creatorBalances[purchase.creator] += purchase.amount;
            }
        }
    }

    function requestRefund(uint256 purchaseId) external {
        Purchase storage purchase = purchases[purchaseId];
        require(purchase.buyer == msg.sender, "Only buyer can request refund");
        require(block.timestamp > purchase.deadline, "Escrow time not expired");
        require(!purchase.creatorApproval, "Creator has already approved");
        require(!purchase.refunded, "Already refunded");

        purchase.refunded = true;
        
        if (purchase.isStablecoin) {
            require(IERC20(stablecoin).transfer(msg.sender, purchase.amount), "Stablecoin refund failed");
        } else {
            payable(msg.sender).transfer(purchase.amount);
        }
        
        emit RefundIssued(purchaseId, msg.sender);
    }

    function withdrawFunds() external {
        uint256 ethBalance = creatorBalances[msg.sender];
        uint256 tokenBalance = creatorStablecoinBalances[msg.sender];
        
        if (ethBalance > 0) {
            creatorBalances[msg.sender] = 0;
            payable(msg.sender).transfer(ethBalance);
            emit CreatorWithdraw(msg.sender, ethBalance);
        }
        
        if (tokenBalance > 0) {
            creatorStablecoinBalances[msg.sender] = 0;
            require(IERC20(stablecoin).transfer(msg.sender, tokenBalance), "Stablecoin withdraw failed");
            emit CreatorWithdraw(msg.sender, tokenBalance);
        }
        
        require(ethBalance > 0 || tokenBalance > 0, "No funds available");
    }

    function rateCreator(address creator, uint8 rating) external {
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
        
        // Check if the buyer has made a purchase from this creator
        bool hasPurchase = false;
        for (uint256 i = 1; i <= purchaseCounter; i++) {
            Purchase storage purchase = purchases[i];
            if (purchase.buyer == msg.sender && purchase.creator == creator && purchase.buyerApproval) {
                hasPurchase = true;
                break;
            }
        }
        
        require(hasPurchase, "Buyer must have completed a purchase from this creator");
        
        creatorRatings[creator].totalRating += rating;
        creatorRatings[creator].ratingCount++;
        
        emit BuyerRated(creator, rating);
    }

    function getAverageRating(address creator) external view returns (uint256) {
        Rating storage rating = creatorRatings[creator];
        if (rating.ratingCount == 0) {
            return 0;
        }
        return rating.totalRating / rating.ratingCount;
    }
}