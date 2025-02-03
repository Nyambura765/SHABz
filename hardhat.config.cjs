require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Load environment variables

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545", 
  },
  
  sepolia: {
     url: process.env.SEPOLIA_RPC_URL || "", 
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [], 
    
  },
},
etherscan: {
  apiKey: process.env.ETHERSCAN_API_KEY, 
},
}

