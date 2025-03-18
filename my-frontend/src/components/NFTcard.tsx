import React, { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, Heart, TrendingUp, Star } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { buyNFT } from "../BlockchainServices/ShabzHooks"; 
import RihImage from "../assets/Rih.jpg"; 
import IndigoImage from "../assets/Indigo.jpg";
import BigImage from "../assets/Big.jpg";
import ColeWorld from "../assets/ColeWorld.jpg";
import Havana from "../assets/Havana.jpg";

// Move types to separate file in a real application
interface NFT {
  id: number;
  name: string;
  price: string;
  image: string;
  creator: string;
  type: string;
  trending?: boolean;
  trendingRank?: number;
  volumeChange?: string;
  liked?: boolean;
}


const featuredNFTs: NFT[] = [
  {
    id: 1,
    name: "Cyber Punk #42",
    price: "2.30",
    image: RihImage, 
    creator: "CyberArtist",
    type: "NFT",
    trending: true,
    trendingRank: 1,
    volumeChange: "+45%"
  },
  {
    id: 2,
    name: "Neon Dreams",
    price: "1.85",
    image: IndigoImage, 
    creator: "DigitalDreamer",
    type: "NFT",
    trending: true,
    trendingRank: 3,
    volumeChange: "+21%"
  },
  {
    id: 3,
    name: "Virtual Realm #007",
    price: "3.20",
    image: BigImage, 
    creator: "MetaCreator",
    type: "NFT"
  },
  {
    id: 4,
    name: "Quantum Artifact",
    price: "5.45",
    image: ColeWorld, 
    creator: "FutureForge",
    type: "NFT",
    trending: true,
    trendingRank: 2,
    volumeChange: "+32%"
  },
];

// Mock recommended NFTs based on user behavior
const recommendedNFTs: NFT[] = [
  {
    id: 5,
    name: "Digital Genesis #12",
    price: "1.75",
    image: RihImage, 
    creator: "PixelPioneer",
    type: "NFT"
  },
  {
    id: 6,
    name: "Ethereal Pulse",
    price: "2.95",
    image: Havana, 
    creator: "DigitalDreamer",
    type: "NFT"
  },
  {
    id: 7,
    name: "Neon Horizon #3",
    price: "3.15",
    image: BigImage, 
    creator: "CyberArtist",
    type: "NFT"
  },
  {
    id: 8,
    name: "Synthetic Echo",
    price: "4.20",
    image: ColeWorld, 
    creator: "NeuralNomad",
    type: "NFT"
  },
];

