import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-tshirt.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-20">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Create Your Unique Style</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Design Your
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                Perfect Apparel
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl">
              Customize T-shirts, hoodies, and more with our intuitive design tool. 
              Express yourself with unique text, graphics, and colors.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => document.getElementById('customize')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Designing
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse Products
              </Button>
            </div>
            
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Designs Created</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">50+</div>
                <div className="text-sm text-muted-foreground">Products Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">4.9★</div>
                <div className="text-sm text-muted-foreground">Customer Rating</div>
              </div>
            </div>
          </div>
          
          <div className="relative animate-slide-up">
            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full"></div>
            <img 
              src={heroImage}
              alt="Customizable T-shirt showcase"
              className="relative rounded-2xl shadow-hover animate-float w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};