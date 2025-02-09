const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
  let marketplace, nftContract, token, owner, seller, buyer, feeRecipient;
  
  beforeEach(async function () {
    [owner, seller, buyer, feeRecipient] = await ethers.getSigners();

    // Deploy ERC-20 Token contract
    const Token = await ethers.getContractFactory("CreatorToken");
    token = await Token.deploy();
    await token.deployed();

    // Deploy ERC-721 NFT contract
    const NFT = await ethers.getContractFactory("ERC721Mintable");
    nftContract = await NFT.deploy();
    await nftContract.deployed();

    // Deploy Marketplace contract
    const Marketplace = await ethers.getContractFactory("NFTMarketplace");
    marketplace = await Marketplace.deploy(nftContract.address, token.address, feeRecipient.address, owner.address);
    await marketplace.deployed();

    // Mint some tokens for testing
    await token.mint(seller.address, ethers.parseUnits("1000", 18));
    await token.mint(buyer.address, ethers.parseUnits("1000", 18));
  });

  describe("Mint and List NFT", function () {
    it("should mint and list an NFT for sale", async function () {
      const metadataURI = "https://example.com/metadata/1";
      const price = ethers.parseUnits("100", 18);
      
      await nftContract.connect(seller).mint(seller.address, metadataURI);
      const tokenId = 1; 
      await nftContract.connect(seller).approve(marketplace.address, tokenId);
      await marketplace.connect(seller).listNFTForSale(tokenId, price);
      
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

      await nftContract.connect(seller).mint(seller.address, metadataURI);
      const tokenId = 2; 
      await nftContract.connect(seller).approve(marketplace.address, tokenId);
      await marketplace.connect(seller).listNFTForSale(tokenId, price);
      
      // Approve the marketplace to spend buyer's tokens
      await token.connect(buyer).approve(marketplace.address, price);
      await marketplace.connect(buyer).buyNFT(tokenId);

      const newOwner = await nftContract.ownerOf(tokenId);
      expect(newOwner).to.equal(buyer.address);
    });
  });
});
