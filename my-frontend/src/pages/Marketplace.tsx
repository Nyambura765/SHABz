import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { registerUser, registerCreator } from "../BlockchainServices/ShabzHooks";
import { useToast } from "../hooks/use-toast";

const Marketplace: React.FC = () => {
  const { toast } = useToast();

  const handleRegister = async (role: string) => {
    if (role === "User") {
      try {
        const hash = await registerUser();
        toast({
          title: "Registration Successful",
          description: `User registration complete. Transaction hash: ${hash.slice(0, 10)}...`,
          variant: "default",
          duration: 5000,
          icon: <CheckCircle className="h-5 w-5 text-green-500" />
        });
      } catch(error) {
        console.error(`error: ${error}`);
        toast({
          title: "Registration Failed",
          description: "Failed to register user. Please try again.",
          variant: "destructive",
          duration: 5000,
          icon: <AlertCircle className="h-5 w-5" />
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
          icon: <CheckCircle className="h-5 w-5 text-green-500" />
        });
      } catch(error) {
        console.error(`error: ${error}`);
        toast({
          title: "Registration Failed",
          description: "Failed to register creator. Please try again.",
          variant: "destructive", 
          duration: 5000,
          icon: <AlertCircle className="h-5 w-5" />
        });
      }
    }
  };

  return (
    <>
      <Navbar />
      <header className="min-h-screen mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-8">
          Discover, Collect, and Sell Extraordinary NFTs
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          The ultimate NFT marketplace where creators and collectors connect.
        </p>

        {/* Register Buttons */}
        <div className="flex flex-col md:flex-row gap-6 justify-center mb-8">
          <button
            onClick={() => handleRegister("User")}
            className="bg-white text-purple-600 px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-200 transition"
          >
            Register as User
          </button>
          <button
            onClick={() => handleRegister("Creator")}
            className="bg-white text-purple-600 px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-200 transition"
          >
            Register as Creator
          </button>
        </div>

        {/* Explore Marketplace Button */}
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <Link
            to="/nfts"
            className="bg-purple-600 text-white shadow-md px-8 py-4 rounded-full text-lg font-semibold flex items-center justify-center"
          >
            Explore Marketplace <ArrowRight className="ml-2" />
          </Link>
        </div>
      </header>
    </>
  );
};

export default Marketplace;