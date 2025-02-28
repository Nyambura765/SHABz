import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi"; // Import useAccount hook

export const Navbar = () => {
  const { isConnected } = useAccount(); // Check if the wallet is connected

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-purple-700 backdrop-blur-sm ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-white">SHABz</h1>
          </div>

          {isConnected && ( // Show links only when wallet is connected
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8 text-white">
                <Link to="/home">Home</Link>
                <Link to="/marketplace">Marketplace</Link>
                <Link to="/forcreators">For Creators</Link>
                <Link to="/forfans">For Fans</Link>
                <Link to="/engage">Engage</Link>
                <Link to="/events">Events/Blogs</Link>
              </div>
            </div>
          )}

          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};
