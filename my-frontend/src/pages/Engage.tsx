import { useState } from "react";
import { useWriteContract } from "wagmi";
import { Award, Gift, Trophy } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Wheel } from "../components/Wheel";

// Use a proper hex address format for Ethereum addresses
const CONTRACT_ADDRESS = "0xE4a12B9346Da81A25620479dABc89364dc1529f9"; // Replace with your actual contract address
const ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_rewardToken",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rewardAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "randomValue",
        "type": "uint256"
      }
    ],
    "name": "SpinResult",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardToken",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "spinWheel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const segments = ["50 Tokens", "100 Tokens", "250 Tokens", "500 Tokens", "1000 Tokens", "Try Again"];
const segColors = ["#EE4040", "#F0CF50", "#815CD1", "#3DA5E0", "#34A24F", "#E87E04"];

export default function Engage() {
  const [activeTab, setActiveTab] = useState<'games' | 'airdrops'>('games');
  const [result, setResult] = useState<string | null>(null);

  // Update useWriteContract according to wagmi's API
  const { writeContractAsync } = useWriteContract();

  const handleSpinWheel = async () => {
    try {
      const data = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: "spinWheel",
        args: [],
      });
      if (data) {
        setResult(`${data.toString()} Tokens`);
      }
    } catch (error: unknown) {
      console.error("Error spinning wheel:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen text-white ">
        {/* Reduce padding-top (pt) from pt-24 to pt-8 to decrease the space */}
        <main className="container mx-auto px-4 pt-8">
          <section className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold neon-text">
              Engage & Earn
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Participate in games and competitions to earn exclusive rewards and airdrops
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border">
              <div className="flex items-center space-x-4">
                <Trophy className="text-neon-cyan" size={24} />
                <div>
                  <h3 className="text-lg font-semibold">Active Games</h3>
                  <p className="text-2xl font-bold text-neon-cyan">12</p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border">
              <div className="flex items-center space-x-4">
                <Gift className="text-neon-pink" size={24} />
                <div>
                  <h3 className="text-lg font-semibold">Available Airdrops</h3>
                  <p className="text-2xl font-bold text-neon-pink">5</p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border"> 
              <div className="flex items-center space-x-4">
                <Award className="text-neon-blue" size={24} />
                <div>
                  <h3 className="text-lg font-semibold">Your Rewards</h3>
                  <p className="text-2xl font-bold text-neon-blue">2,500</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              className={`px-6 py-2 rounded-lg transition-colors ${
                activeTab === 'games'
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan'
                  : 'text-gray-400 hover:text-neon-cyan'
              }`}
              onClick={() => setActiveTab('games')}
            >
              Active Games
            </button>
            <button
              className={`px-6 py-2 rounded-lg transition-colors ${
                activeTab === 'airdrops'
                  ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink'
                  : 'text-gray-400 hover:text-neon-pink'
              }`}
              onClick={() => setActiveTab('airdrops')}
            >
              Available Airdrops
            </button>
          </div>

          {activeTab === 'games' && (
            <div className="flex flex-col items-center p-6">
              <h2 className="text-3xl font-bold">Spin The Wheel</h2>
              <Wheel
                segments={segments}
                segColors={segColors}
                onFinished={(winner: string) => setResult(winner)}
                primaryColor="black"
                contrastColor="white"
                buttonText="SPIN"
                isOnlyOnce={false}
                size={200}
                onSpin={handleSpinWheel}
              />
              {result !== null && (
                <p className="mt-4 text-lg">You won: {result}!</p>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}