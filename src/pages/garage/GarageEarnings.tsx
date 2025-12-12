import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Calendar, TrendingDown } from "lucide-react";
import GarageBottomNav from "@/components/layout/GarageBottomNav";
import { useApp } from "@/contexts/AppContext";
import { format, isSameMonth, subMonths, parseISO } from "date-fns";

const GarageEarnings = () => {
    const { bookings } = useApp();
    const now = new Date();
    const lastMonth = subMonths(now, 1);

    // Filter completed bookings
    const completedBookings = bookings.filter(b => b.status === "completed").sort((a, b) => {
        return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    });

    // Calculate Revenues
    const thisMonthRevenue = completedBookings
        .filter(b => b.date && isSameMonth(new Date(b.date), now))
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const lastMonthRevenue = completedBookings
        .filter(b => b.date && isSameMonth(new Date(b.date), lastMonth))
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    // Calculate Growth
    let growthPercentage = 0;
    if (lastMonthRevenue > 0) {
        growthPercentage = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    } else if (thisMonthRevenue > 0) {
        growthPercentage = 100; // 100% growth if last month was 0
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-gradient-primary px-6 pt-12 pb-8 rounded-b-3xl text-white">
                <h1 className="text-2xl font-bold mb-2">Earnings</h1>
                <p className="opacity-80 mb-6">Track your revenue</p>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                    <p className="text-sm opacity-80 mb-1">Total Revenue (This Month)</p>
                    <h2 className="text-4xl font-bold">₹{thisMonthRevenue.toLocaleString()}</h2>
                    <div className={`flex items-center justify-center gap-1 mt-2 text-sm ${growthPercentage >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                        {growthPercentage >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span>{Math.abs(growthPercentage).toFixed(1)}% from last month</span>
                    </div>
                </div>
            </div>

            <div className="px-6 mt-6">
                <h3 className="font-semibold mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                    {completedBookings.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">No completed transactions yet.</p>
                    ) : (
                        completedBookings.map((booking) => (
                            <Card key={booking.id} className="shadow-card">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-100 p-2 rounded-full">
                                            <DollarSign className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{booking.customerName || "Customer Payment"}</p>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Calendar className="w-3 h-3" />
                                                <span>
                                                    {booking.date ? format(new Date(booking.date), "MMM d, yyyy") : "Unknown Date"} • {booking.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="font-bold text-green-600">+₹{booking.totalPrice?.toLocaleString()}</span>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            <GarageBottomNav />
        </div>
    );
};

export default GarageEarnings;
