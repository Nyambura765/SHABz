const { expect } = require("chai");
const { ethers } = require("hardhat");
const { ZeroAddress, parseEther } = ethers;

describe("CreatorTokenManager", function () {
  let CreatorTokenManager;
  let creatorTokenManager;
  let CreatorToken;
  let owner;
  let creator;
  let user1;
  let user2;

  beforeEach(async function () {
    // Get signers
    [owner, creator, user1, user2] = await ethers.getSigners();

    // Deploy the CreatorToken contract for imports
    CreatorToken = await ethers.getContractFactory("CreatorToken");
    
    // Deploy the CreatorTokenManager contract
    CreatorTokenManager = await ethers.getContractFactory("CreatorTokenManager");
    creatorTokenManager = await CreatorTokenManager.deploy();
    // Replace the old .deployed() call with simply waiting for deployment to complete
    await creatorTokenManager.waitForDeployment();
  });

  describe("Token Creation", function () {
    it("Should allow a creator to create a token", async function () {
      // Create a token as the creator
      const tokenName = "Creator Token";
      const tokenSymbol = "CTKN";
      
      const tx = await creatorTokenManager.connect(creator).createToken(tokenName, tokenSymbol);
      
      // Get the token address
      const tokenAddress = await creatorTokenManager.getTokenAddress(creator.address);
      
      // Verify the token creation event
      await expect(tx)
        .to.emit(creatorTokenManager, "TokenCreated")
        .withArgs(creator.address, tokenAddress);
      
      // Verify the token was stored correctly
      expect(tokenAddress).to.not.equal(ZeroAddress);
      
      // Verify token properties
      const tokenContract = await CreatorToken.attach(tokenAddress);
      expect(await tokenContract.name()).to.equal(tokenName);
      expect(await tokenContract.symbol()).to.equal(tokenSymbol);
      expect(await tokenContract.owner()).to.equal(CreatorTokenManager.address);
    });

    // Rest of the test file remains unchanged
    it("Should prevent creating multiple tokens for the same creator", async function () {
      // Create the first token
      await creatorTokenManager.connect(creator).createToken("Creator Token", "CTKN");
      
      // Try to create another token
      await expect(
        creatorTokenManager.connect(creator).createToken("Another Token", "ATKN")
      ).to.be.revertedWith("Token already created");
    });
  });

  describe("Tier Management", function () {
    let tokenAddress;

    beforeEach(async function () {
      // Create a token for testing tiers
      await creatorTokenManager.connect(creator).createToken("Creator Token", "CTKN");
      tokenAddress = await creatorTokenManager.getTokenAddress(creator.address);
    });

    it("Should allow adding a tier", async function () {
      const tierId = 1;
      const tierName = "Gold";
      const tierSupply = 100;
      const tierPrice = parseEther("0.1");
      
      const tx = await creatorTokenManager.connect(creator).addTier(
        tokenAddress, 
        tierId, 
        tierName, 
        tierSupply, 
        tierPrice
      );
      
      // Verify event
      await expect(tx)
        .to.emit(creatorTokenManager, "TierAdded")
        .withArgs(tokenAddress, tierId, tierName, tierSupply, tierPrice);
      
      // Verify tier details
      const tierDetails = await creatorTokenManager.getTierDetails(tokenAddress, tierId);
      expect(tierDetails.name).to.equal(tierName);
      expect(tierDetails.supply).to.equal(tierSupply);
      expect(tierDetails.minted).to.equal(0);
      expect(tierDetails.price).to.equal(tierPrice);
    });

    it("Should prevent non-creator from adding a tier", async function () {
      await expect(
        creatorTokenManager.connect(user1).addTier(
          tokenAddress, 
          1, 
          "Gold", 
          100, 
          parseEther("0.1")
        )
      ).to.be.revertedWith("Not your token");
    });

    it("Should prevent adding a tier with an existing ID", async function () {
      const tierId = 1;
      
      // Add first tier
      await creatorTokenManager.connect(creator).addTier(
        tokenAddress, 
        tierId, 
        "Gold", 
        100, 
        parseEther("0.1")
      );
      
      // Try to add another tier with the same ID
      await expect(
        creatorTokenManager.connect(creator).addTier(
          tokenAddress, 
          tierId, 
          "Silver", 
          200, 
          parseEther("0.05")
        )
      ).to.be.revertedWith("Tier already exists");
    });

    it("Should prevent adding a tier with zero supply", async function () {
      await expect(
        creatorTokenManager.connect(creator).addTier(
          tokenAddress, 
          1, 
          "Gold", 
          0, 
          parseEther("0.1")
        )
      ).to.be.revertedWith("Supply must be greater than zero");
    });

    it("Should prevent adding a tier with zero price", async function () {
      await expect(
        creatorTokenManager.connect(creator).addTier(
          tokenAddress, 
          1, 
          "Gold", 
          100, 
          0
        )
      ).to.be.revertedWith("Price must be greater than zero");
    });
  });

  describe("Token Minting", function () {
    let tokenAddress;
    const tierId = 1;
    const tierSupply = 100;

    beforeEach(async function () {
      // Create a token and add a tier for testing minting
      await creatorTokenManager.connect(creator).createToken("Creator Token", "CTKN");
      tokenAddress = await creatorTokenManager.getTokenAddress(creator.address);
      
      await creatorTokenManager.connect(creator).addTier(
        tokenAddress, 
        tierId, 
        "Gold", 
        tierSupply, 
        parseEther("0.1")
      );
    });

    it("Should allow creator to mint tokens", async function () {
      const mintAmount = 10;
      
      const tx = await creatorTokenManager.connect(creator).mintTokens(
        tokenAddress, 
        tierId, 
        mintAmount, 
        user1.address
      );
      
      // Verify event
      await expect(tx)
        .to.emit(creatorTokenManager, "TokensMinted")
        .withArgs(tokenAddress, user1.address, tierId, mintAmount);
      
      // Verify token balance
      const tokenContract = await CreatorToken.attach(tokenAddress);
      expect(await tokenContract.balanceOf(user1.address)).to.equal(mintAmount);
      
      // Verify tier minted count
      const tierDetails = await creatorTokenManager.getTierDetails(tokenAddress, tierId);
      expect(tierDetails.minted).to.equal(mintAmount);
    });

    it("Should prevent non-creator from minting tokens", async function () {
      await expect(
        creatorTokenManager.connect(user1).mintTokens(
          tokenAddress, 
          tierId, 
          10, 
          user2.address
        )
      ).to.be.revertedWith("Not your token");
    });

    it("Should prevent minting to zero address", async function () {
      await expect(
        creatorTokenManager.connect(creator).mintTokens(
          tokenAddress, 
          tierId, 
          10, 
          ZeroAddress
        )
      ).to.be.revertedWith("Cannot mint to zero address");
    });

    it("Should prevent minting zero tokens", async function () {
      await expect(
        creatorTokenManager.connect(creator).mintTokens(
          tokenAddress, 
          tierId, 
          0, 
          user1.address
        )
      ).to.be.revertedWith("Amount must be greater than zero");
    });

    it("Should prevent minting for non-existent tier", async function () {
      const nonExistentTierId = 99;
      await expect(
        creatorTokenManager.connect(creator).mintTokens(
          tokenAddress, 
          nonExistentTierId, 
          10, 
          user1.address
        )
      ).to.be.revertedWith("Tier does not exist");
    });

    it("Should prevent minting beyond tier supply", async function () {
      // Try to mint more than the tier supply
      await expect(
        creatorTokenManager.connect(creator).mintTokens(
          tokenAddress, 
          tierId, 
          tierSupply + 1, 
          user1.address
        )
      ).to.be.revertedWith("Exceeds tier supply");
      
      // Mint up to the limit
      await creatorTokenManager.connect(creator).mintTokens(
        tokenAddress, 
        tierId, 
        tierSupply, 
        user1.address
      );
      
      // Try to mint one more
      await expect(
        creatorTokenManager.connect(creator).mintTokens(
          tokenAddress, 
          tierId, 
          1, 
          user1.address
        )
      ).to.be.revertedWith("Exceeds tier supply");
    });
  });

  describe("Token Burning", function () {
    let tokenAddress;
    let tokenContract;
    const tierId = 1;
    const mintAmount = 50;

    beforeEach(async function () {
      // Create a token, add a tier, and mint tokens for testing burning
      await creatorTokenManager.connect(creator).createToken("Creator Token", "CTKN");
      tokenAddress = await creatorTokenManager.getTokenAddress(creator.address);
      
      await creatorTokenManager.connect(creator).addTier(
        tokenAddress, 
        tierId, 
        "Gold", 
        100, 
        parseEther("0.1")
      );
      
      await creatorTokenManager.connect(creator).mintTokens(
        tokenAddress, 
        tierId, 
        mintAmount, 
        user1.address
      );
      
      tokenContract = await CreatorToken.attach(tokenAddress);
    });

    it("Should allow creator to burn tokens with approval", async function () {
      const burnAmount = 10;
      
      // User1 approves the token contract to burn their tokens
      await tokenContract.connect(user1).approve(creatorTokenManager.address, burnAmount);
      
      const tx = await creatorTokenManager.connect(creator).burnTokens(
        tokenAddress, 
        user1.address, 
        burnAmount
      );
      
      // Verify event
      await expect(tx)
        .to.emit(creatorTokenManager, "TokensBurned")
        .withArgs(tokenAddress, user1.address, burnAmount);
      
      // Verify token balance
      expect(await tokenContract.balanceOf(user1.address)).to.equal(mintAmount - burnAmount);
    });

    it("Should prevent non-creator from burning tokens", async function () {
      const burnAmount = 10;
      
      // User1 approves the token contract
      await tokenContract.connect(user1).approve(creatorTokenManager.address, burnAmount);
      
      await expect(
        creatorTokenManager.connect(user2).burnTokens(
          tokenAddress, 
          user1.address, 
          burnAmount
        )
      ).to.be.revertedWith("Not your token");
    });

    it("Should prevent burning from zero address", async function () {
      await expect(
        creatorTokenManager.connect(creator).burnTokens(
          tokenAddress, 
          ZeroAddress, 
          10
        )
      ).to.be.revertedWith("Cannot burn from zero address");
    });

    it("Should prevent burning zero tokens", async function () {
      await expect(
        creatorTokenManager.connect(creator).burnTokens(
          tokenAddress, 
          user1.address, 
          0
        )
      ).to.be.revertedWith("Amount must be greater than zero");
    });

    it("Should prevent burning without approval", async function () {
      // Try to burn without approval
      await expect(
        creatorTokenManager.connect(creator).burnTokens(
          tokenAddress, 
          user1.address, 
          10
        )
      ).to.be.reverted; // ERC20: burn amount exceeds allowance
    });

    it("Should prevent burning more than approved amount", async function () {
      const approvedAmount = 10;
      const burnAmount = 20;
      
      // User1 approves a specific amount
      await tokenContract.connect(user1).approve(creatorTokenManager.address, approvedAmount);
      
      // Try to burn more than approved
      await expect(
        creatorTokenManager.connect(creator).burnTokens(
          tokenAddress, 
          user1.address, 
          burnAmount
        )
      ).to.be.reverted; // ERC20: burn amount exceeds allowance
    });
  });

  describe("View Functions", function () {
    let tokenAddress;
    const tierId = 1;

    beforeEach(async function () {
      // Create a token and add a tier for testing view functions
      await creatorTokenManager.connect(creator).createToken("Creator Token", "CTKN");
      tokenAddress = await creatorTokenManager.getTokenAddress(creator.address);
      
      await creatorTokenManager.connect(creator).addTier(
        tokenAddress, 
        tierId, 
        "Gold", 
        100, 
        parseEther("0.1")
      );
    });

    it("Should retrieve correct token address for creator", async function () {
      expect(await creatorTokenManager.getTokenAddress(creator.address)).to.equal(tokenAddress);
      expect(await creatorTokenManager.getTokenAddress(user1.address)).to.equal(ZeroAddress);
    });

    it("Should retrieve correct tier details", async function () {
      const tierDetails = await creatorTokenManager.getTierDetails(tokenAddress, tierId);
      
      expect(tierDetails.name).to.equal("Gold");
      expect(tierDetails.supply).to.equal(100);
      expect(tierDetails.minted).to.equal(0);
      expect(tierDetails.price).to.equal(parseEther("0.1"));
    });

    it("Should revert when retrieving non-existent tier", async function () {
      const nonExistentTierId = 99;
      await expect(
        creatorTokenManager.getTierDetails(tokenAddress, nonExistentTierId)
      ).to.be.revertedWith("Tier does not exist");
    });
  });

  describe("Contract Ownership", function () {
    it("Should have the deployer as the owner", async function () {
      expect(await creatorTokenManager.owner()).to.equal(owner.address);
    });

    it("Should allow the owner to transfer ownership", async function () {
      await creatorTokenManager.transferOwnership(user1.address);
      expect(await creatorTokenManager.owner()).to.equal(user1.address);
    });

    it("Should prevent non-owner from transferring ownership", async function () {
      await expect(
        creatorTokenManager.connect(user1).transferOwnership(user2.address)
      ).to.be.reverted; // Ownable: caller is not the owner
    });
  });
});