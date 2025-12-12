import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Car, Phone } from "lucide-react";
import GarageBottomNav from "@/components/layout/GarageBottomNav";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { format } from "date-fns";
import { toast } from "sonner";

const GarageBookings = () => {
    const { bookings, updateBooking } = useApp();
    const [filter, setFilter] = useState<"upcoming" | "completed">("upcoming");

    const filteredBookings = bookings.filter(b => b.status === filter);

    const handleStatusUpdate = async (id: string, newStatus: "completed" | "cancelled") => {
        await updateBooking(id, { status: newStatus });
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-gradient-primary px-6 pt-12 pb-8 rounded-b-3xl">
                <h1 className="text-2xl font-bold text-white mb-6">Bookings</h1>
                <div className="flex p-1 bg-white/20 rounded-xl backdrop-blur-sm">
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${filter === "upcoming" ? "bg-white text-primary shadow-sm" : "text-white hover:bg-white/10"
                            }`}
                        onClick={() => setFilter("upcoming")}
                    >
                        Upcoming
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${filter === "completed" ? "bg-white text-primary shadow-sm" : "text-white hover:bg-white/10"
                            }`}
                        onClick={() => setFilter("completed")}
                    >
                        Completed
                    </button>
                </div>
            </div>

            <div className="px-6 mt-6 space-y-4">
                {filteredBookings.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        No {filter} bookings found.
                    </div>
                ) : (
                    filteredBookings.map((booking) => (
                        <Card key={booking.id} className="shadow-card">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-2 rounded-full">
                                            <User className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{booking.customerName || "Unknown Customer"}</h3>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Phone className="w-3 h-3" />
                                                {booking.customerPhone || "No phone"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-sm font-medium text-primary">
                                            <Clock className="w-4 h-4" />
                                            {booking.time}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {booking.date ? format(new Date(booking.date), "MMM d, yyyy") : "No date"}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Car className="w-4 h-4 text-muted-foreground" />
                                        {/* In a real app, we'd fetch vehicle details using vehicleId */}
                                        <span>Vehicle ID: {booking.vehicleId.slice(0, 6)}...</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span>{booking.services.join(", ")}</span>
                                    </div>
                                </div>

                                {filter === "upcoming" && (
                                    <div className="flex flex-col gap-3 mt-4">
                                        <div className="flex gap-3">
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-primary text-primary hover:bg-primary hover:text-white"
                                                onClick={() => window.location.href = `tel:${booking.customerPhone}`}
                                            >
                                                <Phone className="w-4 h-4 mr-2" />
                                                Call
                                            </Button>
                                            <Button
                                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                                onClick={() => {
                                                    toast.success(`Booking confirmed! Email and SMS sent to ${booking.customerName || "customer"}.`);
                                                    // In a real app, this would trigger a backend function
                                                }}
                                            >
                                                Accept & Notify
                                            </Button>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-white"
                                                onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                                            >
                                                Reject
                                            </Button>
                                            <Button
                                                className="flex-1 bg-green-600 hover:bg-green-700"
                                                onClick={() => handleStatusUpdate(booking.id, "completed")}
                                            >
                                                Complete
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <GarageBottomNav />
        </div>
    );
};

export default GarageBookings;
