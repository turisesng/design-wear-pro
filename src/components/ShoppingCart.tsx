import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingBag } from "lucide-react";
import { Product } from "./ProductCard";

export interface CartItem {
  product: Product;
  customization?: any;
  quantity: number;
}

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export const ShoppingCart = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemoveItem,
  onCheckout 
}: ShoppingCartProps) => {
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Add some products to get started!
            </p>
            <Button onClick={onClose} variant="hero">
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 my-6 pr-4" style={{ height: 'calc(100vh - 250px)' }}>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 rounded-lg bg-gradient-card border border-border animate-fade-in"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.product.category}
                      </p>
                      {item.customization && (
                        <p className="text-xs text-primary">Custom Design</p>
                      )}
                      <p className="text-lg font-bold text-primary">
                        ${item.product.price}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="flex-col gap-4">
              <Separator />
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-2xl text-primary">${total.toFixed(2)}</span>
              </div>
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full"
                onClick={onCheckout}
              >
                Proceed to Checkout
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};