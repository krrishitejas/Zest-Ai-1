import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import BottomNav from "@/components/layout/BottomNav";

const Bookings = () => {
  const navigate = useNavigate();
  const { bookings, vehicles } = useApp();

  const upcomingBookings = bookings.filter(b => b.status === "upcoming");
  const pastBookings = bookings.filter(b => b.status === "completed");

  const getVehicle = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const BookingCard = ({ booking }: { booking: any }) => {
    const vehicle = getVehicle(booking.vehicleId);
    
    return (
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg mb-1">{booking.garageName}</h3>
              {vehicle && (
                <p className="text-sm text-muted-foreground">
                  {vehicle.make} {vehicle.model} ({vehicle.plate})
                </p>
              )}
            </div>
            <Badge
              variant={booking.status === "upcoming" ? "default" : "secondary"}
            >
              {booking.status}
            </Badge>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{formatDate(booking.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{booking.time}</span>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-sm font-medium mb-1">Services:</p>
            <div className="flex flex-wrap gap-2">
              {booking.services.map((service: string, index: number) => (
                <Badge key={index} variant="outline">
                  {service}
                </Badge>
              ))}
            </div>
          </div>

          {booking.totalPrice && (
            <div className="flex items-center justify-between pt-3 border-t">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-lg font-bold">₹{booking.totalPrice}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
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
        
        <h1 className="text-2xl font-bold text-white">My Bookings</h1>
      </div>

      {/* Bookings List */}
      <div className="px-6 mt-6">
        {bookings.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-6">
                Book your first service to get started
              </p>
              <Button
                className="bg-gradient-accent"
                onClick={() => navigate("/garages")}
              >
                Find Garages
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingBookings.length === 0 ? (
                <Card className="shadow-card">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No upcoming bookings</p>
                  </CardContent>
                </Card>
              ) : (
                upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastBookings.length === 0 ? (
                <Card className="shadow-card">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No past bookings</p>
                  </CardContent>
                </Card>
              ) : (
                pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Bookings;
