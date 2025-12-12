import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  updateDoc,
  getDoc,
  where
} from "firebase/firestore";
import { toast } from "sonner";

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: string;
  plate: string;
  vin?: string;
  registrationNumber?: string;
}

export interface Expense {
  id: string;
  vehicleId: string;
  type: string;
  category: "fuel" | "maintenance" | "insurance" | "other";
  amount: number;
  date: string;
  notes?: string;
  receiptImage?: string;
}

export interface ServiceReminder {
  id: string;
  vehicleId: string;
  type: string;
  dueDate: string;
  dueKm?: number;
  urgent: boolean;
  completed: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  vehicleId: string;
  garageId: string;
  garageName: string;
  services: string[];
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  totalPrice?: number;
  customerName?: string;
  customerPhone?: string;
}

export interface ServiceHistoryEntry {
  id: string;
  vehicleId: string;
  type: string;
  date: string;
  odometer?: number;
  cost?: number;
  garage?: string;
  notes?: string;
  parts?: string;
  photos?: string[];
}

export type UserRole = "user" | "garage";

interface AppContextType {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  expenses: Expense[];
  serviceReminders: ServiceReminder[];
  bookings: Booking[];
  serviceHistory: ServiceHistoryEntry[];
  user: User | null;
  userRole: UserRole | null;
  isPro: boolean;
  isLoading: boolean;

  addVehicle: (vehicle: Omit<Vehicle, "id">) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  selectVehicle: (id: string) => void;

  addExpense: (expense: Omit<Expense, "id">) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  addServiceReminder: (reminder: Omit<ServiceReminder, "id">) => Promise<void>;
  updateServiceReminder: (id: string, reminder: Partial<ServiceReminder>) => Promise<void>;
  deleteServiceReminder: (id: string) => Promise<void>;

  addBooking: (booking: Omit<Booking, "id" | "userId">) => Promise<void>;
  updateBooking: (id: string, booking: Partial<Booking>) => Promise<void>;

  addServiceHistory: (entry: Omit<ServiceHistoryEntry, "id">) => Promise<void>;
  updateServiceHistory: (id: string, entry: Partial<ServiceHistoryEntry>) => Promise<void>;
  deleteServiceHistory: (id: string) => Promise<void>;

