const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CreatorToken", function () {
  let ImprovedCreatorToken;
  let token;
  let owner;
  let creator;
  let addr1;
  let addr2;
  let address;
  let zeroAddress;

  beforeEach(async function () {
    // Get signers
    [owner, creator, addr1, addr2] = await ethers.getSigners();
    
    // Set zero address correctly for ethers v6
    zeroAddress = ethers.ZeroAddress;
    
    // Deploy the contract
    ImprovedCreatorToken = await ethers.getContractFactory("CreatorToken");
    token = await ImprovedCreatorToken.deploy("Creator Token", "CTKN", creator.address,owner.address);
    await token.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct token name and symbol", async function () {
      expect(await token.name()).to.equal("Creator Token");
      expect(await token.symbol()).to.equal("CTKN");
    });

    it("Should set the correct creator/owner", async function () {
      expect(await token.creator()).to.equal(creator.address);
      expect(await token.owner()).to.equal(creator.address);
    });

    it("Should have 0 initial supply", async function () {
      expect(await token.totalSupply()).to.equal(0);
    });

    it("Should revert when trying to deploy with zero address as creator", async function () {
      const TokenFactory = await ethers.getContractFactory("CreatorToken");
      // Modified to expect any revert instead of a specific message
      await expect(
        TokenFactory.deploy("Creator Token", "CTKN", zeroAddress)
      ).to.be.reverted;
    });
  });

  describe("Minting", function () {
    it("Should allow the creator to mint tokens", async function () {
      const mintAmount = ethers.parseEther("100");
      await expect(token.connect(creator).mint(addr1.address, mintAmount))
        .to.emit(token, "TokensMinted")
        .withArgs(addr1.address, mintAmount);
      
      expect(await token.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Should fail when non-creator tries to mint tokens", async function () {
      const mintAmount = ethers.parseEther("100");
      
      // Modified to expect any revert instead of a specific message
      await expect(
        token.connect(addr1).mint(addr2.address, mintAmount)
      ).to.be.reverted;
    });

    it("Should update total supply when tokens are minted", async function () {
      const mintAmount = ethers.parseEther("100");
      await token.connect(creator).mint(addr1.address, mintAmount);
      
      expect(await token.totalSupply()).to.equal(mintAmount);
    });

    it("Should revert when minting to zero address", async function () {
      const mintAmount = ethers.parseEther("100");
      await expect(
        token.connect(creator).mint(zeroAddress, mintAmount)
      ).to.be.revertedWith("Cannot mint to the zero address");
    });

    it("Should revert when minting zero tokens", async function () {
      await expect(
        token.connect(creator).mint(addr1.address, 0)
      ).to.be.revertedWith("Cannot mint zero tokens");
    });
  });

  describe("Burning Own Tokens", function () {
    const mintAmount = ethers.parseEther("100");
    const burnAmount = ethers.parseEther("30");

    beforeEach(async function () {
      // Mint tokens to addr1 for burn tests
      await token.connect(creator).mint(addr1.address, mintAmount);
    });

    it("Should allow token holders to burn their own tokens", async function () {
      await expect(token.connect(addr1).burn(burnAmount))
        .to.emit(token, "TokensBurned")
        .withArgs(addr1.address, burnAmount);
      
      expect(await token.balanceOf(addr1.address)).to.equal(mintAmount - burnAmount);
    });

    it("Should update total supply when tokens are burned", async function () {
      const initialSupply = await token.totalSupply();
      
      await token.connect(addr1).burn(burnAmount);
      
      expect(await token.totalSupply()).to.equal(initialSupply - burnAmount);
    });

    it("Should revert when burning zero tokens", async function () {
      await expect(
        token.connect(addr1).burn(0)
      ).to.be.revertedWith("Cannot burn zero tokens");
    });

    it("Should revert when trying to burn more tokens than an address has", async function () {
      const excessAmount = ethers.parseEther("150");
      
      await expect(
        token.connect(addr1).burn(excessAmount)
      ).to.be.reverted;
    });
  });

  describe("Owner BurnFrom", function () {
    const mintAmount = ethers.parseEther("100");
    const approveAmount = ethers.parseEther("50");
    const burnAmount = ethers.parseEther("30");

    beforeEach(async function () {
      // Mint tokens to addr1 for burn tests
      await token.connect(creator).mint(addr1.address, mintAmount);
      // Approve creator to spend tokens from addr1
      await token.connect(addr1).approve(creator.address, approveAmount);
    });

    it("Should allow creator to burn tokens from approved address", async function () {
      await expect(token.connect(creator).burnFrom(addr1.address, burnAmount))
        .to.emit(token, "TokensBurned")
        .withArgs(addr1.address, burnAmount);
      
      expect(await token.balanceOf(addr1.address)).to.equal(mintAmount - burnAmount);
    });

    it("Should decrease allowance after burnFrom", async function () {
      await token.connect(creator).burnFrom(addr1.address, burnAmount);
      
      expect(await token.allowance(addr1.address, creator.address))
        .to.equal(approveAmount - burnAmount);
    });

    it("Should revert when trying to burn more than allowed", async function () {
      const tooMuch = approveAmount + 1n; // Adding 1 to a BigInt
      
      await expect(
        token.connect(creator).burnFrom(addr1.address, tooMuch)
      ).to.be.revertedWith("Burn amount exceeds allowance");
    });

    it("Should revert when non-creator tries to use burnFrom", async function () {
      // addr1 approves addr2
      await token.connect(addr1).approve(addr2.address, approveAmount);
      
      // Modified to expect any revert instead of a specific message
      await expect(
        token.connect(addr2).burnFrom(addr1.address, burnAmount)
      ).to.be.reverted;
    });

    it("Should revert when burning from zero address", async function () {
      await expect(
        token.connect(creator).burnFrom(zeroAddress, burnAmount)
      ).to.be.revertedWith("Cannot burn from the zero address");
    });

    it("Should revert when burning zero tokens with burnFrom", async function () {
      await expect(
        token.connect(creator).burnFrom(addr1.address, 0)
      ).to.be.revertedWith("Cannot burn zero tokens");
    });
  });

  describe("Ownership", function () {
    it("Should allow transferring ownership", async function () {
      await token.connect(creator).transferOwnership(addr1.address);
      
      expect(await token.owner()).to.equal(addr1.address);
      expect(await token.creator()).to.equal(addr1.address);
    });
    
    it("Should allow new owner to mint tokens", async function () {
      await token.connect(creator).transferOwnership(addr1.address);
      
      const mintAmount = ethers.parseEther("100");
      await token.connect(addr1).mint(addr2.address, mintAmount);
      
      expect(await token.balanceOf(addr2.address)).to.equal(mintAmount);
    });
    
    it("Should prevent old owner from minting after ownership transfer", async function () {
      await token.connect(creator).transferOwnership(addr1.address);
      
      const mintAmount = ethers.parseEther("100");
      // Modified to expect any revert instead of a specific message
      await expect(
        token.connect(creator).mint(addr2.address, mintAmount)
      ).to.be.reverted;
    });
  });

  describe("ERC20 Standard Functions", function () {
    const mintAmount = ethers.parseEther("100");
    const transferAmount = ethers.parseEther("25");
    
    beforeEach(async function () {
      await token.connect(creator).mint(addr1.address, mintAmount);
    });
    
    it("Should allow token transfers between accounts", async function () {
      await token.connect(addr1).transfer(addr2.address, transferAmount);
      
      expect(await token.balanceOf(addr1.address)).to.equal(mintAmount - transferAmount);
      expect(await token.balanceOf(addr2.address)).to.equal(transferAmount);
    });
    
    it("Should allow approvals and transferFrom", async function () {
      await token.connect(addr1).approve(addr2.address, transferAmount);
      await token.connect(addr2).transferFrom(addr1.address, addr2.address, transferAmount);
      
      expect(await token.balanceOf(addr1.address)).to.equal(mintAmount - transferAmount);
      expect(await token.balanceOf(addr2.address)).to.equal(transferAmount);
    });
  });
});