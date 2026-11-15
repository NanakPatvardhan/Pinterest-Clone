import { useContext } from "react";
import { Link, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Saved from "./components/Saved";
import PinDetail from "./components/PinDetail";
import Login from "./components/Login";
import Register from "./components/Register";

import { PinProvider } from "./components/PinContext";
import { AuthContext } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("App must be used inside AuthProvider");
  }

  const { user, logout } = authContext;

  return (
    <PinProvider>
      <nav>
        <Link to="/">Home</Link>

        {user ? (
          <>
            <Link to="/saved">Saved</Link>
            <span>Welcome, {user.username}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <Saved />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pin/:id"
          element={
            <ProtectedRoute>
              <PinDetail />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </PinProvider>
  );
}