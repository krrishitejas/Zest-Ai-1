import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Loader2, Wrench } from "lucide-react";
import { toast } from "sonner";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthError } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "garage">("user");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check role and redirect
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === "garage") {
            navigate("/garage-dashboard");
          } else {
            navigate("/home");
          }
        } else {
          // Default to home if no role found
          navigate("/home");
        }

        toast.success("Welcome back!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user document with role
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: role,
          createdAt: new Date().toISOString()
        });

        toast.success("Account created successfully!");

        if (role === "garage") {
          navigate("/garage-dashboard");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      const authError = error as AuthError;
      let errorMessage = "An error occurred during authentication.";

      if (authError.code === "auth/invalid-credential" || authError.code === "auth/user-not-found" || authError.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password.";
      } else if (authError.code === "auth/email-already-in-use") {
        errorMessage = "Email is already in use.";
      } else if (authError.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center">
          <div className="bg-gradient-primary rounded-2xl p-4 inline-block mx-auto mb-4">
            {role === "garage" ? (
              <Wrench className="w-12 h-12 text-white" />
            ) : (
              <Car className="w-12 h-12 text-white" />
            )}
          </div>
          <CardTitle className="text-2xl">{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
          <CardDescription>
            {isLogin ? "Sign in to continue" : "Join ZEST to get started"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3 mb-4">
              <Label>I am a...</Label>
              <RadioGroup defaultValue="user" value={role} onValueChange={(v) => setRole(v as "user" | "garage")} className="grid grid-cols-2 gap-4">
                <div>
                  <RadioGroupItem value="user" id="user" className="peer sr-only" />
                  <Label
                    htmlFor="user"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Car className="mb-2 h-6 w-6" />
                    Car Owner
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="garage" id="garage" className="peer sr-only" />
                  <Label
                    htmlFor="garage"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Wrench className="mb-2 h-6 w-6" />
                    Garage Owner
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {isLogin && (
              <Button variant="link" className="px-0 text-primary" type="button">
                Forgot password?
              </Button>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-primary h-12 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                isLogin ? "Sign In" : "Sign Up"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>{" "}
            <Button
              variant="link"
              className="px-1 text-primary font-semibold"
              onClick={() => setIsLogin(!isLogin)}
              disabled={isLoading}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
