import { useApp } from "@/contexts/AppContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRole?: "user" | "garage";
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
    const { user, userRole, isLoading } = useApp();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    if (allowedRole && userRole && userRole !== allowedRole) {
        // Redirect to appropriate dashboard if role doesn't match
        return <Navigate to={userRole === "garage" ? "/garage-dashboard" : "/home"} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
