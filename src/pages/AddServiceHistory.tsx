import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";

const AddServiceHistory = () => {
  const navigate = useNavigate();
  const { addServiceHistory, selectedVehicleId, vehicles } = useApp();
  
  const [formData, setFormData] = useState({
    type: "",
    date: new Date().toISOString().split("T")[0],
    odometer: "",
    cost: "",
    garage: "",
    notes: "",
    parts: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVehicleId) {
      toast.error("Please select a vehicle first");
      return;
    }

    if (!formData.type || !formData.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    addServiceHistory({
      vehicleId: selectedVehicleId,
      type: formData.type,
      date: formData.date,
      odometer: formData.odometer ? parseInt(formData.odometer) : undefined,
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
      garage: formData.garage || undefined,
      notes: formData.notes || undefined,
      parts: formData.parts || undefined,
    });

    toast.success("Service record added successfully!");
    navigate("/service-history");
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
        
        <h1 className="text-2xl font-bold text-white mb-2">Add Service Record</h1>
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
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="type">Service Type *</Label>
                <Input
                  id="type"
                  placeholder="e.g., Oil Change, Brake Replacement"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
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
                <Label htmlFor="odometer">Odometer Reading (km)</Label>
                <Input
                  id="odometer"
                  type="number"
                  placeholder="e.g., 45000"
                  value={formData.odometer}
                  onChange={(e) =>
                    setFormData({ ...formData, odometer: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="cost">Cost (₹)</Label>
                <Input
                  id="cost"
                  type="number"
                  placeholder="0"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="garage">Garage/Service Center</Label>
                <Input
                  id="garage"
                  placeholder="e.g., Premium Auto Service"
                  value={formData.garage}
                  onChange={(e) =>
                    setFormData({ ...formData, garage: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="parts">Parts Used</Label>
                <Textarea
                  id="parts"
                  placeholder="List the parts that were replaced..."
                  value={formData.parts}
                  onChange={(e) =>
                    setFormData({ ...formData, parts: e.target.value })
                  }
                  rows={2}
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
                type="submit"
                className="w-full bg-gradient-accent"
                size="lg"
              >
                Add Service Record
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddServiceHistory;