  upgradeToPro: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [serviceReminders, setServiceReminders] = useState<ServiceReminder[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryEntry[]>([]);
  const [isPro, setIsPro] = useState(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch user role
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role as UserRole);
          } else {
            // Default to user if no doc exists (legacy users)
            setUserRole("user");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole("user");
        }
      } else {
        // Clear data on logout
        setUserRole(null);
        setVehicles([]);
        setExpenses([]);
        setServiceReminders([]);
        setBookings([]);
        setServiceHistory([]);
        setSelectedVehicleId(null);
      }

      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Data Sync
  useEffect(() => {
    if (!user) return;

    // Vehicles
    const qVehicles = query(collection(db, `users/${user.uid}/vehicles`));
    const unsubVehicles = onSnapshot(qVehicles, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
      setVehicles(data);

      // Auto-select first vehicle if none selected
      if (data.length > 0 && !selectedVehicleId) {
        const storedSelected = localStorage.getItem("zest_selected_vehicle");
        if (storedSelected && data.find(v => v.id === storedSelected)) {
          setSelectedVehicleId(storedSelected);
        } else {
          setSelectedVehicleId(data[0].id);
        }
      }
    });

    // Expenses
    const qExpenses = query(collection(db, `users/${user.uid}/expenses`), orderBy("date", "desc"));
    const unsubExpenses = onSnapshot(qExpenses, (snapshot) => {
      setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense)));
    });

    // Reminders
    const qReminders = query(collection(db, `users/${user.uid}/reminders`));
    const unsubReminders = onSnapshot(qReminders, (snapshot) => {
      setServiceReminders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceReminder)));
    });

    // Bookings - Top Level Collection
    let qBookings;
    if (userRole === "garage") {
      // Garage sees bookings assigned to them
      qBookings = query(collection(db, "bookings"), where("garageId", "==", user.uid));
    } else {
      // Users see their own bookings
      qBookings = query(collection(db, "bookings"), where("userId", "==", user.uid));
    }

    const unsubBookings = onSnapshot(qBookings, (snapshot) => {
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)));
    });

    // History
    const qHistory = query(collection(db, `users/${user.uid}/service_history`), orderBy("date", "desc"));
    const unsubHistory = onSnapshot(qHistory, (snapshot) => {
      setServiceHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceHistoryEntry)));
    });

    return () => {
      unsubVehicles();
      unsubExpenses();
      unsubReminders();
      unsubBookings();
      unsubHistory();
    };
  }, [user, userRole]); // Re-run when user or role changes

  // Persist selected vehicle ID locally for convenience
  useEffect(() => {
    if (selectedVehicleId) {
      localStorage.setItem("zest_selected_vehicle", selectedVehicleId);
    }
  }, [selectedVehicleId]);

  // CRUD Operations
  const addVehicle = async (vehicle: Omit<Vehicle, "id">) => {
    if (!user) return;
    try {
      await addDoc(collection(db, `users/${user.uid}/vehicles`), vehicle);
      toast.success("Vehicle added successfully");
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast.error("Failed to add vehicle");
    }
  };

  const updateVehicle = async (id: string, vehicle: Partial<Vehicle>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, `users/${user.uid}/vehicles`, id), vehicle);
      toast.success("Vehicle updated successfully");
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast.error("Failed to update vehicle");
    }
  };

  const deleteVehicle = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/vehicles`, id));
      if (selectedVehicleId === id) setSelectedVehicleId(null);
      toast.success("Vehicle deleted successfully");
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Failed to delete vehicle");
    }
  };

  const selectVehicle = (id: string) => {
    setSelectedVehicleId(id);
  };

  const addExpense = async (expense: Omit<Expense, "id">) => {
    if (!user) return;
    try {
      await addDoc(collection(db, `users/${user.uid}/expenses`), expense);
      toast.success("Expense added successfully");
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
    }
  };

  const updateExpense = async (id: string, expense: Partial<Expense>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, `users/${user.uid}/expenses`, id), expense);
      toast.success("Expense updated successfully");
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Failed to update expense");
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/expenses`, id));
      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  const addServiceReminder = async (reminder: Omit<ServiceReminder, "id">) => {
    if (!user) return;
    try {
      await addDoc(collection(db, `users/${user.uid}/reminders`), reminder);
      toast.success("Reminder added successfully");
    } catch (error) {
      console.error("Error adding reminder:", error);
      toast.error("Failed to add reminder");
    }
  };

  const updateServiceReminder = async (id: string, reminder: Partial<ServiceReminder>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, `users/${user.uid}/reminders`, id), reminder);
      toast.success("Reminder updated successfully");
    } catch (error) {
      console.error("Error updating reminder:", error);
      toast.error("Failed to update reminder");
    }
  };

  const deleteServiceReminder = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/reminders`, id));
      toast.success("Reminder deleted successfully");
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("Failed to delete reminder");
    }
  };

  const addBooking = async (booking: Omit<Booking, "id" | "userId">) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "bookings"), {
        ...booking,
        userId: user.uid,
        customerName: user.displayName || "Unknown User",
        customerPhone: user.phoneNumber || "",
      });
      toast.success("Booking added successfully");
    } catch (error) {
      console.error("Error adding booking:", error);
      toast.error("Failed to add booking");
    }
  };

  const updateBooking = async (id: string, booking: Partial<Booking>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "bookings", id), booking);
      toast.success("Booking updated successfully");
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking");
    }
  };

  const addServiceHistory = async (entry: Omit<ServiceHistoryEntry, "id">) => {
    if (!user) return;
    try {
      await addDoc(collection(db, `users/${user.uid}/service_history`), entry);
      toast.success("History entry added successfully");
    } catch (error) {
      console.error("Error adding history entry:", error);
      toast.error("Failed to add history entry");
    }
  };

  const updateServiceHistory = async (id: string, entry: Partial<ServiceHistoryEntry>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, `users/${user.uid}/service_history`, id), entry);
      toast.success("History entry updated successfully");
    } catch (error) {
      console.error("Error updating history entry:", error);
      toast.error("Failed to update history entry");
    }
  };

  const deleteServiceHistory = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/service_history`, id));
      toast.success("History entry deleted successfully");
    } catch (error) {
      console.error("Error deleting history entry:", error);
      toast.error("Failed to delete history entry");
    }
  };

  const upgradeToPro = () => {
    setIsPro(true);
    // In a real app, this would update the user's subscription status in Firestore
  };

  return (
    <AppContext.Provider
      value={{
        vehicles,
        selectedVehicleId,
        expenses,
        serviceReminders,
        bookings,
        serviceHistory,
        user,
        userRole,
        isPro,
        isLoading,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        selectVehicle,
        addExpense,
        updateExpense,
        deleteExpense,
        addServiceReminder,
        updateServiceReminder,
        deleteServiceReminder,
        addBooking,
        updateBooking,
        addServiceHistory,
        updateServiceHistory,
        deleteServiceHistory,
        upgradeToPro,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
