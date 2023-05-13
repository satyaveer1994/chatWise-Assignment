const express = require("express");
const router = express.Router();

const commentController= require('../controllers/commentControllers')
const friendsController= require('../controllers/friendsControllers')

const postController= require('../controllers/postController')

const userController= require('../controllers/userController')

const feedController= require('../controllers/feedsControllers')





// User routes
router.post('/users', userController.registerUser);
router.post('/login', userController.loginUser);

// Friend request routes
router.post('/friend-requests', friendsController.sendFriendRequest);
router.get('/friend-requests/:requestId', friendsController.getFriendRequests);
router.put('/friend-requests/:requestId', friendsController.acceptFriendRequest);
router.delete('/friend-requests/:requestId', friendsController.rejectFriendRequest);


// Post routes
router.post('/posts', postController.createPost);
router.get('/posts', postController.getAllPosts);
router.get('/posts/:postId', postController.getPostById);
router.put('/posts/:postId', postController.updatePost);


// Comment routes
router.post('/posts/:postId/comments', commentController.createComment);
router.get('/posts/:postId/comments/:commentId', commentController.getCommentsForPost);
router.put('/posts/:postId/comments/:commentId', commentController.editComment);
router.delete('/posts/:postId/comments/:commentId', commentController.deleteComment);


// Feed route
router.get('/users/:userId/feed', feedController.getUserFeed);

module.exports = router;
