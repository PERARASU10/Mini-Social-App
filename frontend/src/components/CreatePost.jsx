import { useRef, useState } from "react";
import { Alert, Box, Button, IconButton, Stack, TextField, Typography } from "@mui/material";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CreatePost({ onCreate }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  async function pickImage(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Image must be under 4MB");
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setImage(dataUrl);
    setError("");
  }

  async function submit() {
    setError("");
    if (!text.trim() && !image) {
      setError("Add some text or an image");
      return;
    }
    setBusy(true);
    try {
      await onCreate({ text: text.trim(), image });
      setText("");
      setImage("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Box
      sx={{
        border: "1px solid #2d6aa8",
        borderRadius: 3,
        p: 2,
        background: "linear-gradient(180deg, #10233a 0%, #0c1c30 100%)",
      }}
    >
      <Typography fontWeight={800} mb={1.5}>
        Create Post
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 1.5 }}>
          {error}
        </Alert>
      )}
      <TextField
        multiline
        minRows={2}
        fullWidth
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {image && (
        <Box sx={{ position: "relative", mt: 1.5 }}>
          <Box
            component="img"
            src={image}
            alt="Selected"
            sx={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 2 }}
          />
          <IconButton
            size="small"
            onClick={() => setImage("")}
            sx={{ position: "absolute", top: 8, right: 8, bgcolor: "rgba(0,0,0,0.6)" }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1.5}>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickImage} />
        <IconButton color="primary" onClick={() => fileRef.current?.click()} aria-label="Add image">
          <AddAPhotoOutlinedIcon />
        </IconButton>
        <Button variant="contained" endIcon={<SendRoundedIcon />} disabled={busy} onClick={submit}>
          {busy ? "Posting..." : "Post"}
        </Button>
      </Stack>
    </Box>
  );
}
