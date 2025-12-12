import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
// Note: In a production app, this key should be in an environment variable
// and calls should ideally be proxied through a backend to keep the key secure.
const API_KEY = "AIzaSyC7jU_-r3y4l7bzvK446VuPaQN5dWUrPmg";
const genAI = new GoogleGenerativeAI(API_KEY);

export interface ReceiptData {
    type: string;
    category: "fuel" | "maintenance" | "insurance" | "other";
    amount: string;
    date: string;
    notes?: string;
}

export const analyzeReceipt = async (imageFile: File): Promise<ReceiptData> => {
    try {
        // Convert file to base64
        const base64Data = await fileToGenerativePart(imageFile);

        // Use the flash model for speed and efficiency
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - type: A short description of the expense (e.g., "Fuel", "Oil Change", "Car Wash").
      - category: One of "fuel", "maintenance", "insurance", "other".
      - amount: The total amount as a number (remove currency symbols).
      - date: The date in YYYY-MM-DD format.
      - notes: Any other relevant details (merchant name, items, etc.).

      If you cannot find a specific field, make a reasonable guess or leave it empty/null.
      Return ONLY the JSON object, no markdown formatting.
    `;

        const result = await model.generateContent([prompt, base64Data]);
        const response = await result.response;
        const text = response.text();

        // Clean up the response to ensure it's valid JSON
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const data = JSON.parse(jsonString);
            return {
                type: data.type || "Expense",
                category: validateCategory(data.category),
                amount: data.amount ? String(data.amount) : "",
                date: data.date || new Date().toISOString().split("T")[0],
                notes: data.notes || `Merchant: ${data.merchant || "Unknown"}`,
            };
        } catch (parseError) {
            console.error("Error parsing Gemini response:", parseError);
            throw new Error("Failed to parse receipt data");
        }
    } catch (error) {
        console.error("Error analyzing receipt:", error);
        throw error;
    }
};

// Helper to convert File to GoogleGenerativeAI.Part
async function fileToGenerativePart(file: File) {
    return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
            const base64Data = base64String.split(",")[1];
            resolve({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type,
                },
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function validateCategory(category: string): "fuel" | "maintenance" | "insurance" | "other" {
    const validCategories = ["fuel", "maintenance", "insurance", "other"];
    const lowerCategory = category?.toLowerCase();
    if (validCategories.includes(lowerCategory)) {
        return lowerCategory as any;
    }
    return "other";
}
