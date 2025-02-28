import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Navbar } from "./Navbar";
import { Link } from "react-router-dom";

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
}

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
  },
];

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2)}M`;
  }
  return `$${(num / 1000).toFixed(2)}K`;
};

const TokenRow = ({ token }: { token: Token }) => (
  <div className="token-row flex items-center gap-6 px-6 py-3 text-sm text-gray-400 border" >
    <div className="flex items-center gap-3 w-[300px]">
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-purple-600">
        {token.symbol[0]}
      </div>
      <div>
        <h3 className="font-medium">{token.name} ({token.symbol})</h3>
        <p className="text-sm text-gray-400">by {token.creator}</p>
      </div>
   </div>
    <div className="w-[150px] font-medium">${token.price.toFixed(2)}</div>
    <div className={`w-[150px] ${token.change >= 0 ? "text-token-positive" : "text-token-negative"}`}>
      {token.change >= 0 ? "+" : ""}{token.change}%
    </div>
    <div className="w-[200px] text-gray-400">{formatNumber(token.marketCap)}</div>
    <div className="w-[200px] text-gray-400">{formatNumber(token.volume)}</div>
    <div className="text-gray-400">{token.holders.toLocaleString()}</div>
  </div>
);

const Token = () => {
  const [search, setSearch] = useState("");

  return (
    <>
    <Navbar />
    <div className="min-h-screen  text-white">
          <nav className="container mx-auto p-6 flex justify-center items-center">
           <div className="hidden md:flex space-x-8">
              <Link to="/nfts" className="hover:text-purple-300">NFTs</Link>
              <Link to="/tokens" className="hover:text-purple-300">Tokens</Link>
            </div>
          </nav>
    <div className="min-h-screen px-6 py-12 max-w-[1400px] mx-auto text-white">
      <div className="space-y-2 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Creator Tokens</h1>
        <p className="text-gray-400">
          Discover and trade creator tokens from your favorite artists, musicians, and content creators
        </p>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-1 border-purple-600 border rounded-md" >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tokens by name or symbol..."
            className="search-input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="px-4 py-2 bg-table-row rounded-xl border border-border/5 hover:border-border/20 transition-all duration-200">
          <SlidersHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="space-y-2 border border-border/5 rounded-md overflow-hidden">
        <div className="flex items-center gap-6 px-6 py-3 text-sm text-gray-400">
          <div className="w-[300px]">Token</div>
          <div className="w-[150px]">Price</div>
          <div className="w-[150px]">24h Change</div>
          <div className="w-[200px]">Market Cap</div>
          <div className="w-[200px]">Volume</div>
          <div>Holders</div>
        </div>

        <div className="">
          {tokens
            .filter(
              (token) =>
                token.name.toLowerCase().includes(search.toLowerCase()) ||
                token.symbol.toLowerCase().includes(search.toLowerCase())
            )
            .map((token) => (
              <TokenRow key={token.id} token={token} />
            ))}
        </div>
      </div>
    </div>
    </div>
    </>
  );
};

export default Token;