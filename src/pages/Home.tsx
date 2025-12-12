import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Car, ChevronDown, Plus, TrendingUp } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";

const Home = () => {
  const navigate = useNavigate();
  const { vehicles, selectedVehicleId, expenses, serviceReminders, user, addVehicle } = useApp();

  // Initialize with demo data if no vehicles exist
  useEffect(() => {
    if (vehicles.length === 0) {
      addVehicle({
        make: "Honda",
        model: "Civic",
        year: "2020",
        plate: "ABC 1234",
      });
    }
  }, []);

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
  
  const vehicleReminders = serviceReminders
    .filter(r => r.vehicleId === selectedVehicleId && !r.completed)
    .slice(0, 3);

  const vehicleExpenses = expenses
    .filter(e => e.vehicleId === selectedVehicleId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const thisMonthExpenses = expenses
    .filter(e => {
      const expenseDate = new Date(e.date);
      const now = new Date();
      return expenseDate.getMonth() === now.getMonth() &&
             expenseDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary px-6 pt-12 pb-8 rounded-b-3xl">
      <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Hello, {user?.name || "Rahul"}</h1>
            <p className="text-white/80 text-sm">Let's take care of your car</p>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Bell className="w-6 h-6" />
          </Button>
        </div>

        {/* Vehicle Selector */}
        {selectedVehicle && (
          <Card className="shadow-elevated cursor-pointer" onClick={() => navigate("/vehicles")}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-xl p-3">
                    <Car className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedVehicle.make} {selectedVehicle.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedVehicle.year} • {selectedVehicle.plate}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-6 grid grid-cols-2 gap-3">
        <Button
          onClick={() => navigate("/garages")}
          className="bg-gradient-accent h-24 flex-col gap-2"
        >
          <Calendar className="w-6 h-6" />
          <span>Book Service</span>
        </Button>
        <Button
          onClick={() => navigate("/expenses")}
          variant="outline"
          className="h-24 flex-col gap-2 border-2"
        >
          <Plus className="w-6 h-6" />
          <span>Add Expense</span>
        </Button>
      </div>

      {/* Upcoming Services */}
      <div className="px-6 mt-8">
        <h2 className="text-xl font-bold mb-4">Upcoming Services</h2>
        {vehicleReminders.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No upcoming services</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {vehicleReminders.map((reminder) => (
              <Card key={reminder.id} className="shadow-card">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-accent/10 rounded-full p-2">
                      <Bell className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold">{reminder.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(reminder.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={reminder.urgent ? "destructive" : "outline"}>
                    {reminder.urgent ? "Urgent" : "Upcoming"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent Expenses */}
      <div className="px-6 mt-8 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Expenses</h2>
          <Button variant="link" className="text-primary" onClick={() => navigate("/expenses")}>
            See All
          </Button>
        </div>
        
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <CardTitle className="text-lg">This Month: ₹{thisMonthExpenses.toLocaleString()}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {vehicleExpenses.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No expenses yet</p>
            ) : (
              vehicleExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{expense.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="font-semibold text-lg">₹{expense.amount.toLocaleString()}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
