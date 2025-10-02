import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, FabricText, FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Type, Image, RotateCcw, ShoppingCart } from "lucide-react";
import { Product } from "./ProductCard";
import { toast } from "sonner";

interface CustomizationToolProps {
  selectedProduct: Product | null;
  onAddToCart: (product: Product, customization: any) => void;
}

export const CustomizationTool = ({ selectedProduct, onAddToCart }: CustomizationToolProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState("40");
  const [textColor, setTextColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 500,
      height: 600,
      backgroundColor: "#f5f5f5",
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  const addText = () => {
    if (!fabricCanvas || !text) {
      toast.error("Please enter text to add");
      return;
    }

    const fabricText = new FabricText(text, {
      left: 100,
      top: 100,
      fontSize: parseInt(fontSize),
      fill: textColor,
      fontFamily: fontFamily,
    });

    fabricCanvas.add(fabricText);
    fabricCanvas.setActiveObject(fabricText);
    fabricCanvas.renderAll();
    toast.success("Text added to design");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target?.result as string;
      FabricImage.fromURL(imgUrl).then((img) => {
        img.scaleToWidth(200);
        img.set({ left: 150, top: 150 });
        fabricCanvas.add(img);
        fabricCanvas.renderAll();
        toast.success("Image added to design");
      });
    };
    reader.readAsDataURL(file);
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#f5f5f5";
    fabricCanvas.renderAll();
    toast.info("Design cleared");
  };

  const handleAddToCart = () => {
    if (!selectedProduct) {
      toast.error("No product selected");
      return;
    }
    
    const customization = fabricCanvas?.toJSON();
    onAddToCart(selectedProduct, customization);
    toast.success("Custom design added to cart!");
  };

  if (!selectedProduct) {
    return (
      <section id="customize" className="py-20 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Customize Your Product</h2>
          <p className="text-muted-foreground text-lg">Select a product from the catalog to start customizing</p>
        </div>
      </section>
    );
  }

  return (
    <section id="customize" className="py-20 px-4 bg-gradient-hero">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Design Your {selectedProduct.name}
          </h2>
          <p className="text-xl text-muted-foreground">
            Add custom text and images to create your unique style
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-hover animate-scale-in">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="relative">
                <canvas ref={canvasRef} className="border-2 border-border rounded-lg shadow-card" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-hover animate-scale-in">
            <CardHeader>
              <CardTitle>Design Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">
                    <Type className="h-4 w-4 mr-2" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="image">
                    <Image className="h-4 w-4 mr-2" />
                    Image
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="text">Your Text</Label>
                    <Input
                      id="text"
                      placeholder="Enter your text..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fontSize">Size</Label>
                      <Select value={fontSize} onValueChange={setFontSize}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="20">Small</SelectItem>
                          <SelectItem value="40">Medium</SelectItem>
                          <SelectItem value="60">Large</SelectItem>
                          <SelectItem value="80">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="color"
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-full h-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="font">Font</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Courier New">Courier New</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Verdana">Verdana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={addText} className="w-full" variant="secondary">
                    Add Text to Design
                  </Button>
                </TabsContent>

                <TabsContent value="image" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">Upload Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload your own logo or design. Supported formats: JPG, PNG, SVG
                  </p>
                </TabsContent>
              </Tabs>

              <div className="mt-6 pt-6 border-t space-y-3">
                <Button 
                  onClick={clearCanvas} 
                  variant="outline" 
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear Design
                </Button>
                <Button 
                  onClick={handleAddToCart} 
                  variant="hero" 
                  size="lg"
                  className="w-full"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart - ${selectedProduct.price}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};