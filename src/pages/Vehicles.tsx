import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Car, Plus, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import BottomNav from "@/components/layout/BottomNav";

const Vehicles = () => {
  const navigate = useNavigate();
  const { vehicles, selectedVehicleId, selectVehicle } = useApp();

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
        
        <h1 className="text-2xl font-bold text-white">My Vehicles</h1>
        <p className="text-white/80 text-sm">Manage your vehicles</p>
      </div>

      {/* Vehicle List */}
      <div className="px-6 mt-6">
        {vehicles.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-12 text-center">
              <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No vehicles added yet</h3>
              <p className="text-muted-foreground mb-6">
                Add your first vehicle to get started
              </p>
              <Button
                className="bg-gradient-accent"
                onClick={() => navigate("/add-vehicle")}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Vehicle
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {vehicles.map((vehicle) => (
                <Card
                  key={vehicle.id}
                  className={`shadow-card cursor-pointer transition-all ${
                    selectedVehicleId === vehicle.id
                      ? "border-2 border-primary"
                      : ""
                  }`}
                  onClick={() => selectVehicle(vehicle.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 rounded-xl p-3">
                        <Car className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">
                            {vehicle.make} {vehicle.model}
                          </h3>
                          {selectedVehicleId === vehicle.id && (
                            <Badge variant="secondary" className="gap-1">
                              <Check className="w-3 h-3" />
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.year} • {vehicle.plate}
                        </p>
                        {vehicle.vin && (
                          <p className="text-xs text-muted-foreground mt-1">
                            VIN: {vehicle.vin}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              className="w-full bg-gradient-accent"
              size="lg"
              onClick={() => navigate("/add-vehicle")}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Another Vehicle
            </Button>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Vehicles;
