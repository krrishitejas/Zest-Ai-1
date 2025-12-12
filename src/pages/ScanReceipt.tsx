import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Upload } from "lucide-react";
import { toast } from "sonner";
import { analyzeReceipt } from "@/services/gemini";

const ScanReceipt = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      toast.info("Analyzing receipt with Gemini AI...");
      const data = await analyzeReceipt(file);

      toast.success("Receipt scanned successfully!");
      navigate("/add-expense", {
        state: {
          scannedData: data,
        },
      });
    } catch (error) {
      console.error("Error scanning receipt:", error);
      toast.error("Failed to analyze receipt. Please try again.");
    } finally {
      setIsProcessing(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCaptureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Header */}
      <div className="bg-gradient-primary px-6 pt-12 pb-8 rounded-b-3xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-white hover:bg-white/20 mb-4"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>

        <h1 className="text-2xl font-bold text-white mb-2">Scan Receipt</h1>
        <p className="text-white/80 text-sm">
          Take a photo of your receipt to automatically extract expense details
        </p>
      </div>

      {/* Camera View */}
      <div className="px-6 mt-6">
        <Card className="shadow-card overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-muted aspect-[3/4] flex flex-col items-center justify-center relative">
              {isProcessing ? (
                <div className="text-center p-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-lg font-semibold">Processing Receipt...</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Gemini AI is extracting expense details
                  </p>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                  onClick={handleCaptureClick}
                >
                  <Camera className="w-24 h-24 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">Tap to Capture</p>
                  <p className="text-sm text-muted-foreground px-6 text-center">
                    Make sure all text is clearly visible and well-lit
                  </p>

                  {/* Frame overlay */}
                  <div className="absolute inset-8 border-2 border-dashed border-primary rounded-lg pointer-events-none"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 space-y-3">
          <Button
            className="w-full bg-gradient-accent"
            size="lg"
            onClick={handleCaptureClick}
            disabled={isProcessing}
          >
            <Camera className="w-5 h-5 mr-2" />
            Capture Receipt
          </Button>

          <Button
            variant="outline"
            className="w-full"
            size="lg"
            disabled={isProcessing}
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.removeAttribute("capture");
                fileInputRef.current.click();
                // Restore capture attribute after a short delay if needed, 
                // but usually better to have separate inputs or toggle.
                // For simplicity, we'll just reuse the input and let the OS handle the choice if possible,
                // or just treat both buttons as "Select Image" triggers.
              }
            }}
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload from Gallery
          </Button>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 text-sm">Tips for best results:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ensure good lighting</li>
                <li>• Avoid shadows and glare</li>
                <li>• Keep receipt flat and straight</li>
                <li>• Include entire receipt in frame</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScanReceipt;
