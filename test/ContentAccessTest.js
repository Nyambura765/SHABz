const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ContentAccess Contract", function () {
  let ContentAccess;
  let contentAccess;
  let ERC20Token;
  let token;
  let owner;
  let user;
  let contentId;

  beforeEach(async function () {
    // Get signers (owner and user)
    [owner, user] = await ethers.getSigners();

    // Deploy a mock ERC20 token
    ERC20Token = await ethers.getContractFactory("ERC20Token");
    token = await ERC20Token.deploy("Test Token", "TTK", 1000);
    await token.deployed();

    // Deploy the ContentAccess contract
    ContentAccess = await ethers.getContractFactory("ContentAccess");
    contentAccess = await ContentAccess.deploy(token.address);
    await contentAccess.deployed();

    // Set content tier for testing
    contentId = 1;
    await contentAccess.setContentTier(contentId, 0); // Set Bronze tier for contentId 1
  });

  describe("Deployment", function () {
    it("should deploy the contract with the correct token address", async function () {
      expect(await contentAccess.token()).to.equal(token.address);
    });

    it("should initialize default tier requirements", async function () {
      const bronzeTier = await contentAccess.tiers(0);
      const silverTier = await contentAccess.tiers(1);
      const goldTier = await contentAccess.tiers(2);

      expect(bronzeTier.tokenRequirement).to.equal(10);
      expect(silverTier.tokenRequirement).to.equal(50);
      expect(goldTier.tokenRequirement).to.equal(100);
    });
  });

  describe("setTierRequirement", function () {
    it("should allow owner to set tier requirements", async function () {
      await contentAccess.setTierRequirement(1, 60); // Set Silver tier to 60 tokens
      const silverTier = await contentAccess.tiers(1);
      expect(silverTier.tokenRequirement).to.equal(60);
    });

    it("should not allow non-owner to set tier requirements", async function () {
      await expect(contentAccess.connect(user).setTierRequirement(1, 60)).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("setContentTier", function () {
    it("should allow owner to set content tier", async function () {
      await contentAccess.setContentTier(contentId, 1); // Set Silver tier for contentId 1
      const contentTier = await contentAccess.contentTiers(contentId);
      expect(contentTier).to.equal(1); // Silver tier
    });

    it("should not allow non-owner to set content tier", async function () {
      await expect(contentAccess.connect(user).setContentTier(contentId, 2)).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("hasAccess", function () {
    it("should return true if user has access based on token balance", async function () {
      await token.transfer(user.address, 50); // Transfer 50 tokens to user
      const hasAccess = await contentAccess.hasAccess(user.address, contentId);
      expect(hasAccess).to.be.true; // User has enough tokens for Bronze tier
    });

    it("should return false if user does not have access", async function () {
      await token.transfer(user.address, 5); // Transfer 5 tokens to user (less than required)
      const hasAccess = await contentAccess.hasAccess(user.address, contentId);
      expect(hasAccess).to.be.false; // User doesn't have enough tokens for Bronze tier
    });
  });

  describe("unlockContent", function () {
    it("should allow user to unlock content if they have access", async function () {
      await token.transfer(user.address, 50); // Transfer 50 tokens to user
      await expect(contentAccess.connect(user).unlockContent(contentId))
        .to.emit(contentAccess, "ContentUnlocked")
        .withArgs(user.address, contentId); // Content is unlocked
    });

    it("should revert if user does not have access", async function () {
      await token.transfer(user.address, 5); // Transfer 5 tokens to user (less than required)
      await expect(contentAccess.connect(user).unlockContent(contentId))
        .to.be.revertedWith("Insufficient token balance to unlock content"); // Should revert
    });
  });

  describe("withdrawTokens", function () {
    it("should allow owner to withdraw tokens", async function () {
      await token.transfer(contentAccess.address, 100); // Send 100 tokens to ContentAccess contract
      const initialOwnerBalance = await token.balanceOf(owner.address);

      await contentAccess.withdrawTokens(owner.address, 50); // Withdraw 50 tokens to owner

      const finalOwnerBalance = await token.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.add(50));
    });

    it("should not allow non-owner to withdraw tokens", async function () {
      await expect(contentAccess.connect(user).withdrawTokens(user.address, 50))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
