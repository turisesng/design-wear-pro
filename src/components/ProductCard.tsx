import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  colors: string[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onCustomize: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart, onCustomize }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-hover transition-all duration-300 bg-gradient-card border-border/50 animate-scale-in">
      <CardContent className="p-0">
        <div className="relative overflow-hidden aspect-square">
          <img 
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
            {product.category}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 p-4">
        <div className="w-full flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <div className="flex gap-1 mt-2">
              {product.colors.map((color, index) => (
                <div 
                  key={index}
                  className="w-5 h-5 rounded-full border-2 border-border"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <p className="text-2xl font-bold text-primary">${product.price}</p>
        </div>
        <div className="w-full flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onCustomize(product)}
          >
            Customize
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};