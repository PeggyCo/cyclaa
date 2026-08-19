/**
 * Model Index
 * Exports all models and sets up associations
 */

import User from './User';
import RiderProfile from './RiderProfile';
import MechanicProfile from './MechanicProfile';
import ServiceType from './ServiceType';
import Bike from './Bike';
import Booking from './Booking';
import RideGroup from './RideGroup';
import RideGroupMember from './RideGroupMember';
import Ride from './Ride';
import RideRsvp from './RideRsvp';
import Post from './Post';
import PostComment from './PostComment';
import PostLike from './PostLike';
import Conversation from './Conversation';
import ConversationParticipant from './ConversationParticipant';
import Message from './Message';
import Notification from './Notification';
import DeviceToken from './DeviceToken';
import Waitlist from './Waitlist';

// User associations
User.hasOne(RiderProfile, { foreignKey: 'userId', as: 'riderProfile' });
RiderProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(MechanicProfile, { foreignKey: 'userId', as: 'mechanicProfile' });
MechanicProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Bike, { foreignKey: 'ownerId', as: 'bikes' });
Bike.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// Booking associations
User.hasMany(Booking, { foreignKey: 'riderId', as: 'bookingsAsRider' });
Booking.belongsTo(User, { foreignKey: 'riderId', as: 'rider' });

User.hasMany(Booking, { foreignKey: 'mechanicId', as: 'bookingsAsMechanic' });
Booking.belongsTo(User, { foreignKey: 'mechanicId', as: 'mechanic' });

Bike.hasMany(Booking, { foreignKey: 'bikeId', as: 'bookings' });
Booking.belongsTo(Bike, { foreignKey: 'bikeId', as: 'bike' });

ServiceType.hasMany(Booking, { foreignKey: 'serviceTypeId', as: 'bookings' });
Booking.belongsTo(ServiceType, { foreignKey: 'serviceTypeId', as: 'serviceType' });

// Community associations - RideGroups
User.hasMany(RideGroup, { foreignKey: 'createdByUserId', as: 'rideGroupsCreated' });
RideGroup.belongsTo(User, { foreignKey: 'createdByUserId', as: 'creator' });

RideGroup.hasMany(RideGroupMember, { foreignKey: 'groupId', as: 'members' });
RideGroupMember.belongsTo(RideGroup, { foreignKey: 'groupId', as: 'group' });

User.hasMany(RideGroupMember, { foreignKey: 'userId', as: 'groupMemberships' });
RideGroupMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Community associations - Rides
RideGroup.hasMany(Ride, { foreignKey: 'groupId', as: 'rides' });
Ride.belongsTo(RideGroup, { foreignKey: 'groupId', as: 'group' });

User.hasMany(Ride, { foreignKey: 'createdByUserId', as: 'ridesCreated' });
Ride.belongsTo(User, { foreignKey: 'createdByUserId', as: 'creator' });

Ride.hasMany(RideRsvp, { foreignKey: 'rideId', as: 'rsvps' });
RideRsvp.belongsTo(Ride, { foreignKey: 'rideId', as: 'ride' });

User.hasMany(RideRsvp, { foreignKey: 'userId', as: 'rideRsvps' });
RideRsvp.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Community associations - Posts
User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

RideGroup.hasMany(Post, { foreignKey: 'groupId', as: 'posts' });
Post.belongsTo(RideGroup, { foreignKey: 'groupId', as: 'group' });

Ride.hasMany(Post, { foreignKey: 'linkedRideId', as: 'posts' });
Post.belongsTo(Ride, { foreignKey: 'linkedRideId', as: 'linkedRide' });

Bike.hasMany(Post, { foreignKey: 'linkedBikeId', as: 'posts' });
Post.belongsTo(Bike, { foreignKey: 'linkedBikeId', as: 'linkedBike' });

Post.hasMany(PostComment, { foreignKey: 'postId', as: 'comments' });
PostComment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

User.hasMany(PostComment, { foreignKey: 'authorId', as: 'comments' });
PostComment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

PostComment.hasMany(PostComment, { foreignKey: 'parentCommentId', as: 'replies' });
PostComment.belongsTo(PostComment, { foreignKey: 'parentCommentId', as: 'parentComment' });

Post.hasMany(PostLike, { foreignKey: 'postId', as: 'likes' });
PostLike.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

User.hasMany(PostLike, { foreignKey: 'userId', as: 'postLikes' });
PostLike.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Messaging associations
Booking.hasOne(Conversation, { foreignKey: 'bookingId', as: 'conversation' });
Conversation.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

Conversation.hasMany(ConversationParticipant, { foreignKey: 'conversationId', as: 'participants' });
ConversationParticipant.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });

User.hasMany(ConversationParticipant, { foreignKey: 'userId', as: 'conversations' });
ConversationParticipant.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'messagesSent' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

// Notification associations
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(DeviceToken, { foreignKey: 'userId', as: 'deviceTokens' });
DeviceToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Waitlist associations (self-referential referral chain)
Waitlist.hasMany(Waitlist, { foreignKey: 'referredBy', as: 'referrals' });
Waitlist.belongsTo(Waitlist, { foreignKey: 'referredBy', as: 'referrer' });

export {
  User,
  RiderProfile,
  MechanicProfile,
  ServiceType,
  Bike,
  Booking,
  RideGroup,
  RideGroupMember,
  Ride,
  RideRsvp,
  Post,
  PostComment,
  PostLike,
  Conversation,
  ConversationParticipant,
  Message,
  Notification,
  DeviceToken,
  Waitlist,
};
