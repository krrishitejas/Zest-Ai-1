import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Calendar, DollarSign, Package, TrendingUp, Users, RefreshCw } from "lucide-react";
import GarageBottomNav from "@/components/layout/GarageBottomNav";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { format, isSameMonth, isSameYear, subMonths, isWithinInterval, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from "date-fns";
import { useEffect, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const GarageDashboard = () => {
    const { user, bookings } = useApp();
    const navigate = useNavigate();
    const [lowStockCount, setLowStockCount] = useState(0);
    const [inventoryCount, setInventoryCount] = useState(0);

    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, `users/${user.uid}/inventory`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => doc.data());
            setInventoryCount(items.length);
            setLowStockCount(items.filter(item => item.stock < 5).length);
        });

        return () => unsubscribe();
    }, [user]);

    const now = new Date();
    const activeBookings = bookings.filter(b => b.status === "upcoming");
    const completedBookings = bookings.filter(b => b.status === "completed");

    // Revenue Calculations
    const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const monthlyRevenue = completedBookings
        .filter(b => b.date && isSameMonth(new Date(b.date), now))
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    // Customer Calculations
    const uniqueCustomers = new Set(bookings.map(b => b.userId));

    // Returning Customers
    const customerCounts = bookings.reduce((acc, b) => {
        acc[b.userId] = (acc[b.userId] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const returningCustomers = Object.values(customerCounts).filter(count => count > 1).length;

    // Time-based Customer Counts
    const getCustomersInPeriod = (start: Date, end: Date) => {
        const bookingsInPeriod = bookings.filter(b =>
            b.date && isWithinInterval(new Date(b.date), { start, end })
        );
        return new Set(bookingsInPeriod.map(b => b.userId)).size;
    };

    const monthlyCustomers = getCustomersInPeriod(startOfMonth(now), endOfMonth(now));
    const quarterlyCustomers = getCustomersInPeriod(startOfQuarter(now), endOfQuarter(now));
    const halfYearlyCustomers = getCustomersInPeriod(subMonths(now, 6), now);
    const yearlyCustomers = getCustomersInPeriod(startOfYear(now), endOfYear(now));

    const stats = [
        {
            label: "Active Bookings",
            value: activeBookings.length.toString(),
            subtext: "Live Updates",
            icon: Calendar,
            color: "text-blue-500"
        },
        {
            label: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            subtext: `₹${monthlyRevenue.toLocaleString()} this month`,
            icon: DollarSign,
            color: "text-green-500"
        },
        {
            label: "Inventory Items",
            value: inventoryCount.toString(),
            subtext: `${lowStockCount} low stock`,
            icon: Package,
            color: "text-orange-500"
        },
        {
            label: "Total Customers",
            value: uniqueCustomers.size.toString(),
            subtext: `${returningCustomers} returning`,
            icon: Users,
            color: "text-purple-500"
        },
    ];

    const recentBookings = bookings.slice(0, 3);

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="bg-gradient-primary px-6 pt-12 pb-8 rounded-b-3xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Garage Dashboard</h1>
                        <p className="text-white/80">Welcome back, {user?.displayName || "Garage Owner"}</p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-full" onClick={() => navigate("/garage-profile")}>
                        <Wrench className="w-6 h-6 text-white" />
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className="shadow-card bg-white/10 border-none text-white backdrop-blur-sm">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <Icon className="w-5 h-5 opacity-80" />
                                        {index === 1 && <TrendingUp className="w-4 h-4 text-green-300" />}
                                    </div>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-xs opacity-80 font-medium">{stat.label}</p>
                                    <p className="text-[10px] opacity-60 mt-1">{stat.subtext}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Customer Analytics */}
            <div className="px-6 mt-6">
                <h2 className="text-lg font-semibold mb-4">Customer Insights</h2>
                <div className="grid grid-cols-2 gap-3">
                    <Card className="shadow-sm">
                        <CardContent className="p-3 text-center">
                            <p className="text-xs text-muted-foreground">This Month</p>
                            <p className="text-xl font-bold text-primary">{monthlyCustomers}</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="p-3 text-center">
                            <p className="text-xs text-muted-foreground">This Quarter</p>
                            <p className="text-xl font-bold text-primary">{quarterlyCustomers}</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="p-3 text-center">
                            <p className="text-xs text-muted-foreground">Last 6 Months</p>
                            <p className="text-xl font-bold text-primary">{halfYearlyCustomers}</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardContent className="p-3 text-center">
                            <p className="text-xs text-muted-foreground">This Year</p>
                            <p className="text-xl font-bold text-primary">{yearlyCustomers}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="px-6 mt-6">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    <Button variant="outline" className="flex-col h-20 w-24 gap-2 shadow-sm" onClick={() => navigate("/garage-bookings")}>
                        <Calendar className="w-6 h-6 text-primary" />
                        <span className="text-xs">Bookings</span>
                    </Button>
                    <Button variant="outline" className="flex-col h-20 w-24 gap-2 shadow-sm" onClick={() => navigate("/garage-inventory")}>
                        <Package className="w-6 h-6 text-primary" />
                        <span className="text-xs">Inventory</span>
                    </Button>
                    <Button variant="outline" className="flex-col h-20 w-24 gap-2 shadow-sm" onClick={() => navigate("/garage-earnings")}>
                        <DollarSign className="w-6 h-6 text-primary" />
                        <span className="text-xs">Earnings</span>
                    </Button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="px-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Recent Bookings</h2>
                    <Button variant="link" className="text-primary text-sm h-auto p-0" onClick={() => navigate("/garage-bookings")}>
                        View All
                    </Button>
                </div>

                <div className="space-y-3">
                    {recentBookings.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No recent bookings.</p>
                    ) : (
                        recentBookings.map((booking) => (
                            <Card key={booking.id} className="shadow-card">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-semibold">{booking.customerName || "Customer"}</h3>
                                            <p className="text-sm text-muted-foreground">{booking.services[0]} {booking.services.length > 1 && `+${booking.services.length - 1} more`}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${booking.status === "completed" ? "bg-green-100 text-green-700" :
                                            booking.status === "upcoming" ? "bg-blue-100 text-blue-700" :
                                                "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">
                                            {booking.date ? format(new Date(booking.date), "MMM d") : ""} • {booking.time}
                                        </span>
                                        <span className="font-medium">₹{booking.totalPrice}</span>
                                    </div>
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

export default GarageDashboard;
