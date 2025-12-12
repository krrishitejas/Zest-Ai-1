import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, HelpCircle, Shield, User, Key, Mail, Phone, MapPin, Edit2, Loader2, Crown } from "lucide-react";
import GarageBottomNav from "@/components/layout/GarageBottomNav";
import { useApp } from "@/contexts/AppContext";
import { auth, db } from "@/lib/firebase";
import { signOut, updateProfile, updatePassword, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential, updateEmail } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

const GarageProfile = () => {
    const { user } = useApp();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [garageDetails, setGarageDetails] = useState({
        phoneNumber: "",
        address: "",
        garageName: ""
    });

    // Edit Profile State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        displayName: "",
        email: "",
        phoneNumber: "",
        address: ""
    });

    // Change Password State
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        const fetchDetails = async () => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setGarageDetails({
                        phoneNumber: data.phoneNumber || "",
                        address: data.address || "",
                        garageName: data.garageName || ""
                    });
                    setEditForm({
                        displayName: user.displayName || "",
                        email: user.email || "",
                        phoneNumber: data.phoneNumber || "",
                        address: data.address || ""
                    });
                }
            }
        };
        fetchDetails();
    }, [user]);

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
            // Update Auth Profile (Display Name)
            if (editForm.displayName !== user.displayName) {
                await updateProfile(user, {
                    displayName: editForm.displayName
                });
            }

            // Update Email (Requires Re-auth usually, but trying direct update first)
            if (editForm.email !== user.email) {
                try {
                    await updateEmail(user, editForm.email);
                    toast.success("Email updated. Please verify your new email.");
                } catch (error: any) {
                    if (error.code === 'auth/requires-recent-login') {
                        toast.error("Please re-login to update email.");
                    } else {
                        console.error("Error updating email:", error);
                        toast.error("Failed to update email.");
                    }
                }
            }

            // Update Firestore Profile
            await updateDoc(doc(db, "users", user.uid), {
                displayName: editForm.displayName,
                email: editForm.email,
                phoneNumber: editForm.phoneNumber,
                address: editForm.address
            });

            setGarageDetails(prev => ({
                ...prev,
                phoneNumber: editForm.phoneNumber,
                address: editForm.address
            }));

            toast.success("Profile updated successfully");
            setIsEditOpen(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!user || !user.email) return;
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        try {
            // Re-authenticate first
            const credential = EmailAuthProvider.credential(user.email, passwordForm.currentPassword);
            await reauthenticateWithCredential(user, credential);

            // Update Password
            await updatePassword(user, passwordForm.newPassword);
            toast.success("Password changed successfully");
            setIsPasswordOpen(false);
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error: any) {
            console.error("Error changing password:", error);
            if (error.code === 'auth/wrong-password') {
                toast.error("Incorrect current password");
            } else {
                toast.error("Failed to change password. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!user?.email) return;
        try {
            await sendPasswordResetEmail(auth, user.email);
            toast.success("Password reset email sent to " + user.email);
        } catch (error) {
            console.error("Error sending reset email:", error);
            toast.error("Failed to send reset email");
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-gradient-primary px-6 pt-12 pb-8 rounded-b-3xl">
                <div className="flex items-center gap-4 mb-6">
                    <Avatar className="w-20 h-20 border-4 border-white/20">
                        <AvatarImage src={user?.photoURL || ""} />
                        <AvatarFallback className="bg-white text-primary text-2xl font-bold">
                            {user?.displayName?.[0] || "G"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-white">{user?.displayName || "Garage Owner"}</h1>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                            <Mail className="w-4 h-4" />
                            {user?.email}
                        </div>
                    </div>
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogTrigger asChild>
                            <Button size="icon" variant="secondary" className="rounded-full bg-white/20 text-white hover:bg-white/30 border-none">
                                <Edit2 className="w-5 h-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Garage Name / Display Name</Label>
                                    <Input
                                        value={editForm.displayName}
                                        onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input
                                        value={editForm.phoneNumber}
                                        onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Address</Label>
                                    <Input
                                        value={editForm.address}
                                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                        placeholder="123, Main Street, City"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                                <Button onClick={handleUpdateProfile} disabled={isLoading} className="bg-gradient-primary">
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="px-6 mt-6 space-y-4">
                {/* Subscription Card */}
                <Card className="shadow-card cursor-pointer bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-200" onClick={() => navigate("/garage-subscription")}>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-full">
                                <Crown className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-orange-900">Garage Pro</h3>
                                <p className="text-xs text-orange-700">Upgrade for premium features</p>
                            </div>
                        </div>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                            View Plans
                        </Button>
                    </CardContent>
                </Card>

                {/* Contact Info Card */}
                <Card className="shadow-card">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Contact Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{garageDetails.phoneNumber || "No phone number added"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{garageDetails.address || "No address added"}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Settings */}
                <Card className="shadow-card">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full justify-start">
                                    <Key className="w-4 h-4 mr-2" />
                                    Change Password
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Change Password</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Current Password</Label>
                                        <Input
                                            type="password"
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>New Password</Label>
                                        <Input
                                            type="password"
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Confirm New Password</Label>
                                        <Input
                                            type="password"
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsPasswordOpen(false)}>Cancel</Button>
                                    <Button onClick={handleChangePassword} disabled={isLoading} className="bg-gradient-primary">
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary" onClick={handleForgotPassword}>
                            <HelpCircle className="w-4 h-4 mr-2" />
                            Forgot Password?
                        </Button>
                    </CardContent>
                </Card>

                <Button
                    variant="outline"
                    className="w-full h-12 text-destructive border-destructive hover:bg-destructive hover:text-white mt-4"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                </Button>
            </div>

            <GarageBottomNav />
        </div>
    );
};

export default GarageProfile;
