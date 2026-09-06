import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Box className="auth-wrap" sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2 }}>
      <Paper sx={{ width: "100%", maxWidth: 420, p: 3, border: "1px solid #1e3a5f" }}>
        <Typography variant="h5" fontWeight={800} mb={0.5}>
          Welcome back
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Log in to see the social feed.
        </Typography>
        <Stack component="form" spacing={2} onSubmit={onSubmit}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" size="large" disabled={busy}>
            {busy ? "Logging in..." : "Log in"}
          </Button>
          <Typography color="text.secondary">
            New here?{" "}
            <Button component={RouterLink} to="/signup" size="small">
              Create an account
            </Button>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
