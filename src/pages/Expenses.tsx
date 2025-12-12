import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, Fuel, Wrench, Shield, Scan } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";

const Expenses = () => {
  const navigate = useNavigate();
  const { expenses, selectedVehicleId } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("month");

  const vehicleExpenses = expenses.filter(e => e.vehicleId === selectedVehicleId);

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    return vehicleExpenses.filter(e => {
      const expenseDate = new Date(e.date);
      if (selectedPeriod === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return expenseDate >= weekAgo;
      } else if (selectedPeriod === "month") {
        return expenseDate.getMonth() === now.getMonth() &&
               expenseDate.getFullYear() === now.getFullYear();
      } else {
        return expenseDate.getFullYear() === now.getFullYear();
      }
    });
  }, [vehicleExpenses, selectedPeriod]);

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryData = useMemo(() => {
    const fuel = filteredExpenses.filter(e => e.category === "fuel").reduce((sum, e) => sum + e.amount, 0);
    const maintenance = filteredExpenses.filter(e => e.category === "maintenance").reduce((sum, e) => sum + e.amount, 0);
    const insurance = filteredExpenses.filter(e => e.category === "insurance").reduce((sum, e) => sum + e.amount, 0);
    const other = filteredExpenses.filter(e => e.category === "other").reduce((sum, e) => sum + e.amount, 0);

    return [
      { name: "Fuel", amount: fuel, icon: Fuel, color: "text-blue-500" },
      { name: "Maintenance", amount: maintenance, icon: Wrench, color: "text-orange-500" },
      { name: "Insurance", amount: insurance, icon: Shield, color: "text-green-500" },
      { name: "Other", amount: other, icon: TrendingUp, color: "text-purple-500" },
    ].filter(c => c.amount > 0);
  }, [filteredExpenses]);

  const recentExpenses = vehicleExpenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary px-6 pt-12 pb-8 rounded-b-3xl">
        <h1 className="text-2xl font-bold text-white mb-6">Expenses</h1>
        
        {/* Total Spent Card */}
        <Card className="shadow-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Spent (This Month)</p>
                <h2 className="text-3xl font-bold">₹{totalSpent.toLocaleString()}</h2>
              </div>
              <div className="bg-secondary/10 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
            </div>
            
            <div className="flex gap-2">
              {["Week", "Month", "Year"].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period.toLowerCase() ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedPeriod(period.toLowerCase() as any)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Placeholder */}
      <div className="px-6 mt-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl h-48 flex items-center justify-center">
              <p className="text-muted-foreground">Expense Chart</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <div className="px-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        {categoryData.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground text-sm">No expenses in this period</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {categoryData.map((category, index) => {
              const Icon = category.icon;
              const percentage = totalSpent > 0 ? ((category.amount / totalSpent) * 100).toFixed(0) : "0";
              
              return (
                <Card key={index} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`${category.color} bg-current/10 rounded-full p-2`}>
                          <Icon className={`w-5 h-5 ${category.color}`} />
                        </div>
                        <span className="font-semibold">{category.name}</span>
                      </div>
                      <span className="font-bold text-lg">₹{category.amount.toLocaleString()}</span>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-accent h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{percentage}% of total</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Expenses */}
      <div className="px-6 mt-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
        {recentExpenses.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground text-sm">No recent expenses</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-card">
            <CardContent className="p-4 space-y-3">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{expense.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="font-semibold text-lg">₹{expense.amount.toLocaleString()}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={() => navigate("/add-expense")}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-elevated bg-gradient-accent"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Scan Receipt FAB */}
      <Button
        onClick={() => navigate("/scan-receipt")}
        variant="outline"
        className="fixed bottom-24 left-6 h-14 px-6 rounded-full shadow-elevated bg-card"
      >
        <Scan className="w-5 h-5 mr-2" />
        Scan Receipt
      </Button>

      <BottomNav />
    </div>
  );
};

export default Expenses;
