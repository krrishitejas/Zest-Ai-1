import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Calendar as CalendarIcon, Check, Loader2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const BookService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBooking, selectedVehicleId, vehicles } = useApp();

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [step, setStep] = useState(1);
  const [garage, setGarage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Default services
  const defaultServices = [
    { name: "Oil Change", price: 1500, duration: "30 mins" },
    { name: "Tire Service", price: 2500, duration: "45 mins" },
    { name: "Engine Repair", price: 5000, duration: "2 hours" },
    { name: "Brake Service", price: 3500, duration: "1 hour" },
    { name: "AC Service", price: 2000, duration: "45 mins" },
    { name: "Battery Replacement", price: 4000, duration: "30 mins" },
  ];

  useEffect(() => {
    const fetchGarage = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setGarage({
            id: docSnap.id,
            name: data.displayName || "Garage Name",
            services: data.services || defaultServices
          });
        }
      } catch (error) {
        console.error("Error fetching garage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGarage();
  }, [id]);

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
  ];

  const toggleService = (serviceName: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceName)
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const getTotalPrice = () => {
    if (!garage) return 0;
    return garage.services
      .filter((s: any) => selectedServices.includes(s.name))
      .reduce((sum: number, s: any) => sum + s.price, 0);
  };

  const handleConfirmBooking = () => {
    if (!selectedVehicleId) {
      toast.error("Please add a vehicle first");
      return;
    }

    if (selectedServices.length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Please select date and time");
      return;
    }

    if (!garage) return;

    addBooking({
      vehicleId: selectedVehicleId,
      garageId: garage.id,
      garageName: garage.name,
      services: selectedServices,
      date: selectedDate.toISOString(),
      time: selectedTime,
      status: "upcoming",
      totalPrice: getTotalPrice(),
    });

    toast.success("Booking confirmed!");
    navigate("/bookings");
  };

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

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

        <h1 className="text-2xl font-bold text-white mb-2">Book Service</h1>
        <p className="text-white/80">{garage.name}</p>

        {selectedVehicle && (
          <p className="text-white/70 text-sm mt-2">
            {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.plate})
          </p>
        )}
      </div>

      {/* Step Indicator */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= num
                    ? "bg-gradient-accent text-white"
                    : "bg-muted text-muted-foreground"
                  }`}
              >
                {step > num ? <Check className="w-5 h-5" /> : num}
              </div>
              {num < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${step > num ? "bg-gradient-accent" : "bg-muted"
                    }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Select Services */}
      {step === 1 && (
        <div className="px-6">
          <h2 className="text-xl font-bold mb-4">Select Services</h2>
          <div className="space-y-3">
            {garage.services.map((service: any, index: number) => (
              <Card
                key={index}
                className={`shadow-card cursor-pointer transition-all ${selectedServices.includes(service.name)
                    ? "border-2 border-primary"
                    : ""
                  }`}
                onClick={() => toggleService(service.name)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <Checkbox
                    checked={selectedServices.includes(service.name)}
                    onCheckedChange={() => toggleService(service.name)}
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{service.name}</p>
                    <p className="text-sm text-muted-foreground">{service.duration}</p>
                  </div>
                  <p className="font-bold">₹{service.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedServices.length > 0 && (
            <Card className="shadow-card mt-6">
              <CardContent className="p-4 flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold">₹{getTotalPrice()}</span>
              </CardContent>
            </Card>
          )}

          <Button
            className="w-full mt-6 bg-gradient-accent"
            size="lg"
            disabled={selectedServices.length === 0}
            onClick={() => setStep(2)}
          >
            Continue
          </Button>
        </div>
      )}

      {/* Step 2: Select Date & Time */}
      {step === 2 && (
        <div className="px-6">
          <h2 className="text-xl font-bold mb-4">Select Date & Time</h2>

          <Card className="shadow-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Choose Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <h3 className="text-lg font-semibold mb-3">Available Time Slots</h3>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                className={selectedTime === time ? "bg-gradient-accent" : ""}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button
              className="flex-1 bg-gradient-accent"
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep(3)}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="px-6">
          <h2 className="text-xl font-bold mb-4">Confirm Booking</h2>

          <Card className="shadow-card mb-4">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Garage</p>
                <p className="font-semibold">{garage.name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Services</p>
                {selectedServices.map((service, index) => (
                  <p key={index} className="font-medium">{service}</p>
                ))}
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="font-semibold">
                  {selectedDate?.toLocaleDateString()} at {selectedTime}
                </p>
              </div>

              <div className="pt-3 border-t">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold">Total Amount</span>
                  <span className="font-bold text-primary">₹{getTotalPrice()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep(2)}
            >
              Back
            </Button>
            <Button
              className="flex-1 bg-gradient-accent"
              size="lg"
              onClick={handleConfirmBooking}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookService;
