import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Crown, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";
import GarageBottomNav from "@/components/layout/GarageBottomNav";
import { loadRazorpay } from "@/lib/razorpay";

// Declare Razorpay on window object
declare global {
    interface Window {
        Razorpay: any;
    }
}

const GarageSubscription = () => {
    const navigate = useNavigate();
    const { isPro, upgradeToPro, user } = useApp();
    const [isLoading, setIsLoading] = useState(false);

    const proFeatures = [
        "Verified Garage Badge",
        "Top Listing in Search Results",
        "Advanced Business Analytics",
        "Unlimited Service Listings",
        "Priority Support",
        "Marketing Tools",
        "Customer CRM",
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
        const RAZORPAY_KEY_ID = "rzp_test_YOUR_KEY_HERE";

        const options = {
            key: RAZORPAY_KEY_ID,
            amount: 99900, // Amount in paise (999 * 100)
            currency: "INR",
            name: "ZEST Car Care",
            description: "ZEST Garage Pro (1 Year)",
            image: "/favicon.ico",
            handler: function (response: any) {
                console.log("Payment successful:", response);
                upgradeToPro();
                toast.success("Payment successful! You are now a Pro Garage.");
                setIsLoading(false);
            },
            prefill: {
                name: user?.displayName || "Garage Owner",
                email: user?.email || "",
                contact: "",
            },
            theme: {
                color: "#3B82F6",
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
                    <h1 className="text-2xl font-bold text-white">Garage Pro</h1>
                </div>
                <p className="text-white/80">Grow your business with premium tools</p>
            </div>

            {/* Current Plan */}
            <div className="px-6 mt-6">
                <Card className="shadow-card border-2 border-primary/20">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Current Plan</CardTitle>
                            <Badge variant={isPro ? "default" : "secondary"}>
                                {isPro ? "Pro" : "Basic"}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isPro ? (
                            <div className="text-center py-4">
                                <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-3" />
                                <p className="text-lg font-semibold mb-2">You're a Pro Garage!</p>
                                <p className="text-sm text-muted-foreground">
                                    Enjoy all premium business features
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-muted-foreground">
                                    Upgrade to Pro to boost your visibility and sales
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
                                <CardTitle className="text-2xl">Garage Pro</CardTitle>
                            </div>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-4xl font-bold">₹999</span>
                                <span className="text-muted-foreground">/year</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                Less than ₹85/month
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

            <GarageBottomNav />
        </div>
    );
};

export default GarageSubscription;
