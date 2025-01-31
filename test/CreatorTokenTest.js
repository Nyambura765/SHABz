const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CreatorToken", function () {
  let creatorToken;
  let owner;
  let addr1;
  let addr2;
  const name = "MyToken";
  const symbol = "MTK";
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const CreatorToken = await ethers.getContractFactory("CreatorToken");
    creatorToken = await CreatorToken.deploy(name, symbol, owner.address);
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await creatorToken.creator()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await creatorToken.balanceOf(owner.address);
      expect(await creatorToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Minting", function () {
    it("Should allow the creator to mint tokens", async function () {
      await creatorToken.mint(addr1.address, 100);

      expect(await creatorToken.balanceOf(addr1.address)).to.equal(100);
      expect(await creatorToken.totalSupply()).to.equal(100);
    });

    it("Should not allow non-creator to mint tokens", async function () {
      await expect(
        creatorToken.connect(addr1).mint(addr2.address, 100)
      ).to.be.revertedWith("Not the creator");
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      await creatorToken.mint(addr1.address, 100);
    });

    it("Should allow the creator to burn tokens", async function () {
      await creatorToken.burn(addr1.address, 50);

      expect(await creatorToken.balanceOf(addr1.address)).to.equal(50);
      expect(await creatorToken.totalSupply()).to.equal(50);
    });

    it("Should not allow non-creator to burn tokens", async function () {
      await expect(
        creatorToken.connect(addr1).burn(addr1.address, 50)
      ).to.be.revertedWith("Not the creator");
    });
  });
});