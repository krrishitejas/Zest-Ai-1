import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, DollarSign, MapPin } from "lucide-react";

const OnboardingFlow = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      icon: Bell,
      title: "Never Miss a Service",
      description: "Get timely reminders for oil changes, tire rotations, and all maintenance needs.",
    },
    {
      icon: DollarSign,
      title: "Track Every Expense",
      description: "Scan receipts with OCR and visualize your total cost of ownership with powerful analytics.",
    },
    {
      icon: MapPin,
      title: "Find Trusted Garages",
      description: "Discover highly-rated garages nearby and book services with complete transparency.",
    },
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      navigate("/auth");
    }
  };

  const handleSkip = () => {
    navigate("/auth");
  };

  const currentSlide = slides[step];
  const Icon = currentSlide.icon;

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="bg-white/10 backdrop-blur-sm rounded-full p-12 mb-8 animate-fade-in">
          <Icon className="w-20 h-20 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-white text-center mb-4 animate-fade-in">
          {currentSlide.title}
        </h2>
        
        <p className="text-white/80 text-center text-lg max-w-sm animate-fade-in">
          {currentSlide.description}
        </p>

        <div className="flex gap-2 mt-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === step ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 space-y-3">
        <Button
          onClick={handleNext}
          className="w-full bg-white text-primary hover:bg-white/90 h-12 text-lg font-semibold"
        >
          {step < slides.length - 1 ? "Next" : "Get Started"}
        </Button>
        
        {step < slides.length - 1 && (
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="w-full text-white hover:bg-white/10 h-12"
          >
            Skip
          </Button>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
