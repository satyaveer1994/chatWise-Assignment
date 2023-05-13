
const Post = require('../models/postModel');
const User = require('../models/userModel');
const Comment= require('../models/commentModel')


const createComment = async (req, res) => {
    try {
      const { text } = req.body;
      const { postId } = req.params;
      const { userId } = req.body
  
      // Check if post exists
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Create new comment
      const comment = new Comment({
        text,
        user: userId,
        post: postId,
      });
      await comment.save();
  
      // Add comment to post
      post.comments.push(comment._id);
      await post.save();
  
      // Return comment
      return res.status(201).json(comment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

  
  const getCommentsForPost = async (req, res) => {
    try {
      const { postId } = req.params;
  
      // Check if post exists
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Get comments for post
      const comments = await Comment.find({ post: postId })
        .populate('user', 'name')
        .sort({ createdAt: -1 });
  
      return res.status(200).json(comments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

  
  const editComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const { text } = req.body;
  
      // Check if comment exists
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      // Edit comment
      comment.text = text;
      await comment.save();
  
      return res.status(200).json({ message: 'Comment edited successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

  
  const deleteComment = async (req, res) => {
    try {
      const { commentId } = req.params;
  
      // Check if comment exists
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      // Remove comment from post
      const post = await Post.findById(comment.post);
      post.comments = post.comments.filter((c) => c.toString() !== commentId);
      await post.save();
  
      // Remove comment
      await comment.remove();
  
      return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  module.exports={createComment,getCommentsForPost,editComment,deleteComment}