import { ShoppingCart, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavigationProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export const Navigation = ({ cartItemCount, onCartClick }: NavigationProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shirt className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            StyleCraft
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#catalog" className="text-foreground hover:text-primary transition-colors font-medium">
            Shop
          </a>
          <a href="#customize" className="text-foreground hover:text-primary transition-colors font-medium">
            Customize
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onCartClick}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};