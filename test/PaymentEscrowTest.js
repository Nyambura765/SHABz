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
    stablecoin = await Stablecoin.deploy("Stablecoin", "STBL", 1000000);
    await stablecoin.deployed();

    // Deploy the PaymentEscrow contract
    const PaymentEscrow = await ethers.getContractFactory("PaymentEscrow");
    paymentEscrow = await PaymentEscrow.deploy(stablecoin.address, platformWallet.address);
    await paymentEscrow.deployed();

    // Mint some stablecoins for the buyer
    await stablecoin.transfer(buyer.address, 1000);
  });

  describe("payWithETH", function () {
    it("should allow the buyer to pay with ETH", async function () {
      const ethAmount = ethers.utils.parseEther("1.0"); // 1 ETH
      await expect(() =>
        paymentEscrow.connect(buyer).payWithETH(creator.address, { value: ethAmount })
      ).to.changeEtherBalances([buyer, platformWallet], [-ethAmount, ethAmount]);
    });
  });

  describe("payWithStablecoin", function () {
    it("should allow the buyer to pay with stablecoin", async function () {
      const amount = ethers.utils.parseUnits("100", 18); // 100 STBL
      await stablecoin.connect(buyer).approve(paymentEscrow.address, amount);

      await expect(() =>
        paymentEscrow.connect(buyer).payWithStablecoin(creator.address, amount)
      ).to.changeTokenBalances(stablecoin, [buyer, platformWallet], [-amount, amount]);
    });
  });

  describe("processMPesaPayment", function () {
    it("should allow the owner to process an MPesa payment", async function () {
      const amount = ethers.utils.parseUnits("100", 18); // 100 STBL
      const paymentReference = "MPESA12345";

      await expect(() =>
        paymentEscrow.connect(owner).processMPesaPayment(buyer.address, creator.address, amount, paymentReference)
      )
        .to.emit(paymentEscrow, "FiatPaymentVerified")
        .withArgs(1, buyer.address, amount, paymentReference);
    });
  });

  describe("approveContent", function () {
    it("should allow the buyer to approve the content", async function () {
      await paymentEscrow.connect(buyer).payWithETH(creator.address, { value: ethers.utils.parseEther("1.0") });
      const purchaseId = 1;
      await paymentEscrow.connect(buyer).approveContent(purchaseId);
      const purchase = await paymentEscrow.purchases(purchaseId);
      expect(purchase.buyerApproval).to.be.true;
    });
  });

  describe("confirmDelivery", function () {
    it("should allow the creator to confirm the delivery", async function () {
      await paymentEscrow.connect(buyer).payWithETH(creator.address, { value: ethers.utils.parseEther("1.0") });
      const purchaseId = 1;
      await paymentEscrow.connect(creator).confirmDelivery(purchaseId);
      const purchase = await paymentEscrow.purchases(purchaseId);
      expect(purchase.creatorApproval).to.be.true;
    });
  });

  describe("requestRefund", function () {
    it("should allow the buyer to request a refund after escrow time is expired", async function () {
      await paymentEscrow.connect(buyer).payWithETH(creator.address, { value: ethers.utils.parseEther("1.0") });
      const purchaseId = 1;

      // Simulate the deadline expiration by advancing time
      await ethers.provider.send("evm_increaseTime", [86400 * 4]); // 4 days
      await ethers.provider.send("evm_mine", []);

      await expect(() =>
        paymentEscrow.connect(buyer).requestRefund(purchaseId)
      ).to.changeEtherBalances([buyer, platformWallet], [ethers.utils.parseEther("1.0"), 0]);
    });
  });

  describe("withdrawFunds", function () {
    it("should allow the creator to withdraw funds", async function () {
      await paymentEscrow.connect(buyer).payWithETH(creator.address, { value: ethers.utils.parseEther("1.0") });
      const purchaseId = 1;
      await paymentEscrow.connect(buyer).approveContent(purchaseId);
      await paymentEscrow.connect(creator).confirmDelivery(purchaseId);

      const creatorBalanceBefore = await ethers.provider.getBalance(creator.address);
      await paymentEscrow.connect(creator).withdrawFunds();
      const creatorBalanceAfter = await ethers.provider.getBalance(creator.address);

      expect(creatorBalanceAfter).to.be.gt(creatorBalanceBefore); // Creator balance should have increased
    });
  });

  describe("rateCreator", function () {
    it("should allow a buyer to rate a creator", async function () {
      const rating = 5;
      await paymentEscrow.connect(buyer).payWithETH(creator.address, { value: ethers.utils.parseEther("1.0") });
      const purchaseId = 1;

      await paymentEscrow.connect(buyer).approveContent(purchaseId);
      await paymentEscrow.connect(creator).confirmDelivery(purchaseId);

      await paymentEscrow.connect(buyer).rateCreator(creator.address, rating);
      const averageRating = await paymentEscrow.getAverageRating(creator.address);
      expect(averageRating).to.equal(rating); // The rating should be 5
    });
  });
});
