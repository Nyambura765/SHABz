const hre = require("hardhat");

async function main() {
    // Deploy CreatorToken contract
    const CreatorToken = await hre.ethers.getContractFactory("CreatorToken");
    const creatorToken = await CreatorToken.deploy();
    await creatorToken.deployed();
    console.log(`CreatorToken deployed at: ${creatorToken.address}`);

    // Deploy CreatorTokenManager contract
    const CreatorTokenManager = await hre.ethers.getContractFactory("CreatorTokenManager");
    const creatorTokenManager = await CreatorTokenManager.deploy();
    await creatorTokenManager.deployed();
    console.log(`CreatorTokenManager deployed at: ${creatorTokenManager.address}`);

    // Deploy NFTMarketplace contract
    const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
    const nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.deployed();
    console.log(`NFTMarketplace deployed at: ${nftMarketplace.address}`);

    // Deploy PaymentEscrow contract
    const PaymentEscrow = await hre.ethers.getContractFactory("PaymentEscrow");
    const paymentEscrow = await PaymentEscrow.deploy();
    await paymentEscrow.deployed();
    console.log(`PaymentEscrow deployed at: ${paymentEscrow.address}`);

    // Deploy SHABzPlatform contract
    const SHABzPlatform = await hre.ethers.getContractFactory("SHABzPlatform");
    const shabzPlatform = await SHABzPlatform.deploy();
    await shabzPlatform.deployed();
    console.log(`SHABzPlatform deployed at: ${shabzPlatform.address}`);
}

// Run the script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
