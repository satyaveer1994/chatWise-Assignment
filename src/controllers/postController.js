const Post = require('../models/postModel');

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: { $in: req.user.friends } }).populate('author');
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author');
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the user is a friend of the post author
    if (!req.user.friends.includes(post.author._id) && !post.comments.some(c => req.user.friends.includes(c.author))) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
};

const createPost = async (req, res) => {
  try {
    const newPost = new Post({
      text: req.body.text,
      author: req.user.id,
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    post.text = req.body.text || post.text;
    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
};

module.exports={getAllPosts,getPostById,createPost,updatePost}
