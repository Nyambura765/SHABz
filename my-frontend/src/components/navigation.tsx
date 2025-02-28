
import { Home, Coins, Image } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";

export const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Marketplace", href: "/marketplace" },
    { icon: Coins, label: "Tokens", href: "/tokens" },
    { icon: Image, label: "NFTs", href: "/nfts" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary-light border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary-light">Purple Portal</h1>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2",
                    location.pathname === item.href && "bg-primary/10 text-primary-light"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
