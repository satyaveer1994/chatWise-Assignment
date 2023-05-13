## Social Network API

This is an API for a social network application that allows users to register, add friends, create posts, and comment on their friends' posts. The API is built using Node.js and Express, and uses MongoDB as its database and Redis as its caching layer.
Getting Started

To get started with the API, follow these steps:

    Clone this repository to your local machine: git clone https://github.com/satyaveer1994/chatWise-Assignment.git
    Install the dependencies: cd social-network-api && npm install
    
    The API will be running at http://localhost:3000

# Endpoints

- The following endpoints are available in the API:
Users

     GET /api/users - Get a list of all users
     POST /api/users - Register a new user
     GET /api/users/:userId - Get a user by ID
     PUT /api/users/:userId - Update a user by ID
     DELETE /api/users/:userId - Delete a user by ID

# Friends

    GET /api/friends/:userId - Get a list of a user's friends
    POST /api/friends - Send a friend request
    PUT /api/friends/:requestId - Accept or reject a friend request

# Posts

    GET /api/posts - Get a list of all posts
    POST /api/posts - Create a new post
    GET /api/posts/:postId - Get a post by ID
    PUT /api/posts/:postId - Update a post by ID
    DELETE /api/posts/:postId - Delete a post by ID

# Comments

    GET /api/comments - Get a list of all comments
    POST /api/comments - Create a new comment
    GET /api/comments/:commentId - Get a comment by ID
    PUT /api/comments/:commentId - Update a comment by ID
    DELETE /api/comments/:commentId - Delete a comment by ID

# Feed

    GET /api/feed/:userId - Get a user's feed
    POST /api/feed - Create a new post and add it to the user's feed

 # Redis

This API uses Redis as a caching layer to improve performance. The Redis connection is established in the utils/redis.js file, and the caching logic is implemented in the controllers/feed.js file.
Authors

    Your Name - satyaveer1994

License

This project is licensed under the MIT License - see the LICENSE.md file for details.