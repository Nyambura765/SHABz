const ethers = require('ethers');

//  function to interact with a smart contract
exports.interactWithContract = async (contractAddress, abi, method, params) => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_NODE_URL);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    try {
        const result = await contract[method](...params);
        return result;
    } catch (error) {
        console.error('Error interacting with contract:', error);
        throw error;
    }
};