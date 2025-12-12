import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Calendar, MapPin, DollarSign, Gauge } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import BottomNav from "@/components/layout/BottomNav";

const ServiceHistory = () => {
  const navigate = useNavigate();
  const { serviceHistory, vehicles, selectedVehicleId } = useApp();

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
  const vehicleHistory = serviceHistory.filter(h => h.vehicleId === selectedVehicleId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
        
        <h1 className="text-2xl font-bold text-white mb-2">Service History</h1>
        {selectedVehicle && (
          <p className="text-white/80 text-sm">
            {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.plate})
          </p>
        )}
      </div>

      {/* History List */}
      <div className="px-6 mt-6 mb-6">
        {vehicleHistory.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No service history yet</h3>
              <p className="text-muted-foreground mb-6">
                Start tracking your vehicle maintenance
              </p>
              <Button
                className="bg-gradient-accent"
                onClick={() => navigate("/add-service-history")}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Service Record
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {vehicleHistory
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry) => (
                  <Card key={entry.id} className="shadow-card">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{entry.type}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(entry.date)}</span>
                          </div>
                        </div>
                        {entry.cost && (
                          <Badge variant="secondary" className="gap-1">
                            <DollarSign className="w-3 h-3" />
                            ₹{entry.cost}
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2">
                        {entry.odometer && (
                          <div className="flex items-center gap-2 text-sm">
                            <Gauge className="w-4 h-4 text-muted-foreground" />
                            <span>{entry.odometer.toLocaleString()} km</span>
                          </div>
                        )}

                        {entry.garage && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{entry.garage}</span>
                          </div>
                        )}

                        {entry.parts && (
                          <div className="mt-2">
                            <p className="text-sm font-medium mb-1">Parts Used:</p>
                            <p className="text-sm text-muted-foreground">{entry.parts}</p>
                          </div>
                        )}

                        {entry.notes && (
                          <div className="mt-2">
                            <p className="text-sm font-medium mb-1">Notes:</p>
                            <p className="text-sm text-muted-foreground">{entry.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <Button
              className="w-full bg-gradient-accent"
              size="lg"
              onClick={() => navigate("/add-service-history")}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Service Record
            </Button>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default ServiceHistory;
