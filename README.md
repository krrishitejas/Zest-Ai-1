# Zest Car Care Flow

Zest Car Care Flow is a comprehensive vehicle and garage management application designed to streamline the interaction between vehicle owners and service providers. It offers a dual-interface system: one for car owners to manage their vehicles and expenses, and another for garage owners to manage their business operations.

## Features

### For Vehicle Owners
*   **Vehicle Management**: Add and track multiple vehicles.
*   **Expense Tracking**: Monitor fuel, maintenance, and other vehicle-related expenses.
*   **Service History**: keep a digital log of all vehicle services.
*   **Book Service**: Find garages and book services directly through the app.
*   **Receipt Scanning**: (Feature implied by `ScanReceipt` page) Scan and store receipts.

### For Garage Owners
*   **Dashboard**: Overview of business metrics and daily activities.
*   **Booking Management**: View and manage incoming service bookings.
*   **Inventory**: Track parts and supplies.
*   **Earnings**: Monitor financial performance.
*   **Subscription**: Manage platform subscription.

## Tech Stack

This project is built using a modern React ecosystem:

*   **Frontend Framework**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **State Management/Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
*   **Routing**: [React Router](https://reactrouter.com/)
*   **Backend/Infrastructure**: [Firebase](https://firebase.google.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Maps**: [Leaflet](https://leafletjs.com/) with React Leaflet

## Getting Started

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd zest-car-care-flow-main
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```
    The application will actially start at `http://localhost:8080` (or the port shown in your terminal).

## Scripts

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the app for production.
*   `npm run lint`: Runs ESLint to check for code quality issues.
*   `npm run preview`: Previews the production build locally.

---
Built with ❤️ using Lovable and React.
