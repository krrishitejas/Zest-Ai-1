import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Garages from "./pages/Garages";
import GarageDetail from "./pages/GarageDetail";
import BookService from "./pages/BookService";
import Expenses from "./pages/Expenses";
import AddExpense from "./pages/AddExpense";
import ScanReceipt from "./pages/ScanReceipt";
import Profile from "./pages/Profile";
import Vehicles from "./pages/Vehicles";
import AddVehicle from "./pages/AddVehicle";
import Bookings from "./pages/Bookings";
import ServiceHistory from "./pages/ServiceHistory";
import AddServiceHistory from "./pages/AddServiceHistory";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";
import NotFound from "./pages/NotFound";

// Garage Pages
import GarageDashboard from "./pages/garage/GarageDashboard";
import GarageInventory from "./pages/garage/GarageInventory";
import GarageBookings from "./pages/garage/GarageBookings";
import GarageEarnings from "./pages/garage/GarageEarnings";
import GarageProfile from "./pages/garage/GarageProfile";
import GarageSubscription from "./pages/garage/GarageSubscription";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Splash />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/auth" element={<Auth />} />

            {/* User Routes */}
            <Route path="/home" element={<ProtectedRoute allowedRole="user"><Home /></ProtectedRoute>} />
            <Route path="/garages" element={<ProtectedRoute allowedRole="user"><Garages /></ProtectedRoute>} />
            <Route path="/garage/:id" element={<ProtectedRoute allowedRole="user"><GarageDetail /></ProtectedRoute>} />
            <Route path="/book-service/:id" element={<ProtectedRoute allowedRole="user"><BookService /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute allowedRole="user"><Expenses /></ProtectedRoute>} />
            <Route path="/add-expense" element={<ProtectedRoute allowedRole="user"><AddExpense /></ProtectedRoute>} />
            <Route path="/scan-receipt" element={<ProtectedRoute allowedRole="user"><ScanReceipt /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRole="user"><Profile /></ProtectedRoute>} />
            <Route path="/vehicles" element={<ProtectedRoute allowedRole="user"><Vehicles /></ProtectedRoute>} />
            <Route path="/add-vehicle" element={<ProtectedRoute allowedRole="user"><AddVehicle /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute allowedRole="user"><Bookings /></ProtectedRoute>} />
            <Route path="/service-history" element={<ProtectedRoute allowedRole="user"><ServiceHistory /></ProtectedRoute>} />
            <Route path="/add-service-history" element={<ProtectedRoute allowedRole="user"><AddServiceHistory /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute allowedRole="user"><Settings /></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute allowedRole="user"><Subscription /></ProtectedRoute>} />

            {/* Garage Routes */}
            <Route path="/garage-dashboard" element={<ProtectedRoute allowedRole="garage"><GarageDashboard /></ProtectedRoute>} />
            <Route path="/garage-inventory" element={<ProtectedRoute allowedRole="garage"><GarageInventory /></ProtectedRoute>} />
            <Route path="/garage-bookings" element={<ProtectedRoute allowedRole="garage"><GarageBookings /></ProtectedRoute>} />
            <Route path="/garage-earnings" element={<ProtectedRoute allowedRole="garage"><GarageEarnings /></ProtectedRoute>} />
            <Route path="/garage-profile" element={<ProtectedRoute allowedRole="garage"><GarageProfile /></ProtectedRoute>} />
            <Route path="/garage-subscription" element={<ProtectedRoute allowedRole="garage"><GarageSubscription /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
