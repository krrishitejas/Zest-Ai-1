import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Phone, Navigation, Filter, Loader2 } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Garage {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  // Add other fields as they become available in the user profile
}

const Garages = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [garages, setGarages] = useState<Garage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGarages = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "garage"));
        const querySnapshot = await getDocs(q);
        const fetchedGarages = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Garage));
        setGarages(fetchedGarages);
      } catch (error) {
        console.error("Error fetching garages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGarages();
  }, []);

  const filteredGarages = garages.filter(garage =>
    garage.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary px-6 pt-12 pb-8 rounded-b-3xl">
        <h1 className="text-2xl font-bold text-white mb-6">Find Garages</h1>

        <div className="space-y-3">
          <Input
            placeholder="Search for garages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white"
          />

          <div className="flex gap-2">
            <Button variant="outline" className="bg-white flex-1">
              <Navigation className="w-4 h-4 mr-2" />
              Near Me
            </Button>
            <Button variant="outline" className="bg-white">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="px-6 mt-6">
        <Card className="shadow-card overflow-hidden">
          <div className="bg-muted h-48 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
              <p className="text-muted-foreground">Map View Coming Soon</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Garage List */}
      <div className="px-6 mt-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Nearby Garages</h2>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredGarages.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No garages found.</p>
        ) : (
          <div className="space-y-4">
            {filteredGarages.map((garage) => (
              <Card
                key={garage.id}
                className="shadow-card cursor-pointer hover:shadow-elevated transition-shadow"
                onClick={() => navigate(`/garage/${garage.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg mb-1">{garage.displayName || "Unnamed Garage"}</CardTitle>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">4.5</span>
                        </div>
                        <span className="text-muted-foreground">(New)</span>
                        <span className="text-muted-foreground">• 2.5 km</span>
                      </div>
                    </div>
                    <div className="text-3xl">🔧</div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {["General Service", "Repairs", "Wash"].map((service, index) => (
                      <Badge key={index} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-muted-foreground">₹₹</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={(e) => {
                        e.stopPropagation();
                        // Add call functionality
                      }}>
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="bg-gradient-accent">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Garages;
