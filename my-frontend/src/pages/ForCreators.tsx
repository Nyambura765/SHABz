import { useState } from 'react';
import { BarChart, LineChart } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { createToken, addTier, getTokenAddress } from '../BlockchainServices/ShabzHooks';

interface FormValues {
  name: string;
  symbol: string;
  tierName: string;
  tierId: string;
  price: number;
  maxSupply: number;
  token: string;
}

const CreatorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const renderTabContent = () => {
    switch(activeTab) {
      case 'token':
        return <TokenCreationForm />;
      case 'nft':
        return <NFTMintingForm />;
      case 'dashboard':
      default:
        return <CreatorDashboardContent />;
    }
  };

  return (
    <>
    <Navbar />
    <div className="container mx-auto p-4">
        <div className="flex flex-wrap gap-4 mb-6">
          <h2 className="text-2xl font-bold">For Creators</h2>
          <div className="ml-auto flex gap-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-teal-700' : 'hover:bg-purple-600'} transition`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('token')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'token' ? 'bg-teal-700' : 'hover:bg-purple-600'} transition`}
            >
              Create Token
            </button>
            <button 
              onClick={() => setActiveTab('nft')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'nft' ? 'bg-teal-700' : 'hover:bg-purple-600'} transition`}
            >
              Mint NFT
            </button>
          </div>
        </div>
        
        {renderTabContent()}
      </div>
    </>
  );
};

// Token Creation Form Component
const TokenCreationForm = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    symbol: '',
    tier: 'gold',
    price: 0,
    initialSupply: 0,
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle uppercase for symbol field
    if (name === 'symbol') {
      setFormValues({
        ...formValues,
        [name]: value.toUpperCase()
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const createHash = await createToken(formValues.name, formValues.symbol)

      if (createHash) {
         const address=await getTokenAddress();
        const addTierHash = await addTier(formValues.tierName, formValues.tierId, formValues.token, formValues.price, formValues.maxSupply);
        if (addTierHash) {
          alert('Token and Tier created successfully!');
        }
      }
        
    } catch (error) {
      console.error(`error: ${error}`);
      if (error instanceof Error) {
        alert(`Failed to create token: ${error.message}`);
      } else {
        alert('Failed to create token: Unknown error');
      }
      throw error;
    }
  }

  return (
    <div className=" bg-opacity-50 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-6">Token Creation</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Name of the Token</label>
              <input 
                type="text" 
                name="name"
                value={formValues.name}
                onChange={handleChange}
                required
                maxLength={250} 
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-700 focus:border-transparent" 
                placeholder="e.g. Creative Coin"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Symbol</label>
              <input 
                type="text" 
                name='symbol'
                value={formValues.symbol}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-700 focus:border-transparent" 
                placeholder="e.g. CTK"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">Tier</label>
              <select 
                name='tier' 
                value={formValues.tier}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-700 focus:border-transparent"
              >
                <option value='gold'>Gold</option>
                <option value='silver'>Silver</option>
                <option value='bronze'>Bronze</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">Price (ETH)</label>
              <input 
                type="number" 
                name='price'
                value={formValues.price}
                onChange={handleChange}
                required
                min={0.001}
                step={0.001}
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-700 focus:border-transparent" 
                placeholder="e.g. 0.05"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">Initial Supply</label>
              <input 
                type="number" 
                name='initialSupply'
                value={formValues.initialSupply}
                onChange={handleChange}
                min={10}
                max={1000000}
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-700 focus:border-transparent" 
                placeholder="e.g. 1,000,000"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button type="submit" className="px-6 py-3 bg-teal-700 font-medium rounded-lg hover:bg-teal-700 transition">
            Create Token
          </button>
        </div>
      </form>
    </div>
    
  );
};

// NFT Minting Form Component
const NFTMintingForm = () => {
  return (
    <div className=" bg-opacity-50 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-6">NFT Minting</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="mb-2">Drag and drop artwork here</p>
            <p className="text-xs text-indigo-300 mb-4">Supports JPG, PNG, GIF, SVG, MP4</p>
            <button className="px-4 py-2 bg-teal-700 rounded-lg text-sm">
              Browse Files
            </button>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Price (ETH)</label>
            <input 
              type="number" 
              className="w-full p-3  rounded-lg border  focus:ring-2 focus:ring-teal-700 focus:border-transparent" 
              placeholder="e.g. 0.05"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Royalties (%)</label>
            <input 
              type="number" 
              className="w-full p-3 rounded-lg border  focus:ring-2 focus:ring-teal-700 focus:border-transparent" 
              placeholder="e.g. 10"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Title</label>
            <input 
              type="text" 
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-700 focus:border-transparent" 
              placeholder="e.g. Cosmic Dreamer #1"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Description</label>
            <textarea 
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-700 focus:border-transparent h-32" 
              placeholder="Describe your NFT..."
            ></textarea>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Properties & Metadata</label>
            <div className="flex gap-2 mb-2">
              <input 
                type="text" 
                className="flex-1 p-3 rounded-lg border " 
                placeholder="Property"
              />
              <input 
                type="text" 
                className="flex-1 p-3 rounded-lg border " 
                placeholder="Value"
              />
            </div>
            <button className="text-sm text-teal-400 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Property
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button className="px-6 py-3 bg-teal-500 font-medium rounded-lg hover:bg-teal-700 transition">
          Mint NFT
        </button>
      </div>
    </div>
  );
};

// Dashboard Content Component
const CreatorDashboardContent = () => {
  // Mock data
  const earnings = {
    nftSales: 3.25,
    tokenSales: 1.85,
    royalties: 0.45,
    total: 5.55
  };
  
  const holders = {
    tokens: 427,
    nfts: 89
  };
  
  const monthlyEarnings = [
    { month: "Jan", amount: 0.8 },
    { month: "Feb", amount: 1.2 },
    { month: "Mar", amount: 0.9 },
    { month: "Apr", amount: 1.6 },
    { month: "May", amount: 2.3 },
    { month: "Jun", amount: 5.55 }
  ];
  
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className=" bg-opacity-50 rounded-xl p-6 shadow-lg">
          <h4 className="text-indigo-300 text-sm font-medium mb-2">Total Earnings</h4>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{earnings.total} ETH</span>
            <span className="text-teal-700 text-sm">+12.5%</span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>NFT Sales</span>
              <span>{earnings.nftSales} ETH</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Token Sales</span>
              <span>{earnings.tokenSales} ETH</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Royalties</span>
              <span>{earnings.royalties} ETH</span>
            </div>
          </div>
          <button className="w-full mt-6 px-4 py-2 bg-white text-teal-700 rounded-lg text-sm">
            Withdraw Funds
          </button>
        </div>
        
        <div className=" bg-opacity-50 shadow-md rounded-xl p-6 ">
          <h4 className="text-indigo-300 text-sm font-medium mb-2">Community</h4>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{holders.tokens + holders.nfts}</span>
            <span className="text-sm">Total Holders</span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Token Holders</span>
              <span>{holders.tokens}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>NFT Owners</span>
              <span>{holders.nfts}</span>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center h-16">
            <div className="w-full h-2 rounded-full">
              <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${(holders.nfts / (holders.tokens + holders.nfts) * 100)}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className= "bg-opacity-50 rounded-xl p-6 shadow-lg">
          <h4 className="text-indigo-300 text-sm font-medium mb-2">Recent Activity</h4>
          <div className="space-y-4 mt-4">
            {[
              { type: 'NFT Sale', item: 'Cosmic Dream #3', amount: '0.25 ETH', time: '2h ago' },
              { type: 'Token Purchase', item: '150 Tokens', amount: '0.15 ETH', time: '5h ago' },
              { type: 'Royalty', item: 'Astral Journey #1', amount: '0.03 ETH', time: '1d ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">{activity.type}</div>
                  <div className="text-indigo-300">{activity.item}</div>
                </div>
                <div className="text-right">
                  <div>{activity.amount}</div>
                  <div className="text-indigo-300">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 px-4 py-2 border border-teal-700 text-teal-500 rounded-lg text-sm hover:bg-teal-700 hover:text-white transition">
            View All
          </button>
        </div>
      </div>
      
      {/* Charts and Analytics */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-opacity-50 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold">Monthly Earnings</h4>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-purple-600">
                <LineChart className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-lg bg-purple-600">
                <BarChart className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="h-64 flex items-end">
            {monthlyEarnings.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full max-w-12 mx-2 bg-teal-500 rounded-t-lg"
                  style={{ height: `${(item.amount / Math.max(...monthlyEarnings.map(e => e.amount))) * 180}px` }}
                ></div>
                <div className="text-xs mt-2">{item.month}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className=" bg-opacity-50 rounded-xl p-6 shadow-lg">
          <h4 className="font-bold mb-6">Token Distribution</h4>
          <div className="flex justify-center">
            <div className="relative h-48 w-48">
              <div className="absolute inset-0 rounded-full border-8 border-teal-700 border-r-indigo-500 border-b-purple-500"></div>
              <div className="absolute inset-4 rounded-full border-8 border-transparent border-t-indigo-300"></div>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold">62%</span>
                <span className="text-xs text-indigo-300">In Circulation</span>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-teal-700"></div>
              <div className="flex justify-between w-full text-sm">
                <span>Creator Owned</span>
                <span>38%</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
              <div className="flex justify-between w-full text-sm">
                <span>Community</span>
                <span>42%</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-purple-500"></div>
              <div className="flex justify-between w-full text-sm">
                <span>Reserved</span>
                <span>20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;