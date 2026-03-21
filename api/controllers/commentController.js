const Comment = require("../models/Comment")
const Post = require("../models/Post")

// CREATE COMMENT
exports.createComment = async (req, res) => {
  try {
    const { content, postId } = req.body

    if (!content || content.trim().length === 0) {
      return res.json({ message: "Comment content is required" })
    }

    if (!postId) {
      return res.json({ message: "Post ID is required" })
    }

    // Check if post exists
    const post = await Post.findById(postId)
    if (!post) {
      return res.json({ message: "Post not found" })
    }

    const comment = await Comment.create({
      content,
      post: postId,
      author: req.userId // from auth middleware
    })

    // Add comment to post's comments array
    post.comments.push(comment._id)
    await post.save()

    // Populate the comment with author info
    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "name email")

    res.json({ message: "Comment added successfully", comment: populatedComment })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// DELETE COMMENT
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId

    const comment = await Comment.findById(id)

    if (!comment) {
      return res.json({ message: "Comment not found" })
    }

    // Check if user is the author
    if (comment.author.toString() !== userId) {
      return res.json({ message: "Unauthorized to delete this comment" })
    }

    // Remove comment from post's comments array
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id }
    })

    // Delete the comment
    await Comment.findByIdAndDelete(id)

    res.json({ message: "Comment deleted successfully" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}
