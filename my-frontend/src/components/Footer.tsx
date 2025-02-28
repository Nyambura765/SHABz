export const Footer = () => {
    return (
      <footer className="bg-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">SHABz</h2>
              <p className=" max-w-xs">
                Revolutionizing creator-fan relationships through blockchain technology.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-3">
                <li><a href="#" className=" ">Features</a></li>
                <li><a href="#" className=" ">Marketplace</a></li>
                <li><a href="#" className=" ">Token Economics</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className=" ">Documentation</a></li>
                <li><a href="#" className=" ">Help Center</a></li>
                <li><a href="#" className=" ">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
              <ul className="space-y-3">
                <li><a href="#" className=" ">Twitter</a></li>
                <li><a href="#" className=" ">Discord</a></li>
                <li><a href="#" className=" ">Telegram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-center ">
              © 2025 SHABz. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  };