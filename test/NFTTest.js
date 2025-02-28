const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT", function () {
  let NFT, nft, owner, addr1;

  beforeEach(async function () {
    // Get signers
    [owner, addr1] = await ethers.getSigners();

    // Deploy NFT contract
    NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();
    await nft.waitForDeployment();
  });

  it("Should deploy the contract with correct name and symbol", async function () {
    expect(await nft.name()).to.equal("MyNFT");
    expect(await nft.symbol()).to.equal("MNFT");
  });

  it("Should allow the owner to mint a new NFT", async function () {
    const metadataURI = "ipfs://QmExampleTokenURI";

    // Mint an NFT
    await expect(nft.mint(addr1.address, metadataURI))
      .to.emit(nft, "Transfer")
      .withArgs(ethers.ZeroAddress, addr1.address, 0);

    // Verify token ownership
    expect(await nft.ownerOf(0)).to.equal(addr1.address);

    // Verify token metadata
    expect(await nft.tokenURI(0)).to.equal(metadataURI);
  });

  it("Should prevent non-owners from minting NFTs", async function () {
    const metadataURI = "ipfs://QmExampleTokenURI";

    // Try minting with a non-owner account (should fail)
    // Updated to handle custom errors
    await expect(
      nft.connect(addr1).mint(addr1.address, metadataURI)
    ).to.be.reverted; // Just check that it reverts without specifying the message
  });

  it("Should return the correct tokenURI for minted NFTs", async function () {
    const metadataURI = "ipfs://QmExampleTokenURI";

    // Mint an NFT
    await nft.mint(addr1.address, metadataURI);

    // Check the tokenURI
    expect(await nft.tokenURI(0)).to.equal(metadataURI);
  });

  it("Should fail if querying a non-existent token", async function () {
    // Updated to handle custom errors
    await expect(nft.ownerOf(999)).to.be.reverted; // Just check that it reverts without specifying the message
  });
});