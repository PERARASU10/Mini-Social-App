import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#3b82f6" },
    background: {
      default: "#07111f",
      paper: "#10233a",
    },
    text: {
      primary: "#f8fbff",
      secondary: "#9fb3c8",
    },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 700 },
      },
    },
  },
});
