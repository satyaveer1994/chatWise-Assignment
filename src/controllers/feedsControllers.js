//const redisClient = require('../redis');
const redis = require("redis");
const { promisify } = require("util");

const Post = require('../models/postModel');
const Friend = require('../models/friendsModel');

//..........................Connect to redis..............................................


const redisClient = redis.createClient({
    
    password: 'TCgFRBVdKNCOp76ZutXVAsTlDwa5s4HQ',
    socket: {
        host: 'redis-14670.c301.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 14670
    }
}
    
);


redisClient.auth("Y52LH5DG1XbiVCkNC2G65MvOFswvQCRQ", function (err) {
    if (err) throw err;
});


redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);



const getUserFeed = async (req, res) => {
  const { userId } = req.params;
  const cacheKey = `user:${userId}:feed`;

  try {
    // try to get the feed from Redis cache
    const cachedFeed = await getAsync(cacheKey);
    if (cachedFeed) {
      console.log('Serving feed from cache');
      const posts = JSON.parse(cachedFeed);
      return res.json(posts);
    }

    // get list of user's friends
    const friends = await Friend.find({ user: userId, status: 'accepted' }, 'friend');

    // get list of postIds from friends and user
    const postIds = await Post.find({
      $or: [
        { author: { $in: friends.map(friend => friend.friend) } },
        { author: userId },
      ],
    }, '_id');

    // get list of posts
    const posts = await Post.find({ _id: { $in: postIds } }).populate('author');

    // cache the feed in Redis for future requests
    await setAsync(cacheKey, JSON.stringify(posts));

    return res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};


module.exports={getUserFeed}