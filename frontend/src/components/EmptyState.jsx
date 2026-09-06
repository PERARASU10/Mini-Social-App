import { Box, Typography } from "@mui/material";

export default function EmptyState() {
  return (
    <Box sx={{ textAlign: "center", py: 6 }}>
      <Box
        sx={{
          width: 140,
          height: 100,
          mx: "auto",
          mb: 2,
          border: "2px dashed #3b82f6",
          borderRadius: 2,
          position: "relative",
          background: "linear-gradient(180deg, #1a334d, #10233a)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 18,
            border: "2px dashed #60a5fa",
            borderRadius: 1,
            opacity: 0.7,
          }}
        />
      </Box>
      <Typography sx={{ fontStyle: "italic", color: "#c9d7e8" }}>
        Nothing here yet, check back soon!
      </Typography>
    </Box>
  );
}
