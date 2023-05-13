const User = require('../models/userModel');
const FriendRequest = require('../models/friendsModel');

const sendFriendRequest = async (req, res) => {
  try {
    const { requester, recipient } = req.body;

    // Check if requester and recipient exist
    const [requesterUser, recipientUser] = await Promise.all([
      User.findById(requester),
      User.findById(recipient),
    ]);
    if (!requesterUser || !recipientUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if friend request already exists
    const existingRequest = await FriendRequest.findOne({
      requester,
      recipient,
    });
    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Create friend request
    const friendRequest = await FriendRequest.create({
      requester,
      recipient,
    });

    return res.status(200).json(friendRequest);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


const getFriendRequests = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Get friend requests sent to the user
      const receivedRequests = await FriendRequest.find({
        recipient: userId,
      }).populate('requester', 'name email');
      
      // Get friend requests sent by the user
      const sentRequests = await FriendRequest.find({
        requester: userId,
      }).populate('recipient', 'name email');
  
      const friendRequests = [...receivedRequests, ...sentRequests];
  
      return res.status(200).json(friendRequests);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

  
  const acceptFriendRequest = async (req, res) => {
    try {
      const { friendRequestId } = req.params;
      const { userId } = req.body;
  
      // Check if friend request exists
      const friendRequest = await FriendRequest.findById(friendRequestId);
      if (!friendRequest) {
        return res.status(404).json({ message: 'Friend request not found' });
      }
  
      // Check if the user is the recipient of the friend request
      if (friendRequest.recipient.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized' });
      }
  
      // Update friend request status to accepted
      friendRequest.status = 'accepted';
      await friendRequest.save();
  
      // Add each other as friends
      const [requester, recipient] = await Promise.all([
        User.findById(friendRequest.requester),
        User.findById(friendRequest.recipient),
      ]);
      requester.friends.push(recipient._id);
      recipient.friends.push(requester._id);
      await Promise.all([
        requester.save(),
        recipient.save(),
      ]);
  
      return res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

  
  const rejectFriendRequest = async (req, res) => {
    try {
      const { friendRequestId } = req.params;
      const { userId } = req.body;
  
      // Check if friend request exists
      const friendRequest = await FriendRequest.findById(friendRequestId);
      if (!friendRequest) {
        return res.status(404).json({ message: 'Friend request not found' });
      }
  
      // Check if the user is the recipient of the friend request
      if (friendRequest.recipient.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized' });
      }
  
      // Update friend request status to rejected
      friendRequest.status = 'rejected';
      await friendRequest.save();
  
      return res.status(200).json({ message: 'Friend request rejected' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  

  module.exports={sendFriendRequest,getFriendRequests,acceptFriendRequest,rejectFriendRequest}