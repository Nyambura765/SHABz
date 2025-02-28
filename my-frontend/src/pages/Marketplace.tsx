import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { registerUser, registerCreator } from "../BlockchainServices/ShabzHooks";

const Marketplace: React.FC = () => {

  const handleRegister = async (role: string) => {
    if (role === "User") {
      try {
        const hash = await registerUser();
        alert(`User registration successful. Transaction hash: ${hash}`);
      } catch(error) {
        console.error(`error: ${error}`);
        alert("Failed to register user");
      }
    } else {
      try {
        const hash = await registerCreator();
        alert(`Creator registration successful. Transaction hash: ${hash}`);
      } catch(error) {
        console.error(`error: ${error}`);
        alert("Failed to register creator");
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
