import {Button} from "../components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi"; // Import useAccount hook
import { useNavigate } from "react-router-dom"; // Import React Router navigation
import { useEffect, useState } from "react";
import { checkPersona } from "../BlockchainServices/ShabzHooks";

export const Hero = () => {
  const { isConnected } = useAccount(); // Check wallet connection status
  const navigate = useNavigate(); // React Router navigation
  const [openModal, setOpenModal] = useState(false); // Track modal state
  const [animated, setAnimated] = useState(false);


  useEffect(() => {
    // Redirect to Marketplace when wallet connects
    if (isConnected && openModal) {
      const checkConnection = async () => {
        const persona = await checkPersona();

        if(persona === 'USER' || persona === 'CREATOR') {
          navigate("/nfts")
        } else {
          navigate("/marketplace");
        }
      }

      checkConnection()
    }
    
    // Trigger animations after component mounts
    setAnimated(true);
  }, [isConnected, openModal, navigate]);

  
  const handleGetStarted = async (openConnectModal: () => void) => {
    if (isConnected) {
      const persona = await checkPersona();

      if(persona === 'USER' || persona === 'CREATOR') {
        navigate("/nfts")
      } else {
        navigate("/marketplace");
      } 
    } else {
      setOpenModal(true);
      openConnectModal();
    }
  };

  // Add inline styles to apply keyframe animations
  const keyframesStyle = `
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(20px); }
      70% { opacity: 0.7; transform: translateY(5px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes float {
      0% { transform: translateY(0); }
      25% { transform: translateY(-5px); }
      50% { transform: translateY(-10px); }
      75% { transform: translateY(-5px); }
      100% { transform: translateY(0); }
    }
    
    @keyframes shimmer {
      0% { background-position: -100% 0; }
      50% { background-position: 100% 0; }
      100% { background-position: 300% 0; }
    }
    
    .animate-title {
      animation: fadeIn 1.5s ease-out forwards;
      animation-delay: 0.3s;
      opacity: 0;
    }
    
    .animate-subtitle {
      animation: fadeIn 1.8s ease-out forwards;
      animation-delay: 0.8s;
      opacity: 0;
    }
    
    .animate-paragraph {
      animation: fadeIn 2s ease-out forwards;
      animation-delay: 1.2s;
      opacity: 0;
    }
    
    .animate-button {
      animation: fadeIn 1.5s ease-out forwards, pulse 3s infinite ease-in-out;
      animation-delay: 1.6s;
      opacity: 0;
    }
    
    .animate-shimmer:hover {
      background-size: 300% 100%;
      animation: shimmer 3s infinite linear;
    }
  `;

  return (
    <div className="relative bg-gradient-to-b from-purple-700 to-teal-700">
      {/* Add style element using dangerouslySetInnerHTML for TypeScript compatibility */}
      <style dangerouslySetInnerHTML={{ __html: keyframesStyle }} />
      
      <div className="px-4 sm:pt-40 pb-24 min-h-screen">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className={`text-4xl md:text-7xl font-bold tracking-tight text-white mb-6 ${animated ? 'animate-title' : ''}`}>
            Connect with Creators
            <span className={`block ${animated ? 'animate-subtitle' : ''}`}>Like Never Before</span>
          </h1>

          <p className={`mt-6 text-xl leading-8 text-gray-300 mb-12 ${animated ? 'animate-paragraph' : ''}`}>
            The ultimate platform where creators and fans unite through exclusive
            NFTs, tokens, and memorable experiences.
          </p>

          <div className={`flex items-center justify-center gap-x-6 mb-24 ${animated ? 'animate-button' : ''}`}>
            <ConnectButton.Custom>
              {({ openConnectModal }: { openConnectModal: () => void }) => (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5558e8] hover:to-[#7c4deb] text-white text-lg px-8 py-6 shadow-lg shadow-purple-500/30 animate-shimmer"
                  style={{
                    backgroundSize: '300% 100%',
                    transition: 'all 0.3s ease'
                  }}
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