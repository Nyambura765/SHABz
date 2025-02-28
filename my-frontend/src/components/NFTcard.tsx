import type React from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import{ Navbar }from "../components/Navbar"
import { Link } from "react-router-dom"


const Marketplace: React.FC = () => {
  // Mock data for featured NFTs
  const featuredNFTs = [
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
  ]

  return (
    <>
    <Navbar />
    <div className="min-h-screen  text-white">
          <nav className="container mx-auto p-6 flex justify-center items-center">
           <div className="hidden md:flex space-x-8">
              <Link to="/tokens" className="hover:text-purple-300">Tokens</Link>
              <Link to="/nfts" className="hover:text-purple-300">NFTs</Link>
            </div>
          </nav>

      {/* Hero Section */}
      <section className="py-20  text-white">
        <div className="absolute inset-0" />
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
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search NFTs, collections, creators..."
              className="w-full bg-black/50 border border-purple-600 rounded-lg py-3 px-12 text-white placeholder-gray-500 focus:outline-none  backdrop-blur-xl"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 text-white">Explore Our Marketplace</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-gray-300">
                Welcome to SHABz NFT Marketplace, where the digital and physical worlds collide in a vibrant explosion
                of creativity. Our platform is a haven for artists, collectors, and enthusiasts alike, offering a
                diverse array of unique digital assets that push the boundaries of art and technology.
              </p>
              <p className="text-gray-300">
                From stunning visual artworks to interactive experiences and virtual real estate, our marketplace is a
                gateway to the future of digital ownership. Each NFT represents not just a piece of art, but a piece of
                the creator's vision, securely stored on the blockchain for eternity.
              </p>
              <p className="text-gray-300">
                Dive in, explore collections, connect with creators, and find that perfect NFT that speaks to your soul.
                The future is digital, and it's waiting for you right here.
              </p>
            </div>
            <div className="relative group">
              <div className="absolute  pt-16 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-2ceZiMH5ERRbF5vzLftGi4yXH8Dxry.png"
                  alt="NFT Marketplace Preview"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured NFTs */}
      <section className="py-20" >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-white">Featured NFTs</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-900/50 border border-purple-600/50 rounded-lg text-white hover:bg-purple-900/70 transition-colors">
              <SlidersHorizontal size={20} />
              <span>Filter</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredNFTs.map((nft) => (
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
                      <button className="px-4 py-1 bg-cyan-500/10 border border-cyan-400/50 rounded-full text-cyan-400 text-sm hover:bg-cyan-400/20 transition-colors">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
</div>
    </>
  )
}

export default Marketplace;

