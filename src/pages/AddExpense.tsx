import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Camera } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";

const AddExpense = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addExpense, selectedVehicleId, vehicles } = useApp();

  const [formData, setFormData] = useState({
    type: "",
    category: "fuel" as "fuel" | "maintenance" | "insurance" | "other",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    if (location.state?.scannedData) {
      const { type, category, amount, date, notes } = location.state.scannedData;
      setFormData(prev => ({
        ...prev,
        type: type || prev.type,
        category: category || prev.category,
        amount: amount || prev.amount,
        date: date || prev.date,
        notes: notes || prev.notes,
      }));
      toast.success("Form pre-filled from receipt!");
    }
  }, [location.state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVehicleId) {
      toast.error("Please select a vehicle first");
      return;
    }

    if (!formData.type || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    addExpense({
      vehicleId: selectedVehicleId,
      type: formData.type,
      category: formData.category,
      amount: parseFloat(formData.amount),
      date: formData.date,
      notes: formData.notes,
    });

    toast.success("Expense added successfully!");
    navigate("/expenses");
  };

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  return (
    <div className="min-h-screen bg-background pb-6">
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

        <h1 className="text-2xl font-bold text-white mb-2">Add Expense</h1>
        {selectedVehicle && (
          <p className="text-white/80 text-sm">
            {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.plate})
          </p>
        )}
      </div>

      {/* Form */}
      <div className="px-6 mt-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Expense Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fuel">Fuel</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Expense Type *</Label>
                <Input
                  id="type"
                  placeholder="e.g., Oil Change, Fuel Fill-up"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional details..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/scan-receipt")}
              >
                <Camera className="w-5 h-5 mr-2" />
                Scan Receipt Instead
              </Button>

              <Button
                type="submit"
                className="w-full bg-gradient-accent"
                size="lg"
              >
                Add Expense
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddExpense;
