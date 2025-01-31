const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
  let marketplace, nftContract, token, owner, seller, buyer, feeRecipient;
  
  beforeEach(async function () {
    // Deploy ERC-20 Token contract
    const Token = await ethers.getContractFactory("ERC20Token");
    token = await Token.deploy();
    await token.deployed();

    // Deploy ERC-721 NFT contract
    const NFT = await ethers.getContractFactory("ERC721Mintable");
    nftContract = await NFT.deploy();
    await nftContract.deployed();

    // Deploy Marketplace contract
    const Marketplace = await ethers.getContractFactory("NFTMarketplace");
    feeRecipient = ethers.Wallet.createRandom().address;
    marketplace = await Marketplace.deploy(nftContract.address, token.address, feeRecipient);
    await marketplace.deployed();

    // Get accounts
    [owner, seller, buyer] = await ethers.getSigners();

    // Mint some tokens for testing
    await token.mint(seller.address, ethers.utils.parseUnits("1000", 18));
    await token.mint(buyer.address, ethers.utils.parseUnits("1000", 18));
  });

  describe("Mint and List NFT", function () {
    it("should mint and list an NFT for sale", async function () {
      const metadataURI = "https://example.com/metadata/1";
      const price = ethers.utils.parseUnits("100", 18);

      const tokenId = await marketplace.mintAndListNFT(metadataURI, price);
      
      const listedPrice = await marketplace.nftPrice(tokenId);
      const listedSeller = await marketplace.nftSeller(tokenId);

      expect(listedPrice).to.equal(price);
      expect(listedSeller).to.equal(seller.address);
    });
  });

  describe("Buy NFT", function () {
    it("should allow a user to buy an NFT", async function () {
      const metadataURI = "https://example.com/metadata/2";
      const price = ethers.utils.parseUnits("100", 18);

      const tokenId = await marketplace.mintAndListNFT(metadataURI, price);

      // Approve the marketplace to spend buyer's tokens
      await token.connect(buyer).approve(marketplace.address, price);

      await marketplace.connect(buyer).buyNFT(tokenId);

      const newOwner = await nftContract.ownerOf(tokenId);

      expect(newOwner).to.equal(buyer.address);
    });

    it("should transfer marketplace fee correctly", async function () {
      const metadataURI = "https://example.com/metadata/3";
      const price = ethers.utils.parseUnits("100", 18);

      const tokenId = await marketplace.mintAndListNFT(metadataURI, price);
      const fee = (price * 2) / 100; // 2% marketplace fee

      await token.connect(buyer).approve(marketplace.address, price);
      
      // Check feeRecipient balance before buying NFT
      const feeRecipientBalanceBefore = await token.balanceOf(feeRecipient);

      await marketplace.connect(buyer).buyNFT(tokenId);

      const feeRecipientBalanceAfter = await token.balanceOf(feeRecipient);
      expect(feeRecipientBalanceAfter).to.equal(feeRecipientBalanceBefore.add(fee));
    });
  });

  describe("Start and End Auction", function () {
    it("should start an auction", async function () {
      const metadataURI = "https://example.com/metadata/4";
      const startingBid = ethers.utils.parseUnits("50", 18);
      const duration = 60 * 60; // 1 hour

      const tokenId = await marketplace.mintAndListNFT(metadataURI, 0);
      await marketplace.connect(seller).startAuction(tokenId, startingBid, duration);

      const auction = await marketplace.nftAuctions(tokenId);
      expect(auction.highestBid).to.equal(startingBid);
      expect(auction.endTime).to.be.greaterThan(0);
    });

    it("should end the auction and transfer NFT to the highest bidder", async function () {
      const metadataURI = "https://example.com/metadata/5";
      const startingBid = ethers.utils.parseUnits("50", 18);
      const duration = 60 * 60; // 1 hour

      const tokenId = await marketplace.mintAndListNFT(metadataURI, 0);
      await marketplace.connect(seller).startAuction(tokenId, startingBid, duration);

      // Place a bid
      const bidAmount = ethers.utils.parseUnits("60", 18);
      await token.connect(buyer).approve(marketplace.address, bidAmount);
      await marketplace.connect(buyer).placeBid(tokenId, bidAmount);

      // Fast forward time to end the auction
      await ethers.provider.send("evm_increaseTime", [duration]);
      await ethers.provider.send("evm_mine", []);

      // End auction and transfer NFT
      await marketplace.connect(seller).endAuction(tokenId);

      const newOwner = await nftContract.ownerOf(tokenId);
      expect(newOwner).to.equal(buyer.address);
    });
  });

  describe("Upgrade NFT", function () {
    it("should allow the owner to upgrade the NFT metadata", async function () {
      const metadataURI = "https://example.com/metadata/6";
      const price = ethers.utils.parseUnits("100", 18);

      const tokenId = await marketplace.mintAndListNFT(metadataURI, price);
      const newMetadata = "https://example.com/metadata/updated";

      await marketplace.connect(seller).upgradeNFT(tokenId, newMetadata);
      
      const upgradedMetadata = await marketplace.nftUpgrades(tokenId);
      expect(upgradedMetadata).to.equal(newMetadata);
    });
  });

  describe("Set Fee and Recipient", function () {
    it("should allow the fee recipient to change the fee", async function () {
      const newFee = 5;
      await marketplace.connect(feeRecipient).setMarketplaceFee(newFee);
      const updatedFee = await marketplace.marketplaceFee();
      expect(updatedFee).to.equal(newFee);
    });

    it("should allow the fee recipient to change the fee recipient", async function () {
      const newFeeRecipient = ethers.Wallet.createRandom().address;
      await marketplace.connect(feeRecipient).setFeeRecipient(newFeeRecipient);
      
      const updatedFeeRecipient = await marketplace.feeRecipient();
      expect(updatedFeeRecipient).to.equal(newFeeRecipient);
    });
  });
});
