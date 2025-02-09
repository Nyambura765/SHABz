const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SHABzPlatform", function () {
  let SHABzPlatform;
  let creatorTokenManager;
  let nftMarketplace;
  let paymentEscrow;
  let shabzPlatform;
  let owner;
  let user;
  let creator;

  beforeEach(async function () {
    [owner, user, creator] = await ethers.getSigners();

    // Deploy token manager, NFT marketplace, and payment escrow contract first
    const CreatorTokenManager = await ethers.getContractFactory("CreatorTokenManager");
    creatorTokenManager = await CreatorTokenManager.deploy();
    

    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    nftMarketplace = await NFTMarketplace.deploy();
    

    const PaymentEscrow = await ethers.getContractFactory("PaymentEscrow");
    paymentEscrow = await PaymentEscrow.deploy("0x0000000000000000000000000000000000000000", owner.address);
    

    // Deploy SHABzPlatform contract
    SHABzPlatform = await ethers.getContractFactory("SHABzPlatform");
    shabzPlatform = await SHABzPlatform.deploy(
      creatorTokenManager.address,
      nftMarketplace.address,
      paymentEscrow.address
    );
    await shabzPlatform.deployed();
  });

  describe("User & Creator Registration", function () {
    it("should allow a user to register", async function () {
      await expect(shabzPlatform.registerUser()).to.emit(shabzPlatform, "UserRegistered").withArgs(user.address);
    });

    it("should allow a user to register as a creator", async function () {
      await expect(shabzPlatform.registerCreator()).to.emit(shabzPlatform, "CreatorRegistered").withArgs(user.address);
      const isCreator = await shabzPlatform.isCreator(user.address);
      expect(isCreator).to.equal(true);
    });

    it("should not allow a user to register as a creator twice", async function () {
      await shabzPlatform.registerCreator();
      await expect(shabzPlatform.registerCreator()).to.be.revertedWith("Already registered as creator");
    });
  });

  describe("Cross-Creator Collaborations", function () {
    it("should allow a creator to create a collaboration", async function () {
      const creators = [creator.address, user.address];
      const startDate = Math.floor(Date.now() / 1000);
      const endDate = startDate + 86400; // 1 day later

      await expect(
        shabzPlatform.createCollaboration(creators, startDate, endDate)
      ).to.emit(shabzPlatform, "CollaborationCreated").withArgs(0, creators);

      const collaboration = await shabzPlatform.getCollaboration(0);
      expect(collaboration[0]).to.deep.equal(creators);
      expect(collaboration[1]).to.equal(startDate);
      expect(collaboration[2]).to.equal(endDate);
      expect(collaboration[3]).to.equal(true);
    });

    it("should require at least two creators to create a collaboration", async function () {
      const creators = [creator.address];
      const startDate = Math.floor(Date.now() / 1000);
      const endDate = startDate + 86400; // 1 day later

      await expect(
        shabzPlatform.createCollaboration(creators, startDate, endDate)
      ).to.be.revertedWith("At least two creators are required");
    });
  });

  describe("Gamification Logic", function () {
    it("should allow the owner to award gamification points to a user", async function () {
      const points = 100;
      await expect(shabzPlatform.awardGamificationPoints(user.address, points))
        .to.emit(shabzPlatform, "GamificationPointsAwarded")
        .withArgs(user.address, points);

      const userPoints = await shabzPlatform.getUserPoints(user.address);
      expect(userPoints).to.equal(points);
    });
  });

  describe("Airdrop Mechanism", function () {
    it("should allow the owner to distribute airdrops", async function () {
      const airdropAmount = ethers.utils.parseEther("10");

      // Assuming the creator has a token
      const tokenAddress = await creatorTokenManager.getTokenAddress(user.address);
      if (tokenAddress === ethers.constants.AddressZero) {
        // Deploy a mock ERC20 token for the test if necessary
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        const mockToken = await MockERC20.deploy("Mock Token", "MTK", 18, ethers.utils.parseEther("1000000"));
        await mockToken.deployed();

        // Set the token address for the user
        await creatorTokenManager.setTokenAddress(user.address, mockToken.address);
      }

      await expect(shabzPlatform.distributeAirdrop(user.address, airdropAmount))
        .to.emit(shabzPlatform, "AirdropDistributed")
        .withArgs(user.address, airdropAmount);
    });
  });
});
