import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ProductCatalog } from "@/components/ProductCatalog";
import { CustomizationTool } from "@/components/CustomizationTool";
import { ShoppingCart, CartItem } from "@/components/ShoppingCart";
import { Product } from "@/components/ProductCard";
import { toast } from "sonner";

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAddToCart = (product: Product, customization?: any) => {
    const existingItem = cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1, customization }
          : item
      ));
    } else {
      setCartItems([...cartItems, { product, customization, quantity: 1 }]);
    }
    
    toast.success(`${product.name} added to cart!`);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
    toast.info("Item removed from cart");
  };

  const handleCustomize = (product: Product) => {
    setSelectedProduct(product);
    setTimeout(() => {
      document.getElementById('customize')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCheckout = () => {
    toast.success("Proceeding to checkout...", {
      description: "Payment integration coming soon!"
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation 
        cartItemCount={cartItems.length}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <Hero />
      
      <ProductCatalog 
        onAddToCart={(product) => handleAddToCart(product)}
        onCustomize={handleCustomize}
      />
      
      <CustomizationTool 
        selectedProduct={selectedProduct}
        onAddToCart={handleAddToCart}
      />
      
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
      
      <footer className="bg-card py-12 border-t">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            StyleCraft
          </h3>
          <p className="text-muted-foreground">
            Create your unique style with custom apparel
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            © 2025 StyleCraft. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;