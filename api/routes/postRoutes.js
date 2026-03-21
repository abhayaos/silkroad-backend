const express = require("express")
const router = express.Router()

const authMiddleware = require("../middleware/authMiddleware")

const {
  createPost,
  getAllPosts,
  getPostById,
  toggleLike,
  deletePost
} = require("../controllers/postController")

// Public route - anyone can view posts
router.get("/", getAllPosts)
router.get("/:id", getPostById)

// Protected routes - require authentication
router.post("/", authMiddleware, createPost)
router.post("/:id/like", authMiddleware, toggleLike)
router.delete("/:id", authMiddleware, deletePost)

module.exports = router
