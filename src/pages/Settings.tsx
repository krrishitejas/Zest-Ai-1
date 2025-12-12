import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Bell, Moon, Lock, CreditCard, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import BottomNav from "@/components/layout/BottomNav";

const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/auth");
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
        
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>

      {/* Settings List */}
      <div className="px-6 mt-6 space-y-6">
        {/* Notifications */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <Label htmlFor="notifications" className="font-semibold">
                    Push Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Service reminders and updates
                  </p>
                </div>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dark Mode */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <Moon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <Label htmlFor="darkMode" className="font-semibold">
                    Dark Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Switch to dark theme
                  </p>
                </div>
              </div>
              <Switch
                id="darkMode"
                checked={darkMode}
                onCheckedChange={(checked) => {
                  setDarkMode(checked);
                  document.documentElement.classList.toggle("dark", checked);
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Account</h2>
          <div className="space-y-3">
            <Card
              className="shadow-card cursor-pointer hover:bg-accent/5 transition-colors"
              onClick={() => navigate("/change-password")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Change Password</p>
                    <p className="text-sm text-muted-foreground">
                      Update your password
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="shadow-card cursor-pointer hover:bg-accent/5 transition-colors"
              onClick={() => navigate("/subscription")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Subscription</p>
                    <p className="text-sm text-muted-foreground">
                      Manage your ZEST Pro subscription
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="destructive"
          className="w-full"
          size="lg"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Log Out
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;
