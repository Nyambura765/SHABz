
import { Navigation } from "./navigation";
import { cn } from "../lib/utils";
import { useLocation, Link } from "react-router-dom";
import { Home, Coins, Image } from "lucide-react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const sidebarItems = [
    { icon: Home, label: "Marketplace", href: "/marketplace" },
    { icon: Coins, label: "Tokens", href: "/tokens" },
    { icon: Image, label: "NFTs", href: "/nfts" },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      <Navigation />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-secondary-light border-r border-primary/20 hidden lg:block">
        <div className="p-4">
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-primary/10 text-primary-light"
                    : "hover:bg-primary/5 hover:text-primary-light"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(location.pathname !== "/Index" ? "lg:pl-64" : "")}>
        {children}
      </div>
    </div>
  );
};
