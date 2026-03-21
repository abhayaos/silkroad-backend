const express = require("express")
const router = express.Router()

const authMiddleware = require("../middleware/authMiddleware")

const {
  createComment,
  deleteComment
} = require("../controllers/commentController")

// Protected routes - require authentication
router.post("/", authMiddleware, createComment)
router.delete("/:id", authMiddleware, deleteComment)

module.exports = router
