const Post = require("../models/Post")
const Comment = require("../models/Comment")

// CREATE POST
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body

    if (!content || content.trim().length === 0) {
      return res.json({ message: "Post content is required" })
    }

    const post = await Post.create({
      content,
      author: req.userId // from auth middleware
    })

    const populatedPost = await Post.findById(post._id)
      .populate("author", "name email")
      .populate({
        path: "comments",
        populate: { path: "author", select: "name email" }
      })

    res.json({ message: "Post created successfully", post: populatedPost })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// GET ALL POSTS
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "name email")
      .populate({
        path: "comments",
        populate: { path: "author", select: "name email" }
      })

    res.json({ posts })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// GET SINGLE POST
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params

    const post = await Post.findById(id)
      .populate("author", "name email")
      .populate({
        path: "comments",
        populate: { path: "author", select: "name email" }
      })

    if (!post) {
      return res.json({ message: "Post not found" })
    }

    res.json({ post })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// LIKE/UNLIKE POST
exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId

    const post = await Post.findById(id)

    if (!post) {
      return res.json({ message: "Post not found" })
    }

    const likeIndex = post.likes.indexOf(userId)

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1)
    } else {
      // Like
      post.likes.push(userId)
    }

    await post.save()

    const updatedPost = await Post.findById(post._id)
      .populate("author", "name email")
      .populate({
        path: "comments",
        populate: { path: "author", select: "name email" }
      })

    res.json({ 
      message: likeIndex > -1 ? "Post unliked" : "Post liked", 
      post: updatedPost 
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// DELETE POST
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId

    const post = await Post.findById(id)

    if (!post) {
      return res.json({ message: "Post not found" })
    }

    // Check if user is the author
    if (post.author.toString() !== userId) {
      return res.json({ message: "Unauthorized to delete this post" })
    }

    // Delete all comments associated with this post
    await Comment.deleteMany({ _id: { $in: post.comments } })

    // Delete the post
    await Post.findByIdAndDelete(id)

    res.json({ message: "Post deleted successfully" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}
