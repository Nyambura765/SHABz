import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, TrendingUp, Users } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { registerUser, registerCreator } from "../BlockchainServices/ShabzHooks";
import { useToast } from "../hooks/use-toast";

const Marketplace: React.FC = () => {
  const { toast } = useToast();
  const [statsCount, setStatsCount] = useState({ creators: 0, collections: 0, volume: 0 });
  
  // Animate stats counters effect
  useEffect(() => {
    const interval = setInterval(() => {
      setStatsCount(prev => ({
        creators: prev.creators < 2500 ? prev.creators + 25 : prev.creators,
        collections: prev.collections < 15000 ? prev.collections + 150 : prev.collections,
        volume: prev.volume < 100 ? prev.volume + 1 : prev.volume
      }));
    }, 30);
    
    return () => clearInterval(interval);
  }, []);

  const handleRegister = async (role: string) => {
    if (role === "User") {
      try {
        const hash = await registerUser();
        toast({
          title: "Registration Successful",
          description: `User registration complete. Transaction hash: ${hash.slice(0, 10)}...`,
          variant: "default",
          duration: 5000,
        });
      } catch(error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : "An unknown error occurred";
        
        console.error(`User registration error: ${errorMessage}`);
        
        toast({
          title: "Registration Failed",
          description: errorMessage || "Failed to register user. Please try again.",
          duration: 5000,
        });
      }
    } else {
      try {
        const hash = await registerCreator();
        toast({
          title: "Registration Successful",
          description: `Creator registration complete. Transaction hash: ${hash.slice(0, 10)}...`,
          variant: "default",
          duration: 5000,
        });
      } catch(error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : "An unknown error occurred";
        
        console.error(`Creator registration error: ${errorMessage}`);
        
        toast({
          title: "Registration Failed",
          description: errorMessage || "Failed to register creator. Please try again.",
          variant: "destructive", 
          duration: 5000,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-purple-900">
      <Navbar />
      
      {/* Hero Section - reduced height and padding */}
      <header className="relative px-6 py-8 text-center overflow-hidden">
        {/* Subtle animated background effect */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-5">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-purple-600"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  animation: `pulse ${Math.random() * 4 + 2}s infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="relative z-10 pt-4">
          {/* Main headline with highlight - reduced margins */}
          <h1 className="text-4xl md:text-6xl font-bold mb-2">
            Discover, Collect, and 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-700"> Sell</span>
          </h1>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Extraordinary 
            <span className="inline-flex items-center">
              NFTs <Sparkles className="w-6 h-6 md:w-8 md:h-8 ml-2 text-purple-500" />
            </span>
          </h1>
          
          {/* Enhanced subtitle - reduced margin */}
          <p className="text-lg md:text-xl text-purple-700 mb-6 max-w-3xl mx-auto">
            The <span className="font-bold text-purple-900">ultimate</span> NFT marketplace where 
            <span className="italic"> creators</span> and 
            <span className="font-bold text-purple-900"> collectors</span> connect.
          </p>

          {/* Stats counter section - reduced margin and size */}
          <div className="flex flex-wrap justify-center gap-8 mb-6">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-purple-900">{statsCount.creators.toLocaleString()}+</span>
              <span className="text-sm text-purple-700 flex items-center"><Users className="w-4 h-4 mr-1" /> Creators</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-purple-900">{statsCount.collections.toLocaleString()}+</span>
              <span className="text-sm text-purple-700">Collections</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-purple-900">{statsCount.volume.toLocaleString()}K+</span>
              <span className="text-sm text-purple-700 flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> ETH Volume</span>
            </div>
          </div>

          {/* Register Buttons with reduced padding and margin */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
            <button
              onClick={() => handleRegister("User")}
              className="group bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full text-base font-semibold shadow-md transition-all duration-300 hover:shadow-lg"
            >
              Register as User
            </button>
            <button
              onClick={() => handleRegister("Creator")}
              className="group bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full text-base font-semibold shadow-md transition-all duration-300 hover:shadow-lg"
            >
              Register as Creator
            </button>
          </div>

          {/* Explore Marketplace Button - reduced size and margin */}
          <div className="flex justify-center mt-4">
            <Link
              to="/nfts"
              className="group bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md px-8 py-4 rounded-full text-lg font-semibold flex items-center justify-center transition-all duration-300 hover:shadow-lg"
            >
              Explore Marketplace 
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </header>
      
      {/* Keyframes for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.5);
          }
        }
      `}</style>
    </div>
  );
};

export default Marketplace;