import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { ChevronRight, Car, Bell, Lock, CreditCard, HelpCircle, LogOut, Edit2, KeyRound } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { auth } from "@/lib/firebase";
import { signOut, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { user, vehicles, bookings, serviceHistory } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/auth");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await updateProfile(user, { displayName: newName });
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    { icon: Car, label: "My Vehicles", path: "/vehicles" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: CreditCard, label: "ZEST Pro", path: "/subscription", badge: "Upgrade" },
    { icon: HelpCircle, label: "Help & Support", path: "/support" },
  ];

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-20 h-20 border-4 border-white/20">
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback className="bg-white text-primary text-2xl font-bold">
              {getInitials(user?.displayName || user?.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">
                {user?.displayName || "User"}
              </h1>
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Display Name</Label>
                      <Input
                        id="name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleUpdateProfile} disabled={isLoading}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-white/80">{user?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="shadow-card bg-white/10 border-none text-white">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{vehicles.length}</p>
              <p className="text-xs opacity-80">Vehicles</p>
            </CardContent>
          </Card>
          <Card className="shadow-card bg-white/10 border-none text-white">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{serviceHistory.length}</p>
              <p className="text-xs opacity-80">Services</p>
            </CardContent>
          </Card>
          <Card className="shadow-card bg-white/10 border-none text-white">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{bookings.length}</p>
              <p className="text-xs opacity-80">Bookings</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 mt-6 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <Card
              key={index}
              className="shadow-card cursor-pointer hover:shadow-elevated transition-shadow"
              onClick={() => navigate(item.path)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="bg-gradient-accent text-white text-xs px-3 py-1 rounded-full font-semibold">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Password Management Section */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 rounded-full p-2">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium">Security</span>
            </div>

            <div className="space-y-2 pl-12">
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground hover:text-primary"
                onClick={handlePasswordReset}
                disabled={isLoading}
              >
                <KeyRound className="w-4 h-4 mr-2" />
                Reset Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logout */}
      <div className="px-6 mt-6 mb-6">
        <Button
          variant="outline"
          className="w-full h-12 text-destructive border-destructive hover:bg-destructive hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
