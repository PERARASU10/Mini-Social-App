import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function PostCard({ post, onLike, onComment }) {
  const [openComments, setOpenComments] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function sendComment(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    try {
      await onComment(post.id, text.trim());
      setText("");
      setOpenComments(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Box sx={{ border: "1px solid #1e3a5f", borderRadius: 3, p: 2, bgcolor: "#10233a" }}>
      <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
        <Avatar sx={{ bgcolor: "#3b82f6" }}>{post.username.slice(0, 1).toUpperCase()}</Avatar>
        <Box>
          <Typography fontWeight={700}>{post.username}</Typography>
          <Typography variant="caption" color="text.secondary">
            {timeAgo(post.createdAt)}
          </Typography>
        </Box>
      </Stack>
      {post.text && (
        <Typography sx={{ whiteSpace: "pre-wrap", mb: post.image ? 1.5 : 0 }}>{post.text}</Typography>
      )}
      {post.image && (
        <Box
          component="img"
          src={post.image}
          alt={`Post by ${post.username}`}
          sx={{ width: "100%", borderRadius: 2, maxHeight: 360, objectFit: "cover" }}
        />
      )}
      <Stack direction="row" spacing={1} mt={1.5} alignItems="center">
        <IconButton color={post.likedByMe ? "error" : "default"} onClick={() => onLike(post.id)}>
          {post.likedByMe ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
        </IconButton>
        <Typography variant="body2">{post.likesCount}</Typography>
        <IconButton onClick={() => setOpenComments((v) => !v)}>
          <ChatBubbleOutlineRoundedIcon />
        </IconButton>
        <Typography variant="body2">{post.commentsCount}</Typography>
      </Stack>
      {post.likes.length > 0 && (
        <Stack direction="row" spacing={0.5} mt={1} flexWrap="wrap" useFlexGap>
          {post.likes.map((name) => (
            <Chip key={name} size="small" label={name} />
          ))}
        </Stack>
      )}
      <Collapse in={openComments}>
        <Stack mt={1.5} spacing={1}>
          {post.comments.map((c) => (
            <Box key={c.id} sx={{ bgcolor: "#0c1c30", borderRadius: 2, p: 1.2 }}>
              <Typography variant="subtitle2">{c.username}</Typography>
              <Typography variant="body2" color="text.secondary">
                {c.text}
              </Typography>
            </Box>
          ))}
          <Stack component="form" direction="row" spacing={1} onSubmit={sendComment}>
            <TextField
              size="small"
              fullWidth
              placeholder="Write a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button type="submit" variant="contained" disabled={busy}>
              Send
            </Button>
          </Stack>
        </Stack>
      </Collapse>
    </Box>
  );
}
