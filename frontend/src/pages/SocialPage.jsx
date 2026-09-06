import { useCallback, useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Fab,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import CreatePost from "../components/CreatePost.jsx";
import PostCard from "../components/PostCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

const FILTERS = [
  { id: "latest", label: "All Post" },
  { id: "liked", label: "Most Liked" },
  { id: "commented", label: "Most Commented" },
];

export default function SocialPage() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState("latest");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ sort });
      if (search.trim()) params.set("q", search.trim());
      const data = await api(`/api/posts?${params.toString()}`);
      setPosts(data.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sort, search]);

  useEffect(() => {
    load();
  }, [load]);

  function replacePost(updated) {
    setPosts((list) => list.map((p) => (p.id === updated.id ? updated : p)));
  }

  async function createPost(payload) {
    const data = await api("/api/posts", { method: "POST", body: payload });
    setPosts((list) => [data.post, ...list]);
  }

  async function likePost(id) {
    const data = await api(`/api/posts/${id}/like`, { method: "POST" });
    replacePost(data.post);
  }

  async function commentPost(id, text) {
    const data = await api(`/api/posts/${id}/comments`, { method: "POST", body: { text } });
    replacePost(data.post);
  }

  return (
    <Box sx={{ maxWidth: 560, mx: "auto", pb: 10 }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: "#07111f", borderBottom: "1px solid #13263d" }}>
        <Toolbar sx={{ px: 2 }}>
          <Typography variant="h5" fontWeight={800} sx={{ flexGrow: 1 }}>
            Social
          </Typography>
          <IconButton color="inherit" onClick={logout} aria-label="Log out">
            <LogoutRoundedIcon />
          </IconButton>
          <Avatar sx={{ ml: 1, bgcolor: "#7c3aed" }}>{user.username.slice(0, 1).toUpperCase()}</Avatar>
        </Toolbar>
      </AppBar>

      <Stack spacing={2} sx={{ p: 2 }}>
        <Paper
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(query);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            py: 0.5,
            bgcolor: "#10233a",
            border: "1px solid #1e3a5f",
          }}
        >
          <InputBase
            sx={{ flex: 1, color: "inherit" }}
            placeholder="Search users, posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <IconButton type="submit" color="primary">
            <SearchRoundedIcon />
          </IconButton>
        </Paper>

        <CreatePost onCreate={createPost} />

        <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 0.5 }}>
          {FILTERS.map((f) => (
            <Chip
              key={f.id}
              label={f.label}
              clickable
              onClick={() => setSort(f.id)}
              variant={sort === f.id ? "outlined" : "filled"}
              color={sort === f.id ? "primary" : "default"}
              sx={{ borderWidth: sort === f.id ? 2 : 0 }}
            />
          ))}
        </Stack>

        {loading && (
          <Stack alignItems="center" py={4}>
            <CircularProgress />
          </Stack>
        )}
        {!loading && error && (
          <Typography color="error" textAlign="center">
            {error}
          </Typography>
        )}
        {!loading && !error && posts.length === 0 && <EmptyState />}
        {!loading &&
          posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={likePost} onComment={commentPost} />
          ))}
      </Stack>

      <Fab
        color="primary"
        sx={{ position: "fixed", right: 24, bottom: 88 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Create post"
      >
        <AddRoundedIcon />
      </Fab>

      <Paper
        sx={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 0,
          bgcolor: "#0b1728",
          borderTop: "1px solid #1e3a5f",
        }}
      >
        <Stack alignItems="center" py={1.2} color="primary.main">
          <PublicRoundedIcon />
          <Typography variant="caption" fontWeight={700}>
            Social
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
