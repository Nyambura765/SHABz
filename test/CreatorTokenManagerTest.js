const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CreatorTokenManager", function () {
    let creatorTokenManager;
    let owner;
    let addr1;
    let addr2;
    const name = "MyToken";
    const symbol = "MTK";

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        const CreatorTokenManager = await ethers.getContractFactory("CreatorTokenManager");
        creatorTokenManager = await CreatorTokenManager.deploy(); 

        console.log("Contract deployed successfully.");
    });

    describe("Deployment", function () {
        it("Should set the correct owner", async function () {
            expect(await creatorTokenManager.owner()).to.equal(owner.address);
        });
    });

    describe("createToken", function () {
        it("Should allow the owner to create a token", async function () {
            await creatorTokenManager.createToken(name, symbol);
            const tokenAddress = await creatorTokenManager.getTokenAddress(owner.address);
            expect(tokenAddress).to.not.equal(ethers.ZeroAddress); 
        });

        it("Should not allow creating multiple tokens for the same owner", async function () {
            await creatorTokenManager.createToken(name, symbol);
            await expect(
                creatorTokenManager.createToken(name, symbol)
            ).to.be.revertedWith("Token already created");
        });
    });

    describe("addTier", function () {
        beforeEach(async function () {
            await creatorTokenManager.createToken(name, symbol);
            const tokenAddress = await creatorTokenManager.getTokenAddress(owner.address);
            this.tokenAddress = tokenAddress;
        });

        it("Should allow the owner to add a tier", async function () {
            const tierId = 1;
            const tierName = "Bronze";
            const tierSupply = 100;
            const tierPrice = ethers.parseEther("0.01"); // Fixed import

            await creatorTokenManager.addTier(this.tokenAddress, tierId, tierName, tierSupply, tierPrice);

            const tier = await creatorTokenManager.tokenTiers(this.tokenAddress, tierId);
            expect(tier.name).to.equal(tierName);
            expect(tier.supply).to.equal(tierSupply);
            expect(tier.price).to.equal(tierPrice);
        });

        it("Should not allow adding a tier if it already exists", async function () {
            const tierId = 1;
            const tierName = "Bronze";
            const tierSupply = 100;
            const tierPrice = ethers.parseEther("0.01"); // Fixed import

            await creatorTokenManager.addTier(this.tokenAddress, tierId, tierName, tierSupply, tierPrice);

            await expect(
                creatorTokenManager.addTier(this.tokenAddress, tierId, tierName, tierSupply, tierPrice)
            ).to.be.revertedWith("Tier already exists");
        });
    });

    describe("mintTokens", function () {
        beforeEach(async function () {
            await creatorTokenManager.createToken(name, symbol);
            const tokenAddress = await creatorTokenManager.getTokenAddress(owner.address);
            this.tokenAddress = tokenAddress;

            const tierId = 1;
            const tierName = "Bronze";
            const tierSupply = 100;
            const tierPrice = ethers.parseEther("0.01"); // Fixed import

            await creatorTokenManager.addTier(this.tokenAddress, tierId, tierName, tierSupply, tierPrice);
            this.tierId = tierId;
        });

        it("Should allow the owner to mint tokens within the tier supply", async function () {
            const amount = 10;
            const value = ethers.parseEther("0.1"); // Fixed import

            await creatorTokenManager.mintTokens(this.tokenAddress, this.tierId, amount, addr1.address, { value });

            const tokenContract = await ethers.getContractAt("CreatorToken", this.tokenAddress);
            const balance = await tokenContract.balanceOf(addr1.address);
            expect(balance).to.equal(amount);
        });

        it("Should not allow minting tokens if the tier supply is exceeded", async function () {
            const amount = 101; // Exceeds tier supply
            const value = ethers.parseEther("1.01"); // Fixed import

            await expect(
                creatorTokenManager.mintTokens(this.tokenAddress, this.tierId, amount, addr1.address, { value })
            ).to.be.revertedWith("Exceeds tier supply");
        });

        it("Should not allow minting tokens if the payment is insufficient", async function () {
            const amount = 10;
            const value = ethers.parseEther("0.05"); // Insufficient payment, fixed import

            await expect(
                creatorTokenManager.mintTokens(this.tokenAddress, this.tierId, amount, addr1.address, { value })
            ).to.be.revertedWith("Insufficient payment");
        });
    });

    describe("burnTokens", function () {
        beforeEach(async function () {
            await creatorTokenManager.createToken(name, symbol);
            const tokenAddress = await creatorTokenManager.getTokenAddress(owner.address);
            this.tokenAddress = tokenAddress;

            const tierId = 1;
            const tierName = "Bronze";
            const tierSupply = 100;
            const tierPrice = ethers.parseEther("0.01"); // Fixed import

            await creatorTokenManager.addTier(this.tokenAddress, tierId, tierName, tierSupply, tierPrice);
            this.tierId = tierId;

            const amount = 10;
            const value = ethers.parseEther("0.1"); // Fixed import
            await creatorTokenManager.mintTokens(this.tokenAddress, this.tierId, amount, owner.address, { value });
        });

        it("Should allow the owner to burn tokens", async function () {
            const amount = 5;

            await creatorTokenManager.burnTokens(this.tokenAddress, amount);

            const tokenContract = await ethers.getContractAt("CreatorToken", this.tokenAddress);
            const balance = await tokenContract.balanceOf(owner.address);
            expect(balance).to.equal(5); 
        });
    });
});
