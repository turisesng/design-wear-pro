import { useState } from "react";
import { ProductCard, Product } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductCatalogProps {
  onAddToCart: (product: Product) => void;
  onCustomize: (product: Product) => void;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Classic Cotton Tee",
    category: "T-Shirt",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    colors: ["#ffffff", "#000000", "#3b82f6", "#ef4444"]
  },
  {
    id: "2",
    name: "Premium Hoodie",
    category: "Hoodie",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
    colors: ["#1f2937", "#6b7280", "#8b5cf6"]
  },
  {
    id: "3",
    name: "Vintage Crew Neck",
    category: "T-Shirt",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80",
    colors: ["#f3f4f6", "#fecaca", "#bfdbfe"]
  },
  {
    id: "4",
    name: "Sporty Tank Top",
    category: "Tank",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=500&q=80",
    colors: ["#ffffff", "#000000", "#f59e0b"]
  },
  {
    id: "5",
    name: "Baseball Cap",
    category: "Cap",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80",
    colors: ["#1f2937", "#ef4444", "#ffffff"]
  },
  {
    id: "6",
    name: "Comfort Sweatshirt",
    category: "Hoodie",
    price: 44.99,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80",
    colors: ["#6366f1", "#ec4899", "#10b981"]
  }
];

export const ProductCatalog = ({ onAddToCart, onCustomize }: ProductCatalogProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  const categories = ["All", "T-Shirt", "Hoodie", "Tank", "Cap"];
  
  const filteredProducts = selectedCategory === "All" 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(p => p.category === selectedCategory);

  return (
    <section id="catalog" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12 space-y-4 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Browse Our Collection
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our premium selection of customizable apparel
          </p>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-12">
          <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-5 h-auto">
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onCustomize={onCustomize}
            />
          ))}
        </div>
      </div>
    </section>
  );
};