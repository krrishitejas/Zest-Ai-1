import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, MapPin, Phone, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const GarageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [garage, setGarage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGarage = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGarage({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching garage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGarage();
  }, [id]);

  // Default services if not present in garage data
  const defaultServices = [
    { name: "Oil Change", price: 1500, duration: "30 mins" },
    { name: "Tire Service", price: 2500, duration: "45 mins" },
    { name: "Engine Repair", price: 5000, duration: "2 hours" },
    { name: "Brake Service", price: 3500, duration: "1 hour" },
    { name: "AC Service", price: 2000, duration: "45 mins" },
    { name: "Battery Replacement", price: 4000, duration: "30 mins" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!garage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <h1 className="text-xl font-bold mb-4">Garage Not Found</h1>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-primary px-6 pt-12 pb-6 rounded-b-3xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-white hover:bg-white/20 mb-4"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>

        <div className="flex items-start gap-4">
          <div className="text-6xl">🔧</div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">{garage.displayName || "Garage Name"}</h1>
            <div className="flex items-center gap-2 text-white/90 text-sm mb-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">4.8</span>
              </div>
              <span>(120 reviews)</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <MapPin className="w-4 h-4" />
              <span>2.5 km away</span>
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="px-6 mt-6">
        <Card className="shadow-card">
          <CardContent className="p-5">
            <h2 className="text-lg font-bold mb-3">About</h2>
            <p className="text-muted-foreground mb-4">
              {garage.description || "Professional car care service provider committed to quality and customer satisfaction."}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {["Certified Mechanics", "Warranty on Services", "Genuine Parts"].map((feature, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {feature}
                </Badge>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>{garage.address || "Bangalore, Karnataka"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>{garage.phoneNumber || "+91 98765 43210"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>Mon-Sat: 9:00 AM - 7:00 PM</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services */}
      <div className="px-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Services Offered</h2>
        <div className="space-y-3">
          {(garage.services || defaultServices).map((service: any, index: number) => (
            <Card key={index} className="shadow-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{service.name}</p>
                  <p className="text-sm text-muted-foreground">{service.duration}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹{service.price}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 shadow-elevated z-50">
        <div className="max-w-screen-sm mx-auto flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => window.open(`tel:${garage.phoneNumber || ""}`)}
          >
            <Phone className="w-5 h-5 mr-2" />
            Call Now
          </Button>
          <Button
            size="lg"
            className="flex-1 bg-gradient-accent"
            onClick={() => navigate(`/book-service/${garage.id}`)}
          >
            Book Service
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GarageDetail;
