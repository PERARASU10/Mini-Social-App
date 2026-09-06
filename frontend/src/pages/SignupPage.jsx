import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signup(username, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2 }}>
      <Paper sx={{ width: "100%", maxWidth: 420, p: 3, border: "1px solid #1e3a5f" }}>
        <Typography variant="h5" fontWeight={800} mb={0.5}>
          Create account
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Sign up with email and password to start posting.
        </Typography>
        <Stack component="form" spacing={2} onSubmit={onSubmit}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField
            label="Password"
            type="password"
            helperText="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" size="large" disabled={busy}>
            {busy ? "Creating..." : "Sign up"}
          </Button>
          <Typography color="text.secondary">
            Already have an account?{" "}
            <Button component={RouterLink} to="/login" size="small">
              Log in
            </Button>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
