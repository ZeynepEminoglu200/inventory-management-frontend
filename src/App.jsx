import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AddItemPage from "./pages/AddItemPage";
import EditItemPage from "./pages/EditItemPage";
import StockHistoryPage from "./pages/StockHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-item"
        element={
          <ProtectedRoute>
            <AddItemPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-item/:id"
        element={
          <ProtectedRoute>
            <EditItemPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/stock-history"
        element={
          <ProtectedRoute>
            <StockHistoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;