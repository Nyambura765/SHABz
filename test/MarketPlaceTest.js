const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
  let marketplace, nftContract, token, owner, seller, buyer, feeRecipient;
  
  beforeEach(async function () {
    // Get signers
    [owner, seller, buyer, feeRecipient] = await ethers.getSigners();

    // Deploy ERC-20 Token contract with required parameters
    const Token = await ethers.getContractFactory("CreatorToken");
    token = await Token.deploy(
      "Creator Token",  // name
      "CTKN",          // symbol
      owner.address     // initialOwner
    );
    await token.waitForDeployment();

    // Deploy ERC-721 NFT contract
    const NFT = await ethers.getContractFactory("NFT");
    nftContract = await NFT.deploy();
    await nftContract.waitForDeployment();

    // Get the contract addresses
    const nftAddress = await nftContract.getAddress();
    const tokenAddress = await token.getAddress();
    
    // Deploy Marketplace contract with required parameters
    const Marketplace = await ethers.getContractFactory("NFTMarketplace");
    marketplace = await Marketplace.deploy(
      nftAddress,
      tokenAddress,
      feeRecipient.address,
      owner.address
    );
    await marketplace.waitForDeployment();

    // Mint some tokens for testing
    await token.connect(owner).mint(seller.address, ethers.parseUnits("1000", 18));
    await token.connect(owner).mint(buyer.address, ethers.parseUnits("1000", 18));
  });

  describe("Mint and List NFT", function () {
    it("should mint and list an NFT for sale", async function () {
      const metadataURI = "https://example.com/metadata/1";
      const price = ethers.parseUnits("100", 18);
      
      // Get the marketplace address
      const marketplaceAddress = await marketplace.getAddress();
      
      // Mint NFT to seller (only owner can mint)
      await nftContract.connect(owner).mint(seller.address, metadataURI);
      const tokenId = 0; // First token ID is 0
      
      // Approve marketplace to transfer the NFT
      await nftContract.connect(seller).approve(marketplaceAddress, tokenId);
      
      // List NFT for sale
      await marketplace.connect(seller).listNFTForSale(tokenId, price);
      
      // Check listing data
      const listedPrice = await marketplace.nftPrice(tokenId);
      const listedSeller = await marketplace.nftSeller(tokenId);

      expect(listedPrice).to.equal(price);
      expect(listedSeller).to.equal(seller.address);
    });
  });

  describe("Buy NFT", function () {
    it("should allow a user to buy an NFT", async function () {
      const metadataURI = "https://example.com/metadata/2";
      const price = ethers.parseUnits("100", 18);

      // Get the marketplace address
      const marketplaceAddress = await marketplace.getAddress();

      // Mint NFT to seller (only owner can mint)
      await nftContract.connect(owner).mint(seller.address, metadataURI);
      const tokenId = 0; // Use token ID 0 because each test starts fresh
      
      // Approve marketplace to transfer the NFT
      await nftContract.connect(seller).approve(marketplaceAddress, tokenId);
      
      // List NFT for sale
      await marketplace.connect(seller).listNFTForSale(tokenId, price);
      
      // Approve the marketplace to spend buyer's tokens
      await token.connect(buyer).approve(marketplaceAddress, price);
      
      // Buy NFT
      await marketplace.connect(buyer).buyNFT(tokenId);

      // Verify ownership transfer
      const newOwner = await nftContract.ownerOf(tokenId);
      expect(newOwner).to.equal(buyer.address);
    });
  });
});