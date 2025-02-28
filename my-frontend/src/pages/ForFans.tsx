import { useState } from 'react';
import { Wallet, Users, Gift, Ticket } from 'lucide-react';
import { Navbar } from '../components/Navbar';

const Fans = () => {
  const [activeTab, setActiveTab] = useState('wallet');
  
  const renderTabContent = () => {
    switch(activeTab) {
      case 'creators':
        return <CreatorInteractions />;
      case 'rewards':
        return <RewardsRedemptions />;
      case 'wallet':
      default:
        return <WalletOverview />;
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="container mx-auto p-4">
        <div className="flex flex-wrap gap-4 mb-6">
          <h2 className="text-2xl font-bold">For Fans</h2>
          <div className="ml-auto flex gap-2">
            <button 
              onClick={() => setActiveTab('wallet')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'wallet' ? 'bg-teal-500' : 'hover:bg-indigo-700'} transition`}
            >
              <Wallet className="h-4 w-4" />
              Wallet
            </button>
            <button 
              onClick={() => setActiveTab('creators')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'creators' ? 'bg-teal-500' : 'hover:bg-indigo-700'} transition`}
            >
              <Users className="h-4 w-4" />
              Creators
            </button>
            <button 
              onClick={() => setActiveTab('rewards')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'rewards' ? 'bg-teal-500' : 'hover:bg-indigo-700'} transition`}
            >
              <Gift className="h-4 w-4" />
              Rewards
            </button>
          </div>
        </div>
        
        {renderTabContent()}
      </div>
    </>
  );
};


const WalletOverview = () => {
  // Sample data
  const ownedNFTs = [
    { id: 1, name: "Cosmic Dream #3", creator: "ArtisticMind", img: "purple" },
    { id: 2, name: "Digital Landscape", creator: "PixelPioneer", img: "blue" },
    { id: 3, name: "Abstract Emotion", creator: "EmotiveArt", img: "teal" }
  ];
  
  const ownedTokens = [
    { creator: "ArtisticMind", name: "ArtM", amount: 145, perks: 3 },
    { creator: "MusicMaestro", name: "MUSIC", amount: 230, perks: 2 },
    { creator: "DigitalDesigner", name: "DDS", amount: 75, perks: 1 }
  ];
  
  const tokenUsage = [
    { name: "Exclusive Stream", creator: "MusicMaestro", cost: "25 MUSIC", date: "Mar 12" },
    { name: "Art Tutorial", creator: "ArtisticMind", cost: "15 ArtM", date: "Feb 24" },
    { name: "Private Q&A", creator: "DigitalDesigner", cost: "50 DDS", date: "Jan 30" }
  ];
  
  return (
    <div className="space-y-6">
      {/* NFT Gallery */}
      <div className=" bg-opacity-50 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Your NFT Collection</h3>
          <button className=" text-sm">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ownedNFTs.map(nft => (
            <div key={nft.id} className=" bg-opacity-50 rounded-lg overflow-hidden">
              <div className={`h-48 bg-${nft.img}-500 bg-opacity-30 flex items-center justify-center`}>
                <div className={`h-32 w-32 rounded-lg bg-${nft.img}-500 bg-opacity-70`}></div>
              </div>
              <div className="p-4">
                <h4 className="font-medium">{nft.name}</h4>
                <p className="text-sm text-indigo-300">By {nft.creator}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Token Holdings */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className=" bg-opacity-50 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">Your Tokens</h3>
          
          <div className="space-y-4">
            {ownedTokens.map((token, idx) => (
              <div key={idx} className=" bg-opacity-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full  flex items-center justify-center">
                      <span className="font-bold text-xs">{token.name.substring(0, 2)}</span>
                    </div>
                    <div>
                      <div className="font-medium">{token.name}</div>
                      <div className="text-sm text-indigo-300">By {token.creator}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl">{token.amount}</div>
                    <div className="text-sm text-indigo-300">{token.perks} perks available</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 border border-teal-700 text-teal-700 rounded-lg hover:bg-teal-700 hover:text-white transition">
            Buy More Tokens
          </button>
        </div>
        
        {/* Token Usage History */}
        <div className="-bg-opacity-50 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">Recent Redemptions</h3>
          
          <div className="divide-y">
            {tokenUsage.map((usage, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{usage.name}</div>
                    <div className="text-sm text-indigo-300">By {usage.creator}</div>
                  </div>
                  <div className="text-right">
                    <div>{usage.cost}</div>
                    <div className="text-sm text-indigo-300">{usage.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 rounded-lg hover:bg-indigo-600 transition">
            View All History
          </button>
        </div>
      </div>
    </div>
  );
};

// Creator Interactions Component
const CreatorInteractions = () => {
  // Sample data
  const followedCreators = [
    { name: "ArtisticMind", type: "Visual Artist", tier: "Gold", img: "purple" },
    { name: "MusicMaestro", type: "Music Producer", tier: "Silver", img: "blue" },
    { name: "DigitalDesigner", type: "UI/UX Designer", tier: "Bronze", img: "teal" },
    { name: "StoryTeller", type: "Author", tier: "Gold", img: "indigo" }
  ];
  
  const purchasedContent = [
    { name: "Premium Tutorial Series", creator: "ArtisticMind", type: "Video Course", date: "Feb 18" },
    { name: "Exclusive Beat Pack", creator: "MusicMaestro", type: "Audio Files", date: "Feb 10" },
    { name: "Design System Templates", creator: "DigitalDesigner", type: "Template Pack", date: "Jan 25" }
  ];
  
  return (
    <div className="space-y-6">
      {/* Followed Creators */}
      <div className="bg-opacity-50 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Creators You Follow</h3>
          <button className="text-teal-700 text-sm">Discover More</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {followedCreators.map((creator, idx) => (
            <div key={idx} className=" bg-opacity-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-12 w-12 rounded-full bg-${creator.img}-600`}></div>
                <div>
                  <div className="font-medium">{creator.name}</div>
                  <div className="text-xs text-indigo-300">{creator.type}</div>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Member Tier:</span>
                <span className={`${creator.tier === 'Gold' ? 'text-yellow-400' : creator.tier === 'Silver' ? 'text-gray-300' : 'text-amber-600'}`}>
                  {creator.tier}
                </span>
              </div>
              <button className="w-full mt-3 py-2 text-sm  rounded-lg hover:bg-indigo-600 transition">
                View Page
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Purchased Content */}
      <div className=" bg-opacity-50 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Your Purchased Content</h3>
        
        <div className="overflow-hidden">
          <table className="min-w-full divide-y">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Content</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Creator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-indigo-300 uppercase tracking-wider">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-600">
              {purchasedContent.map((content, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap">{content.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{content.creator}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{content.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{content.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="px-3 py-1 bg-teal-500 text-xs rounded hover:bg-teal-600 transition">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-indigo-300">Showing 3 of 12 items</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-purple-600 rounded hover:bg-indigo-600 transition">Previous</button>
            <button className="px-3 py-1 bg-purple-600 rounded hover:bg-indigo-600 transition">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Rewards & Redemptions Component
const RewardsRedemptions = () => {
  // Sample data
  const upcomingEvents = [
    { 
      name: "Virtual Concert", 
      creator: "MusicMaestro", 
      date: "Mar 15, 2025 • 8:00 PM",
      description: "Live streaming concert with exclusive fan Q&A session afterward.",
      tokenCost: "50 MUSIC"
    },
    { 
      name: "Digital Art Workshop", 
      creator: "ArtisticMind", 
      date: "Mar 22, 2025 • 3:00 PM",
      description: "Learn advanced digital painting techniques in this interactive workshop.",
      tokenCost: "75 ArtM"
    }
  ];
  
  const exclusiveContent = [
    { 
      name: "Behind The Scenes", 
      creator: "MusicMaestro", 
      description: "Exclusive studio footage and creative process insights.",
      tokenCost: "25 MUSIC" 
    },
    { 
      name: "Art Collection Preview", 
      creator: "ArtisticMind", 
      description: "Early access to upcoming NFT collection with creator commentary.",
      tokenCost: "30 ArtM" 
    },
    { 
      name: "Design Templates", 
      creator: "DigitalDesigner", 
      description: "Professional UI/UX templates bundle with source files.",
      tokenCost: "45 DDS" 
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* QR Codes for Events */}
      <div className="bg-opacity-50 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Upcoming Events</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {upcomingEvents.map((event, idx) => (
            <div key={idx} className="bg-opacity-50 rounded-lg overflow-hidden">
              <div className="p-4 border-b ">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-lg">{event.name}</h4>
                    <p className="text-indigo-300 text-sm">by {event.creator}</p>
                  </div>
                  <div className="py-1 px-3 bg-teal-500 bg-opacity-20 text-teal-300 rounded text-sm">
                    {event.tokenCost}
                  </div>
                </div>
                <p className="text-sm mt-2">{event.description}</p>
                <div className="mt-3 text-sm text-indigo-300 flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  {event.date}
                </div>
              </div>
              <div className="p-6 flex items-center justify-center bg-opacity-50">
                <div className="h-48 w-48 bg-white p-2 rounded">
                  <div className="h-full w-full  flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xs mb-2">Scan to attend</p>
                      <div className="grid grid-cols-5 grid-rows-5 gap-1 mx-auto w-32 h-32">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 flex justify-end gap-2">
                <button className="px-4 py-2 text-teal-400 hover:text-teal-300 transition">Add to Calendar</button>
                <button className="px-4 py-2 bg-teal-500 rounded hover:bg-teal-600 transition">Attend Event</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Exclusive Content Access */}
      <div className=" bg-opacity-50 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Exclusive Content</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          {exclusiveContent.map((content, idx) => (
            <div key={idx} className=" bg-opacity-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{content.name}</h4>
                <div className="py-1 px-2 bg-indigo-700 rounded text-xs">
                  {content.tokenCost}
                </div>
              </div>
              <p className="text-sm text-indigo-300 mb-3">{content.description}</p>
              <div className="text-xs text-indigo-400 mb-4">By {content.creator}</div>
              <div className="flex justify-end">
                <button className="px-3 py-1.5 bg-teal-500 rounded text-sm hover:bg-teal-600 transition">
                  Unlock Access
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Your Rewards */}
      <div className=" bg-opacity-50 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Your Token Benefits</h3>
        
        <div className="space-y-4">
          <div className=" bg-opacity-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-xs">AM</span>
                </div>
                <div>
                  <div className="font-medium">ArtisticMind Tokens</div>
                  <div className="text-sm text-indigo-300">145 tokens • Gold tier</div>
                </div>
              </div>
              <div className="text-right">
                <div className="py-1 px-2 bg-yellow-400 text-yellow-900 rounded text-xs font-medium">
                  Gold Benefits
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm">Monthly Art Drops</div>
                <div className="text-sm text-indigo-300">No cost</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">Private Discord Access</div>
                <div className="text-sm text-indigo-300">No cost</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">1-on-1 Session</div>
                <div className="text-sm text-indigo-300">100 ArtM/hour</div>
              </div>
            </div>
          </div>
          
          <div className=" bg-opacity-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-700 flex items-center justify-center">
                  <span className="font-bold text-xs">MM</span>
                </div>
                <div>
                  <div className="font-medium">MusicMaestro Tokens</div>
                  <div className="text-sm text-indigo-300">230 tokens • Silver tier</div>
                </div>
              </div>
              <div className="text-right">
                <div className="py-1 px-2 bg-gray-300 text-gray-700 rounded text-xs font-medium">
                  Silver Benefits
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm">Unreleased Tracks</div>
                <div className="text-sm text-indigo-300">25 MUSIC/month</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">Livestream Access</div>
                <div className="text-sm text-indigo-300">50 MUSIC/event</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">Voting Rights</div>
                <div className="text-sm text-indigo-300">No cost</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fans;