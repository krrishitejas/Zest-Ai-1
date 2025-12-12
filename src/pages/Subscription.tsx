import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Crown, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";
import BottomNav from "@/components/layout/BottomNav";
import { loadRazorpay } from "@/lib/razorpay";

// Declare Razorpay on window object
declare global {
  interface Window {
    Razorpay: any;
  }
}

const Subscription = () => {
  const navigate = useNavigate();
  const { isPro, upgradeToPro, user } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  const proFeatures = [
    "Ad-Free Experience",
    "Unlimited Vehicles",
    "OCR Receipt Scanning",
    "Advanced Analytics & Reports",
    "Cloud Backup & Sync",
    "Priority Customer Support",
    "Export Data (PDF/Excel)",
    "Custom Service Reminders",
  ];

  const handleUpgrade = async () => {
    setIsLoading(true);

    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      toast.error("Failed to load payment gateway. Please check your internet connection.");
      setIsLoading(false);
      return;
    }

    // TODO: Replace with your actual Razorpay Key ID
    // You can get this from https://dashboard.razorpay.com/app/keys
    const RAZORPAY_KEY_ID = "rzp_test_YOUR_KEY_HERE";

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: 49900, // Amount in paise (499 * 100)
      currency: "INR",
      name: "ZEST Car Care",
      description: "ZEST Pro Subscription (1 Year)",
      image: "/favicon.ico", // You can replace this with your logo URL
      handler: function (response: any) {
        // Payment Success
        console.log("Payment successful:", response);
        upgradeToPro();
        toast.success("Payment successful! Welcome to ZEST Pro.");
        setIsLoading(false);
      },
      prefill: {
        name: user?.displayName || "User",
        email: user?.email || "",
        contact: "", // You can add phone number here if available
      },
      theme: {
        color: "#3B82F6", // Primary color
      },
      modal: {
        ondismiss: function () {
          setIsLoading(false);
          toast.info("Payment cancelled");
        }
      }
    };

    try {
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
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

        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-8 h-8 text-yellow-400" />
          <h1 className="text-2xl font-bold text-white">ZEST Pro</h1>
        </div>
        <p className="text-white/80">Unlock premium features</p>
      </div>

      {/* Current Plan */}
      <div className="px-6 mt-6">
        <Card className="shadow-card border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Plan</CardTitle>
              <Badge variant={isPro ? "default" : "secondary"}>
                {isPro ? "Pro" : "Free"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isPro ? (
              <div className="text-center py-4">
                <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-3" />
                <p className="text-lg font-semibold mb-2">You're on ZEST Pro!</p>
                <p className="text-sm text-muted-foreground">
                  Enjoy unlimited access to all premium features
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  Upgrade to Pro to unlock advanced features
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pricing */}
      {!isPro && (
        <div className="px-6 mt-6">
          <Card className="shadow-elevated border-2 border-primary">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="w-6 h-6 text-yellow-400" />
                <CardTitle className="text-2xl">ZEST Pro</CardTitle>
              </div>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-bold">₹499</span>
                <span className="text-muted-foreground">/year</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                That's just ₹42/month
              </p>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-gradient-accent mb-6"
                size="lg"
                onClick={handleUpgrade}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Crown className="w-5 h-5 mr-2" />
                    Upgrade to Pro
                  </>
                )}
              </Button>

              <div className="space-y-3">
                <p className="font-semibold mb-3">What's included:</p>
                {proFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-full p-1">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  Cancel anytime. 30-day money-back guarantee.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pro Features */}
      <div className="px-6 mt-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Pro Features</h2>

        <div className="space-y-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">📸 OCR Receipt Scanning</h3>
              <p className="text-sm text-muted-foreground">
                Automatically extract expense details from receipts using advanced OCR technology
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">📊 Advanced Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Get detailed insights into your vehicle expenses with comprehensive reports and trends
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">🚗 Unlimited Vehicles</h3>
              <p className="text-sm text-muted-foreground">
                Manage as many vehicles as you want without any limitations
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">☁️ Cloud Backup</h3>
              <p className="text-sm text-muted-foreground">
                Your data is automatically backed up and synced across all your devices
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Subscription;
