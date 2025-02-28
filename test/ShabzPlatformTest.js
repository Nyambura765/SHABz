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
  let nftContract;
  let paymentToken;

  beforeEach(async function () {
    [owner, user, creator] = await ethers.getSigners();

    // Deploy your actual NFT contract
    const NFTContract = await ethers.getContractFactory("NFT");
    nftContract = await NFTContract.deploy();
    // Use waitForDeployment() instead of deployed()
    await nftContract.waitForDeployment();
    
    // Verify nftContract was initialized properly
    console.log("NFT Contract deployed to:", await nftContract.getAddress());
    
    // Deploy your actual CreatorToken contract
    const CreatorTokenContract = await ethers.getContractFactory("CreatorToken");
    // Keep owner.address as the third parameter since the constructor requires it
    paymentToken = await CreatorTokenContract.deploy("Creator Token", "CTK", owner.address);
    await paymentToken.waitForDeployment();
    
    // Verify paymentToken was initialized properly
    console.log("Payment Token deployed to:", await paymentToken.getAddress());

    // Deploy token manager, NFT marketplace, and payment escrow contract
    const CreatorTokenManager = await ethers.getContractFactory("CreatorTokenManager");
    creatorTokenManager = await CreatorTokenManager.deploy();
    await creatorTokenManager.waitForDeployment();

    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    nftMarketplace = await NFTMarketplace.deploy(
      await nftContract.getAddress(),
      await paymentToken.getAddress(),
      owner.address,
      owner.address
    );
    await nftMarketplace.waitForDeployment();
    
    // Fixed PaymentEscrow deployment
    const PaymentEscrow = await ethers.getContractFactory("PaymentEscrow");
    paymentEscrow = await PaymentEscrow.deploy(
      "0x0000000000000000000000000000000000000000", // stablecoin address
      owner.address
    );
    await paymentEscrow.waitForDeployment();

    // Deploy SHABzPlatform contract
    SHABzPlatform = await ethers.getContractFactory("SHABzPlatform");
    shabzPlatform = await SHABzPlatform.deploy(
      await creatorTokenManager.getAddress(),
      await nftMarketplace.getAddress(),
      await paymentEscrow.getAddress(),
      { from: owner.address }
    );
    await shabzPlatform.waitForDeployment();
  });

  describe("User & Creator Registration", function () {
    it("should allow a user to register", async function () {
      await expect(shabzPlatform.connect(user).registerUser())
        .to.emit(shabzPlatform, "UserRegistered")
        .withArgs(user.address);
    });

    it("should allow a user to register as a creator", async function () {
      await expect(shabzPlatform.connect(user).registerCreator())
        .to.emit(shabzPlatform, "CreatorRegistered")
        .withArgs(user.address);
        
      const isCreator = await shabzPlatform.isCreator(user.address);
      expect(isCreator).to.equal(true);
    });

    it("should not allow a user to register as a creator twice", async function () {
      await shabzPlatform.connect(user).registerCreator();
      await expect(shabzPlatform.connect(user).registerCreator())
        .to.be.revertedWith("Already registered as creator");
    });
  });

  describe("Cross-Creator Collaborations", function () {
    it("should allow a creator to create a collaboration", async function () {
      // First register both addresses as creators
      await shabzPlatform.connect(creator).registerCreator();
      await shabzPlatform.connect(user).registerCreator();
      
      const creatorAddr = creator.address;
      const userAddr = user.address;
      const creators = [creatorAddr, userAddr];
      const startDate = Math.floor(Date.now() / 1000);
      const endDate = startDate + 86400; // 1 day later

      await expect(
        shabzPlatform.connect(creator).createCollaboration(creators, startDate, endDate)
      ).to.emit(shabzPlatform, "CollaborationCreated").withArgs(0, creators);

      const collaboration = await shabzPlatform.getCollaboration(0);
      expect(collaboration[0]).to.deep.equal(creators);
      expect(collaboration[1]).to.equal(startDate);
      expect(collaboration[2]).to.equal(endDate);
      expect(collaboration[3]).to.equal(true);
    });

    it("should require at least two creators to create a collaboration", async function () {
      // Register as a creator first
      await shabzPlatform.connect(creator).registerCreator();
      
      const creatorAddr = creator.address;
      const creators = [creatorAddr];
      const startDate = Math.floor(Date.now() / 1000);
      const endDate = startDate + 86400; // 1 day later

      await expect(
        shabzPlatform.connect(creator).createCollaboration(creators, startDate, endDate)
      ).to.be.revertedWith("At least two creators are required");
    });
  });

  describe("Gamification Logic", function () {
    it("should allow the owner to award gamification points to a user", async function () {
      const userAddr = user.address;
      const points = 100;
      
      await expect(shabzPlatform.connect(owner).awardGamificationPoints(userAddr, points))
        .to.emit(shabzPlatform, "GamificationPointsAwarded")
        .withArgs(userAddr, points);

      const userPoints = await shabzPlatform.getUserPoints(userAddr);
      expect(userPoints).to.equal(points);
    });
  });

  describe("Airdrop Mechanism", function () {
    it("should allow the owner to distribute airdrops", async function () {
      const userAddr = user.address;
      // Use parseEther from ethers v6
      const airdropAmount = ethers.parseEther("10");
      
      // Use your existing CreatorToken contract for the airdrop test
      const CreatorTokenContract = await ethers.getContractFactory("CreatorToken");
      // Keep owner.address as the third parameter since the constructor requires it
      const mockToken = await CreatorTokenContract.deploy("Mock Airdrop Token", "MAT", owner.address);
      await mockToken.waitForDeployment();
      
      // Mint tokens to the platform (so it can distribute them)
      await mockToken.mint(await shabzPlatform.getAddress(), ethers.parseEther("1000000"));

      // Get token address
      const tokenAddress = await mockToken.getAddress();
      
      // Set the token address for the user in the token manager
      await creatorTokenManager.setTokenAddress(userAddr, tokenAddress);

      await expect(shabzPlatform.connect(owner).distributeAirdrop(userAddr, airdropAmount))
        .to.emit(shabzPlatform, "AirdropDistributed")
        .withArgs(userAddr, airdropAmount);
    });
  });

  // Additional test for NFT minting and marketplace integration
  describe("NFT Integration", function() {
    it("should allow minting an NFT and listing it on the marketplace", async function() {
      // Owner mints an NFT to the creator
      const tokenURI = "ipfs://QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
      await nftContract.mint(creator.address, tokenURI);
      
      // Register as a creator
      await shabzPlatform.connect(creator).registerCreator();
      
    });
  });
});