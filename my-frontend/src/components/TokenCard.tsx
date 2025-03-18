import { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, X, Heart, ChevronUp, ChevronDown, Info, BookmarkPlus } from "lucide-react";
import { Navbar } from "./Navbar";
import { Link } from "react-router-dom";
import { purchaseTokens } from "../BlockchainServices/ShabzHooks"; 
import { useToast } from "../hooks/use-toast"; 

interface Token {
  id: string;
  name: string;
  symbol: string;
  creator: string;
  price: number;
  change: number;
  marketCap: number;
  volume: number;
  holders: number;
  description: string;
  verified: boolean;
  historicalPrices: number[];
}

// Added descriptions, verification status, and historical price data
const tokens: Token[] = [
  {
    id: "1",
    name: "Creator Token",
    symbol: "CRTK",
    creator: "Digital Artist Pro",
    price: 2.34,
    change: 5.67,
    marketCap: 1200000,
    volume: 450000,
    holders: 3200,
    description: "Token for digital artists to monetize their artwork and provide exclusive content to holders.",
    verified: true,
    historicalPrices: [2.20, 2.25, 2.18, 2.30, 2.34]
  },
  {
    id: "2",
    name: "Music Token",
    symbol: "MUSIC",
    creator: "Sound Wave",
    price: 1.56,
    change: -2.34,
    marketCap: 980000,
    volume: 320000,
    holders: 2800,
    description: "Token for musicians to share unreleased tracks and offer special access to token holders.",
    verified: true,
    historicalPrices: [1.62, 1.60, 1.58, 1.57, 1.56]
  },
  {
    id: "3",
    name: "Gaming Token",
    symbol: "GAME",
    creator: "Pro Gamer",
    price: 3.78,
    change: 12.45,
    marketCap: 2300000,
    volume: 890000,
    holders: 5600,
    description: "Token for gamers to get early access to games and exclusive in-game items.",
    verified: true,
    historicalPrices: [3.35, 3.42, 3.50, 3.65, 3.78]
  },
  {
    id: "4",
    name: "Content Token",
    symbol: "CONT",
    creator: "Content Creator",
    price: 0.89,
    change: -1.23,
    marketCap: 560000,
    volume: 210000,
    holders: 1900,
    description: "Token for content creators to provide premium content and community access.",
    verified: false,
    historicalPrices: [0.92, 0.91, 0.90, 0.90, 0.89]
  },
];

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2)}M`;
  }
  return `$${(num / 1000).toFixed(2)}K`;
};

const TokenRow = ({ token, onToggleWatchlist, isWatchlisted }: { 
  token: Token, 
  onToggleWatchlist: (tokenId: string) => void,
  isWatchlisted: boolean
}) => {
  const { toast } = useToast();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const handleBuyClick = async () => {
    try {
      setIsPurchasing(true);
      
      // Show pending toast
      toast({
        title: "Token Purchase Initiated",
        description: `Purchasing ${token.symbol} tokens...`,
        variant: "default",
      });
      
      // Convert token data to parameters for purchaseTokens
      const tokenAddress = `0x${token.id}` as `0x${string}`; // Convert to proper format
      const tierId = BigInt(1); // Default tier or get from token data
      const amount = BigInt(1); // Default amount or let user select
      
      const result = await purchaseTokens(
        tokenAddress,
        tierId,
        amount
      );
      
      console.log('Purchase successful:', result);
      
      // Success toast
      toast({
        title: "Token Purchase Successful!",
        description: `You've purchased ${token.symbol} tokens`,
        variant: "default",
        duration: 5000,
      });
    } catch (error) {
      console.error('Purchase failed:', error);
      
      // Error toast
      toast({
        title: "Purchase Failed",
        description: `There was an error purchasing ${token.symbol}: ${error instanceof Error ? error.message : String(error)}`,
        variant: "default",
        duration: 5000,
      });
    } finally {
      setIsPurchasing(false);
    }
  };
  
  return (
    <div className="border-b border-gray-200 overflow-hidden">
      <div 
        className="token-row flex items-center gap-6 px-6 py-4 text-sm hover:bg-gray-50 cursor-pointer transition-colors duration-200"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-3 w-[300px]">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center border border-purple-500 text-purple-700 font-semibold">
            {token.symbol[0]}
          </div>
          <div>
            <div className="flex items-center">
              <h3 className="font-medium text-gray-800">{token.name} ({token.symbol})</h3>
              {token.verified && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Verified</span>
              )}
            </div>
            <p className="text-sm text-gray-500">by {token.creator}</p>
          </div>
        </div>
        <div className="w-[120px] font-medium text-gray-800">${token.price.toFixed(2)}</div>
        <div className={`w-[120px] ${token.change >= 0 ? "text-green-600" : "text-red-600"} font-medium`}>
          {token.change >= 0 ? "+" : ""}{token.change}%
        </div>
        <div className="w-[150px] text-gray-600">{formatNumber(token.marketCap)}</div>
        <div className="w-[150px] text-gray-600">{formatNumber(token.volume)}</div>
        <div className="w-[100px] text-gray-600">{token.holders.toLocaleString()}</div>
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(token.id);
            }}
            className="text-gray-500 hover:text-purple-600 transition-colors"
            title={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
          >
            <Heart className={`w-5 h-5 ${isWatchlisted ? "fill-purple-500 text-purple-500" : ""}`} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleBuyClick();
            }}
            disabled={isPurchasing}
            className={`${isPurchasing ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'} text-white px-4 py-1.5 rounded-md transition-all duration-200`}
          >
            {isPurchasing ? 'Buying...' : 'Buy Now'}
          </button>
          <button className="text-gray-500">
            {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {/* Expanded details section - Improved readability */}
      {showDetails && (
        <div className="bg-gray-50 px-6 py-4 text-sm">
          <div className="flex justify-between items-start">
            <div className="max-w-3xl">
              <h4 className="font-medium text-base mb-2 text-gray-800">About {token.name}</h4>
              <p className="text-gray-700">{token.description}</p>
            </div>
            <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
              <h4 className="font-medium mb-2 text-gray-800">Token Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Current Price:</span>
                  <span className="text-gray-800 font-medium">${token.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">All-time high:</span>
                  <span className="text-gray-800 font-medium">${Math.max(...token.historicalPrices).toFixed(2)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">All-time low:</span>
                  <span className="text-gray-800 font-medium">${Math.min(...token.historicalPrices).toFixed(2)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Volume/Market Cap:</span>
                  <span className="text-gray-800 font-medium">{((token.volume / token.marketCap) * 100).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Tokens= () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Token | null,
    direction: 'ascending' | 'descending'
  }>({ key: null, direction: 'ascending' });
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 5,
    minMarketCap: 0,
    maxMarketCap: 2500000,
    minHolders: 0,
    maxHolders: 6000,
    changeDirection: "all" as "positive" | "negative" | "all",
    verifiedOnly: false
  });

  // Toggle token in watchlist
  const toggleWatchlist = (tokenId: string) => {
    setWatchlist(prev => {
      if (prev.includes(tokenId)) {
        toast({
          title: "Removed from Watchlist",
          description: "Token has been removed from your watchlist",
          variant: "default",
          duration: 2000,
        });
        return prev.filter(id => id !== tokenId);
      } else {
        toast({
          title: "Added to Watchlist",
          description: "Token has been added to your watchlist",
          variant: "default",
          duration: 2000,
        });
        return [...prev, tokenId];
      }
    });
  };

  // Sort tokens
  const requestSort = (key: keyof Token) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Apply filters and sorting
  const filteredAndSortedTokens = useMemo(() => {
  const result = tokens.filter(token => 
      // Search filter
      (token.name.toLowerCase().includes(search.toLowerCase()) ||
        token.symbol.toLowerCase().includes(search.toLowerCase())) &&
      
      // Price filter
      token.price >= filters.minPrice &&
      token.price <= filters.maxPrice &&
      
      // Market Cap filter
      token.marketCap >= filters.minMarketCap &&
      token.marketCap <= filters.maxMarketCap &&
      
      // Holders filter
      token.holders >= filters.minHolders &&
      token.holders <= filters.maxHolders &&
      
      // Change direction filter
      (filters.changeDirection === "all" ||
        (filters.changeDirection === "positive" && token.change > 0) ||
        (filters.changeDirection === "negative" && token.change < 0)) &&
        
      // Verified filter
      (!filters.verifiedOnly || token.verified) &&
        
      // Watchlist filter
      (!showWatchlistOnly || watchlist.includes(token.id))
    );

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [search, filters, sortConfig, watchlist, showWatchlistOnly]);

  // Show toast when no results found
  useEffect(() => {
    if (search.trim() !== "" && filteredAndSortedTokens.length === 0) {
      toast({
        title: "No matches found",
        description: `No tokens match "${search}". Try different search criteria.`,
        variant: "default",
        duration: 3000,
      });
    }
  }, [filteredAndSortedTokens.length, search, toast]);

  const resetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 5,
      minMarketCap: 0,
      maxMarketCap: 2500000,
      minHolders: 0,
      maxHolders: 6000,
      changeDirection: "all",
      verifiedOnly: false
    });
    setSearch("");
    setShowWatchlistOnly(false);
    setSortConfig({ key: null, direction: 'ascending' });
    
    // Show toast when filters are reset
    toast({
      title: "Filters Reset",
      description: "All filters have been reset to default values.",
      variant: "default",
      duration: 2000,
    });
  };

  // Column header for sorting
  const SortableHeader = ({ title, width, field }: { title: string, width: string, field: keyof Token }) => {
    return (
      <div 
        className={`${width} flex items-center gap-1 cursor-pointer hover:text-gray-800 text-gray-600`}
        onClick={() => requestSort(field)}
      >
        {title}
        {sortConfig.key === field ? (
          sortConfig.direction === 'ascending' ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )
        ) : (
          <div className="w-4 h-4" />
        )}
      </div>
    );
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-white text-gray-800">
      <nav className="container mx-auto p-6 flex justify-center items-center">
        <div className="flex space-x-8">
          <Link to="/nfts" className="text-gray-700 hover:text-purple-600 font-medium">NFTs</Link>
          <Link to="/tokens" className="text-gray-700 hover:text-purple-600 font-medium">Tokens</Link>
        </div>
      </nav>
      <div className="min-h-screen px-6 py-12 max-w-[1400px] mx-auto">
        <div className="space-y-2 mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Creator Tokens</h1>
          <p className="text-gray-600">
            Discover and trade creator tokens from your favorite artists, musicians, and content creators
          </p>
          <div className="mt-4">
            <Link to="/learn-about-tokens" className="flex items-center text-purple-600 hover:text-purple-800 transition-colors">
              <Info className="w-4 h-4 mr-2" /> Learn more about creator tokens and how they work
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="relative flex-1 border-purple-300 border rounded-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tokens by name or symbol..."
              className="bg-white pl-10 py-2 w-full rounded-md border-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            className={`px-4 py-2 rounded-xl border transition-all duration-200 flex items-center gap-2 ${showWatchlistOnly ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            onClick={() => setShowWatchlistOnly(!showWatchlistOnly)}
          >
            <BookmarkPlus className="w-5 h-5" /> 
            {showWatchlistOnly ? 'Show All' : 'My Watchlist'}
          </button>
          <button 
            className="px-4 py-2 bg-white rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 transition-all duration-200"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {isFilterOpen && (
          <div className="bg-white border border-gray-200 rounded-md p-6 mb-8 space-y-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price Filter */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Price Range</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: Number(e.target.value)})}
                    className="w-full p-2 bg-gray-50 rounded border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="Min Price"
                  />
                  <span>-</span>
                  <input 
                    type="number" 
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
                    className="w-full p-2 bg-gray-50 rounded border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="Max Price"
                  />
                </div>
              </div>

              {/* Market Cap Filter */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Market Cap Range</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={filters.minMarketCap}
                    onChange={(e) => setFilters({...filters, minMarketCap: Number(e.target.value)})}
                    className="w-full p-2 bg-gray-50 rounded border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="Min Market Cap"
                  />
                  <span>-</span>
                  <input 
                    type="number" 
                    value={filters.maxMarketCap}
                    onChange={(e) => setFilters({...filters, maxMarketCap: Number(e.target.value)})}
                    className="w-full p-2 bg-gray-50 rounded border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="Max Market Cap"
                  />
                </div>
              </div>

              {/* Holders Filter */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Number of Holders</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={filters.minHolders}
                    onChange={(e) => setFilters({...filters, minHolders: Number(e.target.value)})}
                    className="w-full p-2 bg-gray-50 rounded border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="Min Holders"
                  />
                  <span>-</span>
                  <input 
                    type="number" 
                    value={filters.maxHolders}
                    onChange={(e) => setFilters({...filters, maxHolders: Number(e.target.value)})}
                    className="w-full p-2 bg-gray-50 rounded border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="Max Holders"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Change Direction Filter */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Price Change Direction</label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center text-gray-700">
                    <input 
                      type="radio" 
                      value="all"
                      checked={filters.changeDirection === "all"}
                      onChange={() => setFilters({...filters, changeDirection: "all"})}
                      className="mr-2 text-purple-600 focus:ring-purple-500"
                    />
                    All
                  </label>
                  <label className="inline-flex items-center text-gray-700">
                    <input 
                      type="radio" 
                      value="positive"
                      checked={filters.changeDirection === "positive"}
                      onChange={() => setFilters({...filters, changeDirection: "positive"})}
                      className="mr-2 text-purple-600 focus:ring-purple-500"
                    />
                    Positive Change
                  </label>
                  <label className="inline-flex items-center text-gray-700">
                    <input 
                      type="radio" 
                      value="negative"
                      checked={filters.changeDirection === "negative"}
                      onChange={() => setFilters({...filters, changeDirection: "negative"})}
                      className="mr-2 text-purple-600 focus:ring-purple-500"
                    />
                    Negative Change
                  </label>
                </div>
              </div>

              {/* Verified Filter */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Token Verification</label>
                <label className="inline-flex items-center text-gray-700">
                  <input 
                    type="checkbox" 
                    checked={filters.verifiedOnly}
                    onChange={(e) => setFilters({...filters, verifiedOnly: e.target.checked})}
                    className="mr-2 text-purple-600 focus:ring-purple-500 rounded"
                  />
                  Show verified tokens only
                </label>
              </div>
            </div>

            {/* Reset and Apply Buttons */}
            <div className="flex justify-end gap-4 mt-4">
              <button 
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded hover:bg-gray-200 flex items-center gap-2 transition-colors"
              >
                <X className="w-4 h-4" /> Reset Filters
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2 border border-gray-200 rounded-md overflow-hidden shadow-sm">
          <div className="flex items-center gap-6 px-6 py-3 text-sm text-gray-500 bg-gray-50 border-b border-gray-200">
            <SortableHeader title="Token" width="w-[300px]" field="name" />
            <SortableHeader title="Price" width="w-[120px]" field="price" />
            <SortableHeader title="24h Change" width="w-[120px]" field="change" />
            <SortableHeader title="Market Cap" width="w-[150px]" field="marketCap" />
            <SortableHeader title="Volume" width="w-[150px]" field="volume" />
            <SortableHeader title="Holders" width="w-[100px]" field="holders" />
            <div className="ml-auto text-gray-600">Action</div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredAndSortedTokens.length > 0 ? (
              filteredAndSortedTokens.map((token) => (
                <TokenRow 
                  key={token.id} 
                  token={token} 
                  onToggleWatchlist={toggleWatchlist}
                  isWatchlisted={watchlist.includes(token.id)}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-white">
                <p className="text-xl text-gray-600">No tokens found matching your criteria.</p>
                <button 
                  className="mt-4 px-6 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onClick={resetFilters}
                  aria-label="Reset filters"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile responsiveness indicator - will adjust styles for smaller screens */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700 md:hidden">
          <h3 className="font-medium">Viewing on a small screen</h3>
          <p className="text-sm mt-1">Scroll horizontally to see all token information</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Tokens;