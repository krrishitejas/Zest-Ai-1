import { LayoutDashboard, Package, Calendar, DollarSign, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const GarageBottomNav = () => {
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/garage-dashboard" },
        { icon: Calendar, label: "Bookings", path: "/garage-bookings" },
        { icon: Package, label: "Inventory", path: "/garage-inventory" },
        { icon: DollarSign, label: "Earnings", path: "/garage-earnings" },
        { icon: User, label: "Profile", path: "/garage-profile" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
            <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 flex-1 transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default GarageBottomNav;