// Search bar component with improved styling
const SearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  onSubmit 
}: { 
  searchQuery: string; 
  setSearchQuery: (query: string) => void; 
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <form onSubmit={onSubmit} className="max-w-2xl mx-auto relative">
      <input
        type="text"
        placeholder="Search NFTs, collections, creators..."
        className="w-full bg-gray-100 border border-purple-300 rounded-lg py-3 px-12 text-gray-800 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search NFTs"
      />
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500" aria-hidden="true" />
      {searchQuery && (
        <button
          type="button"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-500 hover:text-purple-700"
          onClick={() => setSearchQuery("")}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </form>
  );
};

// Trending NFT item component with enhanced visual appeal
const TrendingNFTItem = ({ nft }: { nft: NFT }) => {
  return (
    <div className="flex-shrink-0 w-64 mr-6 group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-300 to-blue-300 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500" />
      <div className="relative bg-white rounded-2xl p-4 h-full shadow-lg hover:shadow-purple-200 transition-all duration-300">
        <div className="absolute top-2 right-2 z-10">
          <div className="flex items-center bg-white/90 rounded-full px-2 py-1 shadow-sm">
            <TrendingUp size={12} className="text-green-600 mr-1" />
            <span className="text-xs text-green-600 font-bold">{nft.volumeChange}</span>
          </div>
        </div>
        <div className="absolute top-2 left-2 z-10">
          <div className="flex items-center bg-purple-500 rounded-full px-2 py-1">
            <span className="text-xs text-white font-bold">#{nft.trendingRank}</span>
          </div>
        </div>
        <div className="aspect-square rounded-lg overflow-hidden mb-4 ring-1 ring-purple-200">
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-800">{nft.name}</h3>
              <p className="text-sm text-purple-600">by {nft.creator}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-600 font-semibold">{nft.price} ETH</span>
            <button 
              className="p-1 text-gray-400 hover:text-pink-500 transition-colors focus:outline-none"
              aria-label={`Add ${nft.name} to favorites`}
            >
              <Heart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Single NFT card component with updated styling
const NFTItem = ({ 
  nft, 
  onBuyNow,
  isPurchasing 
}: { 
  nft: NFT; 
  onBuyNow: (nft: NFT) => Promise<void>;
  isPurchasing: Record<number, boolean>;
}) => {
  const isProcessing = isPurchasing[nft.id] || false;
  const [isLiked, setIsLiked] = useState(nft.liked || false);
  
  return (
    <div className="group relative transform hover:-translate-y-1 transition-all duration-300">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-300 to-blue-300 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500" />
      <div className="relative bg-white rounded-2xl p-4 h-full shadow-lg hover:shadow-purple-200 transition-all duration-300">
        <div className="aspect-square rounded-lg overflow-hidden mb-4 ring-1 ring-purple-200">
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-800">{nft.name}</h3>
              <p className="text-sm text-purple-600">by {nft.creator}</p>
            </div>
            <span className="px-2 py-1 bg-purple-100 rounded-full text-xs text-purple-700 border border-purple-200">
              {nft.type}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-600 font-semibold">{nft.price} ETH</span>
            <div className="flex space-x-2">
              <button 
                className="p-1 text-gray-400 hover:text-pink-500 transition-colors focus:outline-none"
                onClick={() => setIsLiked(!isLiked)}
                aria-label={`${isLiked ? 'Remove from' : 'Add to'} favorites`}
              >
                <Heart size={18} className={isLiked ? "fill-pink-500 text-pink-500" : ""} />
              </button>
              <button 
                className={`px-4 py-1 ${isProcessing ? 'bg-gray-300 border-gray-400 text-gray-600' : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white'} rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg`}
                onClick={() => onBuyNow(nft)}
                disabled={isProcessing}
                aria-label={`${isProcessing ? 'Processing...' : `Buy ${nft.name} for ${nft.price} ETH`}`}
              >
                {isProcessing ? 'Processing...' : 'Buy Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Recommended NFT component with enhanced styling
const RecommendedNFTItem = ({ nft }: { nft: NFT }) => {
  const [isLiked, setIsLiked] = useState(nft.liked || false);
  
  return (
    <div className="group relative transform hover:-translate-y-1 transition-all duration-300">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-300 to-pink-300 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500" />
      <div className="relative bg-white rounded-2xl p-4 h-full shadow-lg hover:shadow-pink-200 transition-all duration-300">
        <div className="absolute top-2 right-2 z-10">
          <span className="inline-flex items-center bg-yellow-100 rounded-full px-2 py-1 shadow-sm">
            <Star size={12} className="text-yellow-600 mr-1" />
            <span className="text-xs text-yellow-700 font-medium">Recommended</span>
          </span>
        </div>
        <div className="aspect-square rounded-lg overflow-hidden mb-4 ring-1 ring-pink-200">
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-800">{nft.name}</h3>
              <p className="text-sm text-purple-600">by {nft.creator}</p>
            </div>
            <span className="px-2 py-1 bg-purple-100 rounded-full text-xs text-purple-700 border border-purple-200">
              {nft.type}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-600 font-semibold">{nft.price} ETH</span>
            <div className="flex space-x-2">
              <button 
                className="p-1 text-gray-400 hover:text-pink-500 transition-colors focus:outline-none"
                onClick={() => setIsLiked(!isLiked)}
                aria-label={`${isLiked ? 'Remove from' : 'Add to'} favorites`}
              >
                <Heart size={18} className={isLiked ? "fill-pink-500 text-pink-500" : ""} />
              </button>
              <button 
                className="px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-full text-sm text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-lg"
                aria-label={`View ${nft.name} details`}
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Category Tabs component with improved styling
const CategoryTabs = ({ activeCategory, setActiveCategory }: {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}) => {
  const categories = ["All", "Art", "Collectibles", "Gaming", "Music", "Photography"];
  
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map(category => (
        <button
          key={category}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            activeCategory === category 
              ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200" 
              : "bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200"
          }`}
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

const NFTCard: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPurchasing, setIsPurchasing] = useState<Record<number, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [showRecommended, setShowRecommended] = useState<boolean>(true);
  
  // Get trending NFTs
  const trendingNFTs = useMemo(() => {
    return featuredNFTs
      .filter(nft => nft.trending)
      .sort((a, b) => (a.trendingRank || 999) - (b.trendingRank || 999));
  }, []);
  
  // Categories for demo
  const categories = useMemo(() => ["All", "Art", "Collectibles", "Gaming", "Music", "Photography"], []);

  const filteredNFTs = useMemo(() => {
    let filtered = [...featuredNFTs];
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (nft) =>
          nft.name.toLowerCase().includes(lowercaseQuery) ||
          nft.creator.toLowerCase().includes(lowercaseQuery) ||
          nft.type.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    // Filter by category
    if (activeCategory !== "All") {
      // This is a placeholder - in a real app, you'd have category data
      // For demo purposes, let's just filter randomly based on ID
      filtered = filtered.filter(nft => nft.id % categories.length === categories.indexOf(activeCategory) - 1);
    }
    
    return filtered;
  }, [searchQuery, activeCategory, categories]);

  // Show toast notification when no results found
  useEffect(() => {
    if (searchQuery.trim() !== "" && filteredNFTs.length === 0) {
      toast({
        title: "No matches found",
        description: `No NFTs match "${searchQuery}". Try a different search term.`,
        variant: "default",
        duration: 3000,
      });
    }
  }, [filteredNFTs.length, searchQuery, toast]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate search loading
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleBuyNow = async (nft: NFT) => {
    try {
      // Update UI to show purchasing state
      setIsPurchasing(prev => ({ ...prev, [nft.id]: true }));
      
      toast({
        title: "NFT Purchase Initiated",
        description: `Purchasing ${nft.name} for ${nft.price} ETH...`,
        variant: "default",
      });
      
      // Call the buyNFT function
      const result = await buyNFT(BigInt(nft.id));

      // Success notification
      toast({
        title: "NFT Purchase Successful!",
        description: `You've purchased ${nft.name} for ${nft.price} ETH`,
        variant: "default",
        duration: 5000,
      });
      
      console.log("Purchase complete:", result);
    } catch (error) {
      // Error already handled in buyNFT function with alert
      toast({
        title: "Purchase Failed",
        description: `There was an error completing your purchase. Please try again. ${error}`,
        variant: "default",
        duration: 5000,
      });

      console.error("Failed to buy NFT:", {error});

    } finally {
      // Reset purchasing state
      setIsPurchasing(prev => ({ ...prev, [nft.id]: false }));
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen text-gray-800 bg-white">
        {/* Background subtle pattern */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 z-0"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Secondary navigation with improved styling */}
          <div className="container mx-auto p-6 flex justify-center items-center">
            <div className="flex space-x-8 bg-white px-8 py-3 rounded-full shadow-md">
              <Link to="/nfts" className="text-purple-600 hover:text-purple-800 focus:outline-none focus:text-purple-800 transition-colors">NFTs</Link>
              <Link to="/tokens" className="text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 transition-colors">Tokens</Link>
            </div>
          </div>

          {/* Hero Section with improved styling */}
          <section className="py-20 text-gray-800 relative">
            <div className="absolute inset-0 bg-[url('/path-to-your-pattern.svg')] opacity-5 z-0"></div>
            <div className="container mx-auto px-6 relative z-10">
              <h1 className="text-5xl md:text-7xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                Discover Unique NFTs
              </h1>
              <p className="text-xl text-purple-600 text-center mb-12 max-w-2xl mx-auto">
                Explore and collect extraordinary NFTs from talented creators across the digital universe
              </p>

              {/* Search Bar Component */}
              <SearchBar 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                onSubmit={handleSearchSubmit} 
              />
            </div>
          </section>
          
          {/* Trending NFTs Section with improved styling */}
          {!searchQuery && (
            <section className="py-12 bg-gradient-to-r from-purple-50 via-white to-blue-50">
              <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                    <TrendingUp className="mr-2 text-purple-600" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                      Trending NFTs
                    </span>
                  </h2>
                  <Link to="/trending" className="text-purple-600 hover:text-purple-700 transition-colors text-sm font-medium px-4 py-2 border border-purple-200 rounded-full hover:bg-purple-50">
                    View All →
                  </Link>
                </div>
                
                <div className="flex overflow-x-auto pb-4 scrollbar-hide">
                  {trendingNFTs.map((nft) => (
                    <TrendingNFTItem key={nft.id} nft={nft} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Featured NFTs with improved styling */}
          <section className="py-20">
            <div className="container mx-auto px-6">
              <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    {searchQuery ? `Search Results` : `Featured NFTs`}
                  </span>
                  {searchQuery && <span className="text-lg text-gray-700 ml-2">({filteredNFTs.length})</span>}
                </h2>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <CategoryTabs 
                    activeCategory={activeCategory} 
                    setActiveCategory={setActiveCategory} 
                  />
                  <button 
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-300 rounded-lg text-purple-700 hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-md"
                    aria-label="Filter NFTs"
                  >
                    <SlidersHorizontal size={20} className="text-purple-600" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin mx-auto"></div>
                  <p className="text-xl text-purple-600 mt-4">Loading your digital treasures...</p>
                </div>
              ) : filteredNFTs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredNFTs.map((nft) => (
                    <NFTItem 
                      key={nft.id} 
                      nft={nft} 
                      onBuyNow={handleBuyNow} 
                      isPurchasing={isPurchasing}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-purple-200 shadow-md p-8">
                  <p className="text-xl text-purple-600">No NFTs found matching your search.</p>
                  <button 
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg text-white hover:from-purple-500 hover:to-pink-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-lg"
                    onClick={() => setSearchQuery("")}
                    aria-label="Reset search"
                  >
                    Reset Search
                  </button>
                </div>
              )}
            </div>
          </section>
          
          {/* Recommended NFTs with improved styling */}
          {!searchQuery && showRecommended && (
            <section className="py-20 bg-gradient-to-r from-purple-50 via-white to-pink-50">
              <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-bold flex items-center">
                      <Star className="mr-2 text-yellow-600" />
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-pink-600">
                        Recommended For You
                      </span>
                    </h2>
                    <p className="text-purple-600 mt-2">Based on your previous activity</p>
                  </div>
                  <button 
                    className="text-gray-600 hover:text-gray-800 transition-colors px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100"
                    onClick={() => setShowRecommended(false)}
                    aria-label="Hide recommendations"
                  >
                    Hide recommendations
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recommendedNFTs.map((nft) => (
                    <RecommendedNFTItem key={nft.id} nft={nft} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default NFTCard;