import { useState } from 'react';
import { BarChart, LineChart } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { createToken } from '../BlockchainServices/ShabzHooks';

interface FormValues {
  name: string;
  symbol: string;
  goldPrice:string;
  goldSupply:string;
  silverPrice:string;
  silverSupply:string;
  bronzePrice:string;
  bronzeSupply:string;
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
    goldPrice: '',
    goldSupply: '',
    silverPrice: '',
    silverSupply: '',
    bronzePrice: '',
    bronzeSupply: ''
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
      //do operation
      const { receipt, tokenAddress } = await createToken(formValues.name, formValues.symbol)

      if(receipt){
        alert(`Deployed Successfully: ${receipt} Address: ${tokenAddress}`)
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
    <div className=" bg-opacity-50 rounded-xl p-6 shadow-lg grid place-items-center">
      <h3 className="text-xl font-bold mb-6">Token Creation</h3>
      <form onSubmit={handleSubmit} className='grid place-items-center'>
        <div className="shadow-sm shadow-teal-500 p-2 rounded-lg">
          <div className="space-y-4 grid place-items-center p-2">
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
            
            <div  className='grid grid-cols-1 md:grid-cols-3 gap-2'>
              <div>
                <h2>Gold</h2>
                <div>
                  <label className="block mb-2 text-sm font-medium">Supply</label>
                  <input 
                    type="text" 
                    name='goldSupply'
                    value={formValues.goldSupply}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-700 focus:border-transparent" 
                    placeholder="1000"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Price</label>
                  <input 
                    type="text" 
                    name='goldPrice'
                    value={formValues.goldPrice}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-700 focus:border-transparent" 
                    placeholder="0.1"
                    required
                  />
                </div>
              </div>
              <div>
                <h2>Silver</h2>
                <div>
                  <label className="block mb-2 text-sm font-medium">Supply</label>
                  <input 
                    type="text" 
                    name='silverSupply'
                    value={formValues.silverSupply}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-700 focus:border-transparent" 
                    placeholder="10000"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Price</label>
                  <input 
                    type="text" 
                    name='silverPrice'
                    value={formValues.silverPrice}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-700 focus:border-transparent" 
                    placeholder="0.01"
                    required
                  />
                </div>
              </div>
              <div>
                <h2>Bronze</h2>
                <div>
                  <label className="block mb-2 text-sm font-medium">Supply</label>
                  <input 
                    type="text" 
                    name='bronzeSupply'
                    value={formValues.bronzeSupply}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-700 focus:border-transparent" 
                    placeholder="100000"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Price</label>
                  <input 
                    type="text" 
                    name='bronzePrice'
                    value={formValues.bronzePrice}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-700 focus:border-transparent" 
                    placeholder="0.001"
                    required
                  />
                </div>
              </div>
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


const NFTMintingForm = () => {
  const [properties, setProperties] = useState([{ property: '', value: '' }]);
  
  const addProperty = () => {
    setProperties([...properties, { property: '', value: '' }]);
  };
  
  const handlePropertyChange = (index: number, field: 'property' | 'value', value: string) => {
    const updatedProperties = [...properties];
    updatedProperties[index][field] = value;
    setProperties(updatedProperties);
  };
  
  return (
    <form className=" bg-opacity-50 rounded-xl p-6 shadow-lg max-w-4xl mx-auto">
      <h3 className="text-xl font-bold mb-6">NFT Minting</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="mb-2">Drag and drop artwork here</p>
            <p className="text-xs text-gray-500 mb-4">Supports JPG, PNG, GIF, SVG, MP4</p>
            <label className="px-4 py-2 bg-teal-700 text-white rounded-lg text-sm cursor-pointer hover:bg-teal-800 transition">
              Browse Files
              <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.gif,.svg,.mp4" />
            </label>
          </div>
          
          <div>
            <label htmlFor="price" className="block mb-2 text-sm font-medium">Price (ETH)</label>
            <input 
              id="price"
              type="number" 
              min="0"
              step="0.001"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-700 focus:border-transparent" 
              placeholder="e.g. 0.05"
              required
            />
          </div>
          
          <div>
            <label htmlFor="royalties" className="block mb-2 text-sm font-medium">Royalties (%)</label>
            <input 
              id="royalties"
              type="number" 
              min="0"
              max="50"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-700 focus:border-transparent" 
              placeholder="e.g. 10"
              required
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block mb-2 text-sm font-medium">Title</label>
            <input 
              id="title"
              type="text" 
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-700 focus:border-transparent" 
              placeholder="e.g. Cosmic Dreamer #1"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block mb-2 text-sm font-medium">Description</label>
            <textarea 
              id="description"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-700 focus:border-transparent h-32" 
              placeholder="Describe your NFT..."
              required
            ></textarea>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Properties & Metadata</label>
            {properties.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  className="flex-1 p-3 rounded-lg border border-gray-300" 
                  placeholder="Property"
                  value={item.property}
                  onChange={(e) => handlePropertyChange(index, 'property', e.target.value)}
                />
                <input 
                  type="text" 
                  className="flex-1 p-3 rounded-lg border border-gray-300" 
                  placeholder="Value"
                  value={item.value}
                  onChange={(e) => handlePropertyChange(index, 'value', e.target.value)}
                />
              </div>
            ))}
            <button 
              type="button" 
              className="text-sm text-teal-600 flex items-center gap-1 hover:text-teal-800"
              onClick={addProperty}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Property
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button 
          type="submit"
          className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition"
        >
          Mint NFT
        </button>
      </div>
    </form>
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