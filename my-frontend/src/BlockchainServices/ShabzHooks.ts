import { createPublicClient, createWalletClient, custom, http,  } from "viem";
import { contractAbiShabzPlatform, contractAddressShabzPlatform, contractAbiPaymentEscrow, contractAddressPaymentEscrow,contractAbiTokenManager, contractAddressTokenManager, contractAddressNFTMarketplace, contractAbiNFTMarketplace } from "./core";
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
        const { address, walletClient } = await getWalletClient();

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
        throw new Error(`Failed to register user --> ${error}`)
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
        throw new Error('Failed to register creator')
    }
}

export async function checkPersona() {
   
    try {
        const { address} = await getWalletClient();

        const { request } = await publicClient.simulateContract({
            address: contractAddressShabzPlatform,
            abi: contractAbiShabzPlatform,
            functionName: 'isUserOrCreator',
            args: [],
            account: address
        })

        const persona = await publicClient.readContract(request)

        return persona
    } catch (error) {
        console.error(`error fetch persona----->: ${error}`)
        throw new Error('Failed to fetch persona!!')
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

// Create token
// Create token and wait for confirmation
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
        
        const receipt = await publicClient.waitForTransactionReceipt({ hash })
        
        // Now that the transaction is confirmed, get the token address
        const tokenAddress = await getTokenAddress()
        
        return { hash ,receipt, tokenAddress }
    } catch (error) {
        console.error(`error----->: ${error}`)
        alert(`ERROR: ${error}`)
        throw new Error('Failed to create token')
    }
}

//get token address
export async function getTokenAddress() {
    try {
        const {address} = await getWalletClient();

        const tokenAddress = await publicClient.readContract({
            address: contractAddressTokenManager,
            abi: contractAbiTokenManager,
            functionName: 'getTokenAddress',
            args: [address],
            account: address
        })

        return tokenAddress
    } catch (error) {
        console.error(`error----->: ${error}`)
        alert(`ERROR: ${error}`)
        throw new Error('Failed to get token address')
    }
}

//get token balance
export async function getTokenBalance() {
    try {
        const {address} = await getWalletClient();

        const balance = await publicClient.readContract({
            address: contractAddressTokenManager,
            abi: contractAbiTokenManager,
            functionName: 'balanceOf',
            args: [address],
            account: address
        })

        return balance
    } catch (error) {
        console.error(`error----->: ${error}`)
        alert(`ERROR: ${error}`)
        throw new Error('Failed to get token balance')
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

export async function buyNFT(tokenId: bigint) {
    try {
        const { address } = await getWalletClient();
        
        // Now execute the buyNFT transaction
        const { request } = await publicClient.simulateContract({
            address: contractAddressNFTMarketplace,
            abi: contractAbiNFTMarketplace,
            functionName: 'buyNFT',
            args: [tokenId],
            account: address,
        });
        
        const { walletClient } = await getWalletClient();
        const txHash = await walletClient.writeContract(request);
        
        console.log('Transaction sent:', txHash);
        
        // Wait for transaction confirmation
        const receipt = await publicClient.waitForTransactionReceipt({ 
            hash: txHash 
        });
        
        console.log('NFT purchase confirmed:', receipt.transactionHash);
        return {
            txHash
        };
    } catch (error) {
        console.error(`error----->: ${error}`);
        alert(`ERROR: ${error}`);
        throw new Error('Failed to buy NFT');
    }
}

export async function purchaseTokens(
    token: `0x${string}`,
    tierId: bigint, 
    amount: bigint
  ) {
    try {
      const { address } = await getWalletClient();
      
      // Get tier information first
      const tierInfo = await publicClient.readContract({
        address: contractAddressTokenManager,
        abi: contractAbiTokenManager,
        functionName: 'tokenTiers',
        args: [token, tierId],
      }) as { supply: bigint, isActive: boolean, price: bigint };
      
      // Check if tier exists and is active
      if (!tierInfo.supply || tierInfo.supply === BigInt(0)) {
        throw new Error('Tier does not exist');
      }
      
      if (!tierInfo.isActive) {
        throw new Error('Tier is not active for purchase');
      }
      
      // Calculate total cost
      const totalCost = tierInfo.price * amount;
      
      // Check if there's enough supply left
      const currentMinted = await publicClient.readContract({
        address: contractAddressTokenManager,
        abi: contractAbiTokenManager,
        functionName: 'getTierMinted',
        args: [token, tierId],
      }) as bigint;
      
      if (currentMinted + amount > tierInfo.supply) {
        throw new Error('Exceeds tier supply');
      }
      
      // Simulate the transaction
      const { request } = await publicClient.simulateContract({
        address: contractAddressTokenManager,
        abi: contractAbiTokenManager,
        functionName: 'purchaseTokens',
        args: [token, tierId, amount],
        account: address,
        value: totalCost,
      });
      
      // Send the transaction
      const { walletClient } = await getWalletClient();
      const txHash = await walletClient.writeContract(request);
      
      console.log('Transaction sent:', txHash);
      
      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ 
        hash: txHash 
      });
      
      console.log('Token purchase confirmed:', receipt.transactionHash);
      return {
        txHash,
        totalCost,
        amount
      };
    } catch (error) {
      console.error(`error----->: ${error}`);
      alert(`ERROR: ${error}`);
      throw new Error('Failed to purchase tokens');
    }
  }