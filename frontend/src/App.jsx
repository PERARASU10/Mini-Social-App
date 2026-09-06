import { Navigate, Route, Routes } from "react-router-dom";
import { CircularProgress, Stack } from "@mui/material";
import { useAuth } from "./context/AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import SocialPage from "./pages/SocialPage.jsx";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="100vh">
        <CircularProgress />
      </Stack>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function Guest({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="100vh">
        <CircularProgress />
      </Stack>
    );
  }
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Guest>
            <LoginPage />
          </Guest>
        }
      />
      <Route
        path="/signup"
        element={
          <Guest>
            <SignupPage />
          </Guest>
        }
      />
      <Route
        path="/"
        element={
          <Protected>
            <SocialPage />
          </Protected>
        }
      />
    </Routes>
  );
}
