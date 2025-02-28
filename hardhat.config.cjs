require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Load environment variables
require("@nomicfoundation/hardhat-verify");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545", 
  },

  'lisk-sepolia': {
      url: 'https://rpc.sepolia-api.lisk.com',
      accounts: [process.env.WALLET_KEY ],
      gasPrice: 1000000000,
    },
},
etherscan: {
  // Use "123" as a placeholder, because Blockscout doesn't need a real API key, and Hardhat will complain if this property isn't set.
  apiKey: {
    "lisk-sepolia": "123"
  },
  customChains: [
    {
        network: "lisk-sepolia",
        chainId: 4202,
        urls: {
            apiURL: "https://sepolia-blockscout.lisk.com/api",
            browserURL: "https://sepolia-blockscout.lisk.com"
        }
    }
  ]
},
sourcify: {
  enabled: false
},
};


