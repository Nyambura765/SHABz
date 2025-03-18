const hre = require("hardhat");

async function main() {
    // Get the deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);
    
    // Deploy CreatorTokenManager contract first
    const CreatorTokenManager = await hre.ethers.getContractFactory("CreatorTokenManager");
    const creatorTokenManager = await CreatorTokenManager.deploy();
    await creatorTokenManager.waitForDeployment();
    console.log(`CreatorTokenManager deployed at: ${creatorTokenManager.target}`);

    /*
    // Deploy SHABzPlatform contract with correct constructor arguments
    const SHABzPlatform = await hre.ethers.getContractFactory("SHABzPlatform");
    const shabzPlatform = await SHABzPlatform.deploy();
    await shabzPlatform.waitForDeployment();
    console.log(`SHABzPlatform deployed at: ${shabzPlatform.target}`);
    */
}


// Run the script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);

    });