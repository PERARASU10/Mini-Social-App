import { Router } from "express";
import { Post } from "../models/Post.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function formatPost(post, currentUsername) {
  return {
    id: post._id,
    username: post.username,
    text: post.text,
    image: post.image,
    likes: post.likes,
    likesCount: post.likes.length,
    comments: post.comments.map((c) => ({
      id: c._id,
      username: c.username,
      text: c.text,
      createdAt: c.createdAt,
    })),
    commentsCount: post.comments.length,
    likedByMe: post.likes.includes(currentUsername),
    createdAt: post.createdAt,
  };
}

router.get("/", requireAuth, async (req, res) => {
  const sort = req.query.sort || "latest";
  const q = String(req.query.q || "").trim();
  const filter = q
    ? {
        $or: [
          { username: { $regex: q, $options: "i" } },
          { text: { $regex: q, $options: "i" } },
        ],
      }
    : {};

  const posts = await Post.find(filter).sort({ createdAt: -1 }).lean();
  let list = posts.map((p) => formatPost(p, req.user.username));

  if (sort === "liked") {
    list.sort((a, b) => b.likesCount - a.likesCount);
  } else if (sort === "commented") {
    list.sort((a, b) => b.commentsCount - a.commentsCount);
  }

  res.json({ posts: list });
});

router.post("/", requireAuth, async (req, res) => {
  const text = String(req.body.text || "").trim();
  const image = String(req.body.image || "").trim();

  if (!text && !image) {
    return res.status(400).json({ message: "Add some text or an image" });
  }
  if (image && !image.startsWith("data:image/")) {
    return res.status(400).json({ message: "Image must be a valid image file" });
  }
  if (image && image.length > 5_500_000) {
    return res.status(400).json({ message: "Image is too large (max ~4MB)" });
  }

  const post = await Post.create({
    user: req.user._id,
    username: req.user.username,
    text,
    image,
    likes: [],
    comments: [],
  });

  res.status(201).json({ post: formatPost(post, req.user.username) });
});

router.post("/:id/like", requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const name = req.user.username;
  const already = post.likes.includes(name);
  if (already) {
    post.likes = post.likes.filter((n) => n !== name);
  } else {
    post.likes.push(name);
  }
  await post.save();
  res.json({ post: formatPost(post, name) });
});

router.post("/:id/comments", requireAuth, async (req, res) => {
  const text = String(req.body.text || "").trim();
  if (!text) {
    return res.status(400).json({ message: "Comment cannot be empty" });
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  post.comments.push({ username: req.user.username, text });
  await post.save();
  res.status(201).json({ post: formatPost(post, req.user.username) });
});

export default router;
