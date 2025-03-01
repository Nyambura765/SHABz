import {Button} from "../components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi"; // Import useAccount hook
import { useNavigate } from "react-router-dom"; // Import React Router navigation
import { useEffect, useState } from "react";

export const Hero = () => {
  const { isConnected } = useAccount(); // Check wallet connection status
  const navigate = useNavigate(); // React Router navigation
  const [openModal, setOpenModal] = useState(false); // Track modal state

  useEffect(() => {
    // Redirect to Marketplace when wallet connects
    if (isConnected && openModal) {
      navigate("/marketplace");
    }
  }, [isConnected, openModal, navigate]);

  
  const handleGetStarted = (openConnectModal: () => void) => {
    if (isConnected) {
      navigate("/marketplace"); 
    } else {
      setOpenModal(true);
      openConnectModal();
    }
  };

  return (
    <div className="relative bg-gradient-to-b  from-purple-700 to-teal-700">
      <div className="px-4 sm:pt-40 pb-24 min-h-screen">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Connect with Creators
            <span className="block">Like Never Before</span>
          </h1>

          <p className="mt-6 text-xl leading-8 text-gray-300 mb-12">
            The ultimate platform where creators and fans unite through exclusive
            NFTs, tokens, and memorable experiences.
          </p>

          <div className="flex items-center justify-center gap-x-6 mb-24">
            <ConnectButton.Custom>
              {({ openConnectModal }: { openConnectModal: () => void }) => (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5558e8] hover:to-[#7c4deb] text-white text-lg px-8 py-6 shadow-lg shadow-purple-500/30"
                  onClick={() => handleGetStarted(openConnectModal)}
                >
                  {isConnected ? "Go to Marketplace " : "Get Started →"}
                </Button>
              )}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    </div>
  );
};
