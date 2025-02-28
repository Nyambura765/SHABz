import { createPublicClient, createWalletClient, custom, http,  } from "viem";
import { contractAbiShabzPlatform, contractAddressShabzPlatform, contractAbiNFT, contractAddressNFT, contractAbiNFTMarketplace, contractAddressNFTMarketplace, contractAbiPaymentEscrow, contractAddressPaymentEscrow, contractAbiTokenManager, contractAddressTokenManager,contractAbi, contractAddress } from "./core";
import { liskSepolia } from 'viem/chains'



//set up public cient
export const publicClient = createPublicClient({
    chain: liskSepolia,
    transport: http(`${import.meta.env.VITE_LISK_RPC_URL}`)
});

//get the wallet client using browser wallet
export async function getWalletClient() {
    if(!window.ethereum) {
        throw new Error('Please install MetaMask or another web3 wallet');
    }

    const walletClient = createWalletClient({
        chain: liskSepolia,
        transport: custom(window.ethereum)
    })

    const [address] = await walletClient.requestAddresses(); 
    console.log('Connected Address: ', address)

    return {walletClient, address}
}

//Register users  hooks
export async function registerUser() {
    try {
        const {walletClient, address} = await getWalletClient();

        const { request } = await publicClient.simulateContract({
            address: contractAddressShabzPlatform,
            abi: contractAbiShabzPlatform,
            functionName: 'registerUser',
            args: [],
            account: address
        })

        const hash = await walletClient.writeContract(request)

        return hash
    } catch (error) {
        console.error(`error----->: ${error}`)
        alert(`ERROR: ${error}`)
        throw new Error('Failed to register user')
    }
}
export async function registerCreator() {
    try {
        const {walletClient, address} = await getWalletClient();

        const { request } = await publicClient.simulateContract({
            address: contractAddressShabzPlatform,
            abi: contractAbiShabzPlatform,
            functionName: 'registerCreator',
            args: [],
            account: address
        })

        const hash = await walletClient.writeContract(request)

        return hash
    } catch (error) {
        console.error(`error----->: ${error}`)
        alert(`ERROR: ${error}`)
        throw new Error('Failed to register creator')
    }
}
//Mint NFT hooks
export async function mintNFT(tokenURI: string) {
    try {
        const {walletClient, address} = await getWalletClient();

        const { request } = await publicClient.simulateContract({
            address: contractAddressNFT,
            abi: contractAbiNFT,
            functionName: 'mint',
            args: [tokenURI],
            account: address
        })

        const hash = await walletClient.writeContract(request)

        return hash
    } catch (error) {
        console.error(`error----->: ${error}`)
        alert(`ERROR: ${error}`)
        throw new Error('Failed to mint NFT')
    }
}
//list NFTs
export async function listNFT(tokenId: number, price: string) {
    try {
        const {walletClient, address} = await getWalletClient();

        const { request } = await publicClient.simulateContract({
            address: contractAddressNFTMarketplace,
            abi: contractAbiNFTMarketplace,
            functionName: 'list',
            args: [tokenId, price],
            account: address
        })

        const hash = await walletClient.writeContract(request)

        return hash
    } catch (error) {
        console.error(`error----->: ${error}`)
        alert(`ERROR: ${error}`)
        throw new Error('Failed to list NFT')
    }
}
//buy NFTs
export async function buyNFT(tokenId: number) {
    try {
        const {walletClient, address} = await getWalletClient();

        const { request } = await publicClient.simulateContract({
            address: contractAddressNFTMarketplace,
            abi: contractAbiNFTMarketplace,
            functionName: 'buy',
            args: [tokenId],
            account: address
        })

        const hash = await walletClient.writeContract(request)

        return hash
    } catch (error) {
        console.error(`error----->: ${error}`)
        alert(`ERROR: ${error}`)
        throw new Error('Failed to buy NFT')
    }
}
//withdraw funds
export async function withdrawFunds() {
    try {
        const {walletClient, address} = await getWalletClient();

        const { request } = await publicClient.simulateContract({
            address: contractAddressPaymentEscrow,
            abi: contractAbiPaymentEscrow,
            functionName: 'withdraw',
            args: [],
            account: address
        })

        const hash = await walletClient.writeContract(request)

        return hash
    } catch (error) {
        console.error(`error----->: ${error}`)
        alert(`ERROR: ${error}`)
        throw new Error('Failed to withdraw funds')
    }
}
//deposit funds
export async function depositFunds(amount: string) {
    try {
        const {walletClient, address} = await getWalletClient();

        const { request } = await publicClient.simulateContract({
            address: contractAddressPaymentEscrow,
            abi: contractAbiPaymentEscrow,
            functionName: 'deposit',
            args: [amount],
            account: address
        })

        const hash = await walletClient.writeContract(request)

        return hash
    } catch (error) {
        console.error(`error----->: ${error}`)
        alert(`ERROR: ${error}`)
        throw new Error('Failed to deposit funds')
    }
}
// Create token
export async function createToken(name: string, symbol: string) {
    try {
        const {walletClient, address} = await getWalletClient();

        const { request } = await publicClient.simulateContract({
            address: contractAddressTokenManager,
            abi: contractAbiTokenManager,
            functionName: 'createToken',
            args: [name, symbol],
            account: address
        })

        const hash = await walletClient.writeContract(request)

        return hash
    } catch (error) {
        console.error(`error----->: ${error}`)
        alert(`ERROR: ${error}`)
        throw new Error('Failed to create token')
    }
}
//transfer token
export async function transferToken(to: string, amount: string) {
    try {
        const {walletClient, address} = await getWalletClient();

        const { request } = await publicClient.simulateContract({
            address: contractAddressTokenManager,
            abi: contractAbiTokenManager,
            functionName: 'transfer',
            args: [to, amount],
            account: address
        })

        const hash = await walletClient.writeContract(request)

        return hash
    } catch (error) {
        console.error(`error----->: ${error}`)
        alert(`ERROR: ${error}`)
        throw new Error('Failed to transfer token')
    }

}
//get token balance
export async function getTokenBalance() {
    try {
        const {address} = await getWalletClient();

        const { request } = await publicClient.simulateContract({
            address: contractAddressTokenManager,
            abi: contractAbiTokenManager,
            functionName: 'balanceOf',
            args: [address],
            account: address
        })

        const balance = await publicClient.readContract(request)

        return balance
    } catch (error) {
        console.error(`error----->: ${error}`)
        alert(`ERROR: ${error}`)
        throw new Error('Failed to get token balance')
    }
}
//generate random number
export async function generateRandomNumber() {
    try {
        const {walletClient, address} = await getWalletClient();

        const { request } = await publicClient.simulateContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'generateRandomNumber',
            args: [],
            account: address
        })

        const randomNumber = await publicClient.readContract(request)

        return randomNumber
    } catch (error) {
        console.error(`error----->: ${error}`)
        alert(`ERROR: ${error}`)
        throw new Error('Failed to generate random number')
    }
}
//get token supply
export async function getTokenSupply() {
    try {
        const {address} = await getWalletClient();

        const { request } = await publicClient.simulateContract({
            address: contractAddressTokenManager,
            abi: contractAbiTokenManager,
            functionName: 'totalSupply',
            args: [],
            account: address
        })

        const supply = await publicClient.readContract(request)

        return supply
    } catch (error) {
        console.error(`error----->: ${error}`)
        alert(`ERROR: ${error}`)
        throw new Error('Failed to get token supply')
    }
}
//pay with ETH
export async function payWithETH(amount: string) {
    try {
        const {walletClient, address} = await getWalletClient();

        const { request } = await publicClient.simulateContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'payWithETH',
            args: [amount],
            account: address
        })

        const hash = await walletClient.writeContract(request)

        return hash
    } catch (error) {
        console.error(`error----->: ${error}`)
        alert(`ERROR: ${error}`)
        throw new Error('Failed to pay with ETH')
    }
}
//pay with stablecoin
export async function payWithStablecoin(amount: string) {
    try {
        const {walletClient, address} = await getWalletClient();

        const { request } = await publicClient.simulateContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'payWithStablecoin',
            args: [amount],
            account: address
        })

        const hash = await walletClient.writeContract(request)

        return hash
    } catch (error) {
        console.error(`error----->: ${error}`)
        alert(`ERROR: ${error}`)
        throw new Error('Failed to pay with stablecoin')
    }
}
//burn token
export async function burnToken(amount: string) {
    try {
        const {walletClient, address} = await getWalletClient();

        const { request } = await publicClient.simulateContract({
            address: contractAddressTokenManager,
            abi: contractAbiTokenManager,
            functionName: 'burn',
            args: [amount],
            account: address
        })

        const hash = await walletClient.writeContract(request)

        return hash
    } catch (error) {
        console.error(`error----->: ${error}`)
        alert(`ERROR: ${error}`)
        throw new Error('Failed to burn token')
    }
}
//get airdrop
export async function getAirdrop() {
    try {
        const {address} = await getWalletClient();

        const { request } = await publicClient.simulateContract({
            address: contractAddressTokenManager,
            abi: contractAbiTokenManager,
            functionName: 'airdrop',
            args: [],
            account: address
        })

        const hash = await publicClient.writeContract(request)

        return hash
    } catch (error) {
        console.error(`error----->: ${error}`)
        alert(`ERROR: ${error}`)
        throw new Error('Failed to get airdrop')
    }
}
//Add tier
export async function addTier(price: number, maxSupply: number, tierName: string, tierId: string, token: string) {
    try {
        const {walletClient, address} = await getWalletClient();

        const { request } = await publicClient.simulateContract({
            address: contractAddressTokenManager,
            abi: contractAbiTokenManager,
            functionName: 'addTier',
            args: [price, maxSupply, tierName, tierId, token],
            account: address
        })

        const hash = await walletClient.writeContract(request)

        return hash
    } catch (error) {
        console.error(`error----->: ${error}`)
        alert(`ERROR: ${error}`)
        throw new Error('Failed to add tier')
    }
}
//get token address
export async function getTokenAddress() {
    try {
        const {address} = await getWalletClient();

        const { request } = await publicClient.simulateContract({
            address: contractAddressTokenManager,
            abi: contractAbiTokenManager,
            functionName: 'token',
            args: [],
            account: address
        })

        const tokenAddress = await publicClient.readContract(request)

        return tokenAddress
    } catch (error) {
        console.error(`error----->: ${error}`)
        alert(`ERROR: ${error}`)
        throw new Error('Failed to get token address')
    }
}