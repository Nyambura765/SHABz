import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  liskSepolia,
} from 'wagmi/chains';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";

import NotFound from "./pages/NotFound";
import Marketplace from "./pages/Marketplace";
import TokenCard from "./components/TokenCard";
import NFTCard from "./components/NFTcard"; 
import Creators from "./pages/ForCreators";
import Fans from "./pages/ForFans";
import Engage from "./pages/Engage";
import EventsBlogs from "./pages/Events";


const queryClient = new QueryClient();
const config = getDefaultConfig({
  appName: 'SHABz',
  projectId: 'd766c6cf33b30e2a7d708fe382ae5c2e',
  chains: [mainnet, polygon, optimism, arbitrum, base, liskSepolia],
  ssr: true, 
});

const App = () => (
  <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
        <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        
          <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
           <Route path="/home" element={<Home />} />
           <Route  path="/marketplace"   element={<Marketplace />}   />
            <Route path="/nfts" element={  <NFTCard />  } />
            <Route  path="/tokens"  element={    <TokenCard />  } />
            <Route path="/forcreators" element={<Creators />} />
            <Route path="/forfans" element={<Fans />} />
            <Route path="/engage" element={< Engage />} />
            <Route path="/events" element={<EventsBlogs />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/redirect" element={<Navigate to="/marketplace" replace />} />
          </Routes>
    
      </BrowserRouter>
        </TooltipProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
 
);

export default App;
