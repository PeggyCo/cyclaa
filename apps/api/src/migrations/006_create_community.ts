/**
 * Migration: Create community tables
 * Ride groups, rides, posts, comments, likes
 */

import { DataTypes, QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  // Ride Groups
  await queryInterface.createTable('RideGroups', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    createdByUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pace: {
      type: DataTypes.ENUM('casual', 'moderate', 'fast', 'mixed'),
      allowNull: false,
    },
    neighborhood: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    rideStyle: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      comment: 'road, mountain, commute, social, etc.',
    },
    meetingPoint: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    memberCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    photoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  // Ride Group Memberships
  await queryInterface.createTable('RideGroupMembers', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'RideGroups', key: 'id' },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    role: {
      type: DataTypes.ENUM('member', 'moderator', 'admin'),
      defaultValue: 'member',
    },
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  // Scheduled Rides
  await queryInterface.createTable('Rides', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'RideGroups', key: 'id' },
      onDelete: 'SET NULL',
    },
    createdByUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    rideDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    distance: {
      type: DataTypes.DECIMAL(6, 1),
      allowNull: true,
      comment: 'Miles',
    },
    pace: {
      type: DataTypes.ENUM('casual', 'moderate', 'fast', 'mixed'),
      allowNull: false,
    },
    meetingPoint: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    maxRiders: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rsvpCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isCancelled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  // Ride RSVPs
  await queryInterface.createTable('RideRsvps', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rideId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Rides', key: 'id' },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    status: {
      type: DataTypes.ENUM('going', 'maybe', 'not_going'),
      defaultValue: 'going',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  // Community Posts
  await queryInterface.createTable('Posts', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'RideGroups', key: 'id' },
      onDelete: 'SET NULL',
      comment: 'NULL for global posts',
    },
    type: {
      type: DataTypes.ENUM('text', 'photo', 'ride_recap', 'question', 'announcement'),
      defaultValue: 'text',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    photoUrls: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    linkedRideId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'Rides', key: 'id' },
      onDelete: 'SET NULL',
    },
    linkedBikeId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'Bikes', key: 'id' },
      onDelete: 'SET NULL',
    },
    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    commentCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  // Post Comments
  await queryInterface.createTable('PostComments', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Posts', key: 'id' },
      onDelete: 'CASCADE',
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    parentCommentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'PostComments', key: 'id' },
      onDelete: 'CASCADE',
      comment: 'For nested replies',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  // Post Likes
  await queryInterface.createTable('PostLikes', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Posts', key: 'id' },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  // Indexes
  await queryInterface.addIndex('RideGroups', ['createdByUserId']);
  await queryInterface.addIndex('RideGroupMembers', ['groupId', 'userId']);
  await queryInterface.addIndex('Rides', ['groupId']);
  await queryInterface.addIndex('Rides', ['rideDate']);
  await queryInterface.addIndex('RideRsvps', ['rideId', 'userId']);
  await queryInterface.addIndex('Posts', ['authorId']);
  await queryInterface.addIndex('Posts', ['groupId']);
  await queryInterface.addIndex('Posts', ['createdAt']);
  await queryInterface.addIndex('PostComments', ['postId']);
  await queryInterface.addIndex('PostComments', ['authorId']);
  await queryInterface.addIndex('PostLikes', ['postId', 'userId']);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('PostLikes');
  await queryInterface.dropTable('PostComments');
  await queryInterface.dropTable('Posts');
  await queryInterface.dropTable('RideRsvps');
  await queryInterface.dropTable('Rides');
  await queryInterface.dropTable('RideGroupMembers');
  await queryInterface.dropTable('RideGroups');
}
