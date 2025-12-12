import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Package, AlertTriangle, Loader2, X } from "lucide-react";
import GarageBottomNav from "@/components/layout/GarageBottomNav";
import { useState, useEffect } from "react";
import { collection, query, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface InventoryItem {
    id: string;
    name: string;
    stock: number;
    price: number;
    category: string;
}

const GarageInventory = () => {
    const { user } = useApp();
    const [searchTerm, setSearchTerm] = useState("");
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);

    // New Item State
    const [newItem, setNewItem] = useState({
        name: "",
        category: "",
        stock: "",
        price: ""
    });

    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, `users/${user.uid}/inventory`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as InventoryItem));
            setInventory(items);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleAddItem = async () => {
        if (!user) return;
        if (!newItem.name || !newItem.stock || !newItem.price) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            await addDoc(collection(db, `users/${user.uid}/inventory`), {
                name: newItem.name,
                category: newItem.category || "General",
                stock: parseInt(newItem.stock),
                price: parseFloat(newItem.price)
            });
            toast.success("Item added successfully");
            setIsAddOpen(false);
            setNewItem({ name: "", category: "", stock: "", price: "" });
        } catch (error) {
            console.error("Error adding item:", error);
            toast.error("Failed to add item");
        }
    };

    const handleDeleteItem = async (id: string) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, `users/${user.uid}/inventory`, id));
            toast.success("Item deleted");
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Failed to delete item");
        }
    };

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-gradient-primary px-6 pt-12 pb-8 rounded-b-3xl">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-white">Inventory</h1>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button size="icon" variant="secondary" className="rounded-full bg-white/20 text-white hover:bg-white/30 border-none">
                                <Plus className="w-6 h-6" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Item</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Item Name</Label>
                                    <Input
                                        value={newItem.name}
                                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                        placeholder="e.g. Engine Oil"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Input
                                        value={newItem.category}
                                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                        placeholder="e.g. Fluids"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Stock Quantity</Label>
                                        <Input
                                            type="number"
                                            value={newItem.stock}
                                            onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Price (₹)</Label>
                                        <Input
                                            type="number"
                                            value={newItem.price}
                                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <Button onClick={handleAddItem} className="w-full bg-gradient-primary">Add Item</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search parts..."
                        className="pl-10 bg-white/90 border-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="px-6 mt-6 space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : filteredInventory.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        <Package className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p>No items in inventory</p>
                    </div>
                ) : (
                    filteredInventory.map((item) => (
                        <Card key={item.id} className="shadow-card">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${item.stock < 5 ? 'bg-red-100' : 'bg-blue-100'}`}>
                                        <Package className={`w-6 h-6 ${item.stock < 5 ? 'text-red-600' : 'text-blue-600'}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-sm text-muted-foreground">{item.category}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">₹{item.price}</p>
                                    <div className="flex items-center justify-end gap-1">
                                        <span className={`text-xs font-medium ${item.stock < 5 ? 'text-red-600' : 'text-green-600'}`}>
                                            {item.stock} in stock
                                        </span>
                                        {item.stock < 5 && <AlertTriangle className="w-3 h-3 text-red-600" />}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <GarageBottomNav />
        </div>
    );
};

export default GarageInventory;
