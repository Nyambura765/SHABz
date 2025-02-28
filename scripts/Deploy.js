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

    
    // Deploy the NFT contract 
    const NFTFactory = await hre.ethers.getContractFactory("NFT");
    const nftContract = await NFTFactory.deploy();
    await nftContract.deployed();
    const nftContractAddress = nftContract.address;
    console.log("NFT contract deployed at:", nftContractAddress);

    const tokenAddress = "0x346311db922EAc24426C96c76aE98126eB835cAB"; // Your ERC20 token address
    const feeRecipient = deployer.address; // or another address that will receive fees
  
    // Deploy NFTMarketplace with all required parameters
    const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
    const nftMarketplace = await NFTMarketplace.deploy(
        nftContractAddress,  // _nftContract
        tokenAddress,        // _token
        feeRecipient,        // _feeRecipient
        deployer.address     // _owner
    );
    await nftMarketplace.deployed();
    const nftMarketplaceAddress = nftMarketplace.address;
    console.log("NFTMarketplace deployed at:", nftMarketplaceAddress);

    // Deploy PaymentEscrow contract with correct constructor arguments
    const PaymentEscrow = await hre.ethers.getContractFactory("PaymentEscrow");
    const paymentEscrow = await PaymentEscrow.deploy(
        tokenAddress,     // _stablecoin address
        deployer.address  // _platformWallet address
    );
    await paymentEscrow.deployed();
    const paymentEscrowAddress = paymentEscrow.address;
    console.log(`PaymentEscrow deployed at: ${paymentEscrowAddress}`);

    // Deploy SHABzPlatform contract with correct constructor arguments
    const SHABzPlatform = await hre.ethers.getContractFactory("SHABzPlatform");
    const shabzPlatform = await SHABzPlatform.deploy(
        creatorTokenManagerAddress,  // _tokenManagerAddress
        nftMarketplaceAddress,       // _nftMarketplaceAddress
        paymentEscrowAddress         // _paymentEscrowAddress
    );
    await shabzPlatform.deployed();
    console.log(`SHABzPlatform deployed at: ${shabzPlatform.address}`);
    // Deploy Game contract with reward token
    const Game = await hre.ethers.getContractFactory("Game");
    const game = await Game.deploy(
        tokenAddress  // _rewardToken address - using the same token as other contracts
    );
    await game.deployed();
    const gameAddress = game.address;
    console.log(`Game contract deployed at: ${gameAddress}`);

   
    console.log("All contracts deployed successfully");
    
    
    console.log("Setting up initial configurations...");

}


// Run the script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);

    });