import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, FabricText, FabricImage, Circle, Ellipse, Rect, Group } from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Type, Image, RotateCcw, ShoppingCart, Circle as CircleIcon, Square, Star } from "lucide-react";
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
  
  // Badge shape states
  const [badgeText, setBadgeText] = useState("");
  const [badgeShape, setBadgeShape] = useState<"circle" | "oval" | "rectangle" | "rounded" | "star">("circle");
  const [badgeFillColor, setBadgeFillColor] = useState("#2d5a3d");
  const [badgeBorderColor, setBadgeBorderColor] = useState("#ffffff");
  const [badgeBorderWidth, setBadgeBorderWidth] = useState("3");
  const [badgeTextColor, setBadgeTextColor] = useState("#ffffff");
  const [badgeFontSize, setBadgeFontSize] = useState("30");

  useEffect(() => {
    if (!canvasRef.current || !selectedProduct) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 500,
      height: 600,
      backgroundColor: "#ffffff",
    });

    // Load product image onto canvas
    FabricImage.fromURL(selectedProduct.image).then((img) => {
      img.scaleToWidth(500);
      img.scaleToHeight(600);
      img.set({ 
        left: 0, 
        top: 0,
        selectable: false,
        evented: false
      });
      canvas.add(img);
      canvas.sendObjectToBack(img);
      canvas.renderAll();
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [selectedProduct]);

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

  const addBadgeShape = () => {
    if (!fabricCanvas || !badgeText) {
      toast.error("Please enter text for the badge");
      return;
    }

    let shape: Circle | Ellipse | Rect;
    let shapeWidth = 0;
    let shapeHeight = 0;
    
    const shapeOptions = {
      fill: badgeFillColor,
      stroke: badgeBorderColor,
      strokeWidth: parseInt(badgeBorderWidth),
      originX: "center" as const,
      originY: "center" as const,
    };

    if (badgeShape === "circle") {
      const radius = 70;
      shape = new Circle({
        ...shapeOptions,
        radius: radius,
      });
      shapeWidth = shapeHeight = radius * 1.4; // Diameter with padding for text
    } else if (badgeShape === "oval") {
      shape = new Ellipse({
        ...shapeOptions,
        rx: 90,
        ry: 55,
      });
      shapeWidth = 160;
      shapeHeight = 90;
    } else if (badgeShape === "rectangle") {
      shape = new Rect({
        ...shapeOptions,
        width: 160,
        height: 90,
        rx: 0,
        ry: 0,
      });
      shapeWidth = 140;
      shapeHeight = 70;
    } else if (badgeShape === "rounded") {
      shape = new Rect({
        ...shapeOptions,
        width: 160,
        height: 90,
        rx: 20,
        ry: 20,
      });
      shapeWidth = 140;
      shapeHeight = 70;
    } else { // star
      shape = new Rect({
        ...shapeOptions,
        width: 130,
        height: 130,
        rx: 15,
        ry: 15,
        angle: 45,
      });
      shapeWidth = shapeHeight = 90;
    }

    // Create text and scale it to fit within the shape
    const text = new FabricText(badgeText, {
      fontSize: parseInt(badgeFontSize),
      fill: badgeTextColor,
      fontFamily: fontFamily,
      textAlign: "center",
      originX: "center",
      originY: "center",
    });

    // Calculate scale to fit text within shape bounds
    const textWidth = text.width || 1;
    const textHeight = text.height || 1;
    const scaleX = Math.min(1, (shapeWidth * 0.8) / textWidth);
    const scaleY = Math.min(1, (shapeHeight * 0.8) / textHeight);
    const scale = Math.min(scaleX, scaleY);
    
    text.scale(scale);

    // Position text at center of shape (both have center origin)
    text.set({
      left: 0,
      top: 0,
    });

    shape.set({
      left: 0,
      top: 0,
    });

    const group = new Group([shape, text], {
      left: 250,
      top: 250,
    });

    fabricCanvas.add(group);
    fabricCanvas.setActiveObject(group);
    fabricCanvas.renderAll();
    toast.success("Badge added to design");
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
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="text">
                    <Type className="h-4 w-4 mr-2" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="badge">
                    <CircleIcon className="h-4 w-4 mr-2" />
                    Badge
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

                <TabsContent value="badge" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="badgeText">Badge Text</Label>
                    <Input
                      id="badgeText"
                      placeholder="Enter badge text..."
                      value={badgeText}
                      onChange={(e) => setBadgeText(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Badge Shape</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={badgeShape === "circle" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setBadgeShape("circle")}
                        className="flex flex-col items-center gap-1 h-auto py-2"
                      >
                        <CircleIcon className="h-5 w-5" />
                        <span className="text-xs">Circle</span>
                      </Button>
                      <Button
                        variant={badgeShape === "oval" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setBadgeShape("oval")}
                        className="flex flex-col items-center gap-1 h-auto py-2"
                      >
                        <CircleIcon className="h-5 w-5 scale-x-150" />
                        <span className="text-xs">Oval</span>
                      </Button>
                      <Button
                        variant={badgeShape === "rectangle" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setBadgeShape("rectangle")}
                        className="flex flex-col items-center gap-1 h-auto py-2"
                      >
                        <Square className="h-5 w-5" />
                        <span className="text-xs">Rectangle</span>
                      </Button>
                      <Button
                        variant={badgeShape === "rounded" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setBadgeShape("rounded")}
                        className="flex flex-col items-center gap-1 h-auto py-2"
                      >
                        <Square className="h-5 w-5 rounded-md" />
                        <span className="text-xs">Rounded</span>
                      </Button>
                      <Button
                        variant={badgeShape === "star" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setBadgeShape("star")}
                        className="flex flex-col items-center gap-1 h-auto py-2"
                      >
                        <Star className="h-5 w-5" />
                        <span className="text-xs">Star</span>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="badgeFontSize">Text Size</Label>
                      <Select value={badgeFontSize} onValueChange={setBadgeFontSize}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="16">Small</SelectItem>
                          <SelectItem value="24">Medium</SelectItem>
                          <SelectItem value="30">Large</SelectItem>
                          <SelectItem value="40">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="badgeTextColor">Text Color</Label>
                      <Input
                        id="badgeTextColor"
                        type="color"
                        value={badgeTextColor}
                        onChange={(e) => setBadgeTextColor(e.target.value)}
                        className="w-full h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="badgeFillColor">Fill Color</Label>
                      <Input
                        id="badgeFillColor"
                        type="color"
                        value={badgeFillColor}
                        onChange={(e) => setBadgeFillColor(e.target.value)}
                        className="w-full h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="badgeBorderColor">Border Color</Label>
                      <Input
                        id="badgeBorderColor"
                        type="color"
                        value={badgeBorderColor}
                        onChange={(e) => setBadgeBorderColor(e.target.value)}
                        className="w-full h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="badgeBorderWidth">Border Width</Label>
                    <Select value={badgeBorderWidth} onValueChange={setBadgeBorderWidth}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">None</SelectItem>
                        <SelectItem value="2">Thin</SelectItem>
                        <SelectItem value="3">Medium</SelectItem>
                        <SelectItem value="5">Thick</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={addBadgeShape} className="w-full" variant="secondary">
                    Add Badge to Design
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