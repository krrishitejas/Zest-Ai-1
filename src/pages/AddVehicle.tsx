import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";

const AddVehicle = () => {
  const navigate = useNavigate();
  const { addVehicle } = useApp();
  
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    plate: "",
    vin: "",
    registrationNumber: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.make || !formData.model || !formData.year || !formData.plate) {
      toast.error("Please fill in all required fields");
      return;
    }

    addVehicle({
      make: formData.make,
      model: formData.model,
      year: formData.year,
      plate: formData.plate,
      vin: formData.vin || undefined,
      registrationNumber: formData.registrationNumber || undefined,
    });

    toast.success("Vehicle added successfully!");
    navigate("/vehicles");
  };

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
        
        <h1 className="text-2xl font-bold text-white">Add Vehicle</h1>
      </div>

      {/* Form */}
      <div className="px-6 mt-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  placeholder="e.g., Honda, Toyota, Maruti"
                  value={formData.make}
                  onChange={(e) =>
                    setFormData({ ...formData, make: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  placeholder="e.g., Civic, Camry, Swift"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  placeholder="e.g., 2020"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="plate">License Plate *</Label>
                <Input
                  id="plate"
                  placeholder="e.g., ABC 1234"
                  value={formData.plate}
                  onChange={(e) =>
                    setFormData({ ...formData, plate: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="vin">VIN (Optional)</Label>
                <Input
                  id="vin"
                  placeholder="17-digit Vehicle Identification Number"
                  value={formData.vin}
                  onChange={(e) =>
                    setFormData({ ...formData, vin: e.target.value })
                  }
                  maxLength={17}
                />
              </div>

              <div>
                <Label htmlFor="registrationNumber">
                  Registration Number (Optional)
                </Label>
                <Input
                  id="registrationNumber"
                  placeholder="Vehicle registration number"
                  value={formData.registrationNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationNumber: e.target.value,
                    })
                  }
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-accent"
                size="lg"
              >
                Add Vehicle
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddVehicle;
