const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PaymentEscrow", function () {
  let paymentEscrow;
  let stablecoin;
  let owner, buyer, creator, platformWallet;

  beforeEach(async function () {
    // Set up accounts
    [owner, buyer, creator, platformWallet] = await ethers.getSigners();

    // Deploy a mock ERC20 token (stablecoin)
    const Stablecoin = await ethers.getContractFactory("CreatorToken");
    // Pass owner address as the initialOwner parameter instead of initialSupply
    stablecoin = await Stablecoin.deploy("Stablecoin", "STBL", await owner.getAddress());
    await stablecoin.waitForDeployment();

    // Now mint tokens to the owner
    const initialSupply = ethers.parseUnits("1000000", 18);
    await stablecoin.mint(await owner.getAddress(), initialSupply);

    // Deploy the PaymentEscrow contract
    const PaymentEscrow = await ethers.getContractFactory("PaymentEscrow");
    // Get the address of the stablecoin contract and platform wallet
    const stablecoinAddress = await stablecoin.getAddress();
    const platformWalletAddress = await platformWallet.getAddress();
    
    // Deploy PaymentEscrow with the correct addresses
    paymentEscrow = await PaymentEscrow.deploy(stablecoinAddress, platformWalletAddress);
    await paymentEscrow.waitForDeployment();

    // Mint some stablecoins for the buyer
    const transferAmount = ethers.parseUnits("1000", 18);
    await stablecoin.transfer(await buyer.getAddress(), transferAmount);
  });

  describe("payWithETH", function () {
    it("should allow the buyer to pay with ETH", async function () {
      const ethAmount = ethers.parseEther("1.0"); // 1 ETH
      const fee = (ethAmount * BigInt(5)) / BigInt(100); // 5% platform fee
      
      await expect(async () =>
        paymentEscrow.connect(buyer).payWithETH(await creator.getAddress(), { value: ethAmount })
      ).to.changeEtherBalances(
        [buyer, platformWallet], 
        [ethAmount * BigInt(-1), fee]
      );
      
      // Verify the purchase was created correctly
      const purchase = await paymentEscrow.purchases(1);
      expect(purchase.buyer).to.equal(await buyer.getAddress());
      expect(purchase.creator).to.equal(await creator.getAddress());
      expect(purchase.amount).to.equal(ethAmount - fee);
    });
  });

  describe("payWithStablecoin", function () {
    it("should allow the buyer to pay with stablecoin", async function () {
      const amount = ethers.parseUnits("100", 18); // 100 STBL
      const fee = (amount * BigInt(5)) / BigInt(100); // 5% platform fee
      const creatorAmount = amount - fee;
      
      await stablecoin.connect(buyer).approve(await paymentEscrow.getAddress(), amount);

      await expect(async () =>
        paymentEscrow.connect(buyer).payWithStablecoin(await creator.getAddress(), amount)
      ).to.changeTokenBalances(
        stablecoin, 
        [buyer, platformWallet, paymentEscrow], 
        [amount * BigInt(-1), fee, creatorAmount]
      );
      
      // Verify the purchase was created correctly
      const purchase = await paymentEscrow.purchases(1);
      expect(purchase.buyer).to.equal(await buyer.getAddress());
      expect(purchase.creator).to.equal(await creator.getAddress());
      expect(purchase.amount).to.equal(creatorAmount);
      expect(purchase.isStablecoin).to.equal(true);
    });
  });

  // Rest of your test cases remain the same
  
  describe("processMPesaPayment", function () {
    it("should allow the owner to process an MPesa payment", async function () {
      const amount = ethers.parseUnits("100", 18); // 100 STBL
      const paymentReference = "MPESA12345";

      await expect(
        paymentEscrow.connect(owner).processMPesaPayment(
          await buyer.getAddress(), 
          await creator.getAddress(), 
          amount, 
          paymentReference
        )
      )
        .to.emit(paymentEscrow, "FiatPaymentVerified")
        .withArgs(1, await buyer.getAddress(), amount, paymentReference);
      
      // Verify the purchase was created correctly
      const purchase = await paymentEscrow.purchases(1);
      expect(purchase.buyer).to.equal(await buyer.getAddress());
      expect(purchase.creator).to.equal(await creator.getAddress());
      expect(purchase.amount).to.equal((amount * BigInt(95)) / BigInt(100)); // 95% of amount
    });
  });

  describe("approveContent", function () {
    it("should allow the buyer to approve the content", async function () {
      await paymentEscrow.connect(buyer).payWithETH(await creator.getAddress(), { value: ethers.parseEther("1.0") });
      const purchaseId = 1;
      
      await expect(
        paymentEscrow.connect(buyer).approveContent(purchaseId)
      )
        .to.emit(paymentEscrow, "ContentApproved")
        .withArgs(purchaseId, await buyer.getAddress());
      
      const purchase = await paymentEscrow.purchases(purchaseId);
      expect(purchase.buyerApproval).to.be.true;
    });
  });

  describe("confirmDelivery", function () {
    it("should allow the creator to confirm the delivery", async function () {
      await paymentEscrow.connect(buyer).payWithETH(await creator.getAddress(), { value: ethers.parseEther("1.0") });
      const purchaseId = 1;
      
      await expect(
        paymentEscrow.connect(creator).confirmDelivery(purchaseId)
      )
        .to.emit(paymentEscrow, "ContentApproved")
        .withArgs(purchaseId, await creator.getAddress());
      
      const purchase = await paymentEscrow.purchases(purchaseId);
      expect(purchase.creatorApproval).to.be.true;
    });
  });

  describe("requestRefund", function () {
    it("should allow the buyer to request a refund after escrow time is expired", async function () {
      const ethAmount = ethers.parseEther("1.0");
      const fee = (ethAmount * BigInt(5)) / BigInt(100);
      const creatorAmount = ethAmount - fee;
      
      await paymentEscrow.connect(buyer).payWithETH(await creator.getAddress(), { value: ethAmount });
      const purchaseId = 1;

      // Simulate the deadline expiration by advancing time
      await ethers.provider.send("evm_increaseTime", [86400 * 4]); // 4 days
      await ethers.provider.send("evm_mine", []);

      await expect(async () =>
        paymentEscrow.connect(buyer).requestRefund(purchaseId)
      ).to.changeEtherBalances(
        [buyer, paymentEscrow], 
        [creatorAmount, creatorAmount * BigInt(-1)]
      );
      
      const purchase = await paymentEscrow.purchases(purchaseId);
      expect(purchase.refunded).to.be.true;
    });
  });

  describe("withdrawFunds", function () {
    it("should allow the creator to withdraw ETH funds", async function () {
      const ethAmount = ethers.parseEther("1.0");
      const fee = (ethAmount * BigInt(5)) / BigInt(100);
      const creatorAmount = ethAmount - fee;
      
      await paymentEscrow.connect(buyer).payWithETH(await creator.getAddress(), { value: ethAmount });
      const purchaseId = 1;
      
      await paymentEscrow.connect(buyer).approveContent(purchaseId);
      await paymentEscrow.connect(creator).confirmDelivery(purchaseId);

      await expect(async () =>
        paymentEscrow.connect(creator).withdrawFunds()
      ).to.changeEtherBalances(
        [creator, paymentEscrow], 
        [creatorAmount, creatorAmount * BigInt(-1)]
      );
      
      // Creator balance should be reset to 0
      expect(await paymentEscrow.creatorBalances(await creator.getAddress())).to.equal(0);
    });
    
    it("should allow the creator to withdraw stablecoin funds", async function () {
      const amount = ethers.parseUnits("100", 18); // 100 STBL
      const fee = (amount * BigInt(5)) / BigInt(100);
      const creatorAmount = amount - fee;
      
      await stablecoin.connect(buyer).approve(await paymentEscrow.getAddress(), amount);
      await paymentEscrow.connect(buyer).payWithStablecoin(await creator.getAddress(), amount);
      const purchaseId = 1;
      
      await paymentEscrow.connect(buyer).approveContent(purchaseId);
      await paymentEscrow.connect(creator).confirmDelivery(purchaseId);

      await expect(async () =>
        paymentEscrow.connect(creator).withdrawFunds()
      ).to.changeTokenBalances(
        stablecoin, 
        [creator, paymentEscrow], 
        [creatorAmount, creatorAmount * BigInt(-1)]
      );
      
      // Creator stablecoin balance should be reset to 0
      expect(await paymentEscrow.creatorStablecoinBalances(await creator.getAddress())).to.equal(0);
    });
  });

  describe("rateCreator", function () {
    it("should allow a buyer to rate a creator after a completed purchase", async function () {
      const rating = 5;
      
      await paymentEscrow.connect(buyer).payWithETH(await creator.getAddress(), { value: ethers.parseEther("1.0") });
      const purchaseId = 1;

      await paymentEscrow.connect(buyer).approveContent(purchaseId);
      await paymentEscrow.connect(creator).confirmDelivery(purchaseId);

      await expect(
        paymentEscrow.connect(buyer).rateCreator(await creator.getAddress(), rating)
      )
        .to.emit(paymentEscrow, "BuyerRated")
        .withArgs(await creator.getAddress(), rating);
      
      const averageRating = await paymentEscrow.getAverageRating(await creator.getAddress());
      expect(averageRating).to.equal(rating);
    });
    
    it("should not allow rating if no purchase was made", async function () {
      const rating = 5;
      
      await expect(
        paymentEscrow.connect(buyer).rateCreator(await creator.getAddress(), rating)
      ).to.be.revertedWith("Buyer must have completed a purchase from this creator");
    });
    
    it("should calculate average rating correctly", async function () {
      // First purchase and rating
      await paymentEscrow.connect(buyer).payWithETH(await creator.getAddress(), { value: ethers.parseEther("1.0") });
      const purchaseId1 = 1;
      await paymentEscrow.connect(buyer).approveContent(purchaseId1);
      await paymentEscrow.connect(creator).confirmDelivery(purchaseId1);
      await paymentEscrow.connect(buyer).rateCreator(await creator.getAddress(), 4);
      
      // Second purchase and rating from the same buyer
      await paymentEscrow.connect(buyer).payWithETH(await creator.getAddress(), { value: ethers.parseEther("0.5") });
      const purchaseId2 = 2;
      await paymentEscrow.connect(buyer).approveContent(purchaseId2);
      await paymentEscrow.connect(creator).confirmDelivery(purchaseId2);
      await paymentEscrow.connect(buyer).rateCreator(await creator.getAddress(), 2);
      
      // Average should be (4 + 2) / 2 = 3
      const averageRating = await paymentEscrow.getAverageRating(await creator.getAddress());
      expect(averageRating).to.equal(3);
    });
  });
});