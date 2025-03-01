import  { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";
import { useToast } from "../hooks/use-toast";

// Define the NFT type
interface NFT {
  id: number;
  name: string;
  price: string;
  image: string;
  creator: string;
  type: string;
}

const NFTCard: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredNFTs, setFilteredNFTs] = useState<NFT[]>([]);
  
  // Mock data for featured NFTs
  const featuredNFTs: NFT[] = [
    {
      id: 1,
      name: "Cyber Punk #42",
      price: "2.30",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-2ceZiMH5ERRbF5vzLftGi4yXH8Dxry.png",
      creator: "CyberArtist",
      type: "NFT",
    },
    {
      id: 2,
      name: "Neon Dreams",
      price: "1.85",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-2ceZiMH5ERRbF5vzLftGi4yXH8Dxry.png",
      creator: "DigitalDreamer",
      type: "NFT",
    },
    {
      id: 3,
      name: "Virtual Realm #007",
      price: "3.20",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-2ceZiMH5ERRbF5vzLftGi4yXH8Dxry.png",
      creator: "MetaCreator",
      type: "NFT",
    },
    {
      id: 4,
      name: "Quantum Artifact",
      price: "5.45",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-2ceZiMH5ERRbF5vzLftGi4yXH8Dxry.png",
      creator: "FutureForge",
      type: "NFT",
    },
  ];

  useEffect(() => {
    // Filter NFTs based on search query
    if (searchQuery.trim() === "") {
      setFilteredNFTs(featuredNFTs);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const results = featuredNFTs.filter(
        (nft) =>
          nft.name.toLowerCase().includes(lowercaseQuery) ||
          nft.creator.toLowerCase().includes(lowercaseQuery) ||
          nft.type.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredNFTs(results);
      
      // Show toast if no results found
      if (results.length === 0) {
        toast({
          title: "No matches found",
          description: `No NFTs match "${searchQuery}". Try a different search term.`,
          variant: "default",
          duration: 3000,
        });
      }
    }
  }, [searchQuery, toast]);

  // Initialize filtered NFTs with all NFTs
  useEffect(() => {
    setFilteredNFTs(featuredNFTs);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // This prevents form submission from refreshing the page
    // The filtering is already happening in the useEffect
  };

  const handleBuyNow = (nft: NFT) => {
    toast({
      title: "NFT Purchase Initiated",
      description: `You're about to purchase ${nft.name} for ${nft.price} ETH`,
      variant: "default",
      duration: 4000,
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen text-white">
        {/* Secondary navigation */}
        <div className="container mx-auto p-6 flex justify-center items-center">
          <div className="flex space-x-8">
            <Link to="/nfts" className="text-white hover:text-purple-300">NFTs</Link>
            <Link to="/tokens" className="hover:text-purple-300">Tokens</Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-20 text-white">
          <div className="container mx-auto px-6 relative">
            <h1 className="text-5xl md:text-7xl font-bold text-center mb-6 text-white">
              <span className="relative">
                Discover Unique NFTs
                <span className="absolute inset-0 blur-2xl" />
              </span>
            </h1>
            <p className="text-xl text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              Explore and collect extraordinary NFTs from talented creators across the digital universe
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="Search NFTs, collections, creators..."
                className="w-full bg-black/50 border border-purple-600 rounded-lg py-3 px-12 text-white placeholder-gray-500 focus:outline-none backdrop-blur-xl"
                value={searchQuery}
                onChange={handleSearch}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              {searchQuery && (
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </form>
          </div>
        </section>

        {/* Featured NFTs */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-white">
                {searchQuery ? `Search Results` : `Featured NFTs`}
                {searchQuery && <span className="text-lg text-gray-400 ml-2">({filteredNFTs.length})</span>}
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white hover:bg-purple-900/70 transition-colors">
                <SlidersHorizontal size={20} />
                <span>Filter</span>
              </button>
            </div>

            {filteredNFTs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredNFTs.map((nft) => (
                  <div key={nft.id} className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500" />
                    <div className="relative bg-black rounded-2xl p-4 h-full">
                      <div className="aspect-square rounded-lg overflow-hidden mb-4">
                        <img
                          src={nft.image || "/placeholder.svg"}
                          alt={nft.name}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-white">{nft.name}</h3>
                            <p className="text-sm text-gray-400">by {nft.creator}</p>
                          </div>
                          <span className="px-2 py-1 bg-purple-900/50 rounded-full text-xs text-purple-400">
                            {nft.type}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-cyan-400 font-semibold">{nft.price} ETH</span>
                          <button 
                            className="px-4 py-1 bg-cyan-500/10 border border-cyan-400/50 rounded-full text-cyan-400 text-sm hover:bg-cyan-400/20 transition-colors"
                            onClick={() => handleBuyNow(nft)}
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400">No NFTs found matching your search.</p>
                <button 
                  className="mt-4 px-6 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-colors"
                  onClick={() => setSearchQuery("")}
                >
                  Reset Search
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default NFTCard;