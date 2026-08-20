/**
 * Migration: Create messaging tables
 * Direct messaging between riders and mechanics, notifications
 */

import { DataTypes, QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  // Conversations between users
  await queryInterface.createTable('Conversations', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'Bookings', key: 'id' },
      onDelete: 'SET NULL',
      comment: 'Links conversation to booking context',
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

  // Participants in conversation (always 2: rider + mechanic)
  await queryInterface.createTable('ConversationParticipants', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Conversations', key: 'id' },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    lastReadAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Timestamp of last read message',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  // Individual messages
  await queryInterface.createTable('Messages', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Conversations', key: 'id' },
      onDelete: 'CASCADE',
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrls: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      comment: 'S3 URLs for message attachments',
    },
    status: {
      type: DataTypes.ENUM('sent', 'delivered', 'read'),
      defaultValue: 'sent',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  // Push notifications (in-app notifications)
  await queryInterface.createTable('Notifications', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    type: {
      type: DataTypes.ENUM(
        'booking_matched',
        'booking_confirmed',
        'mechanic_en_route',
        'booking_completed',
        'new_message',
        'booking_cancelled',
        'ride_reminder',
        'group_activity',
        'post_like',
        'post_comment',
        'system'
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    relatedEntityType: {
      type: DataTypes.ENUM('booking', 'conversation', 'ride', 'post', 'group'),
      allowNull: true,
    },
    relatedEntityId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'ID of booking, conversation, ride, etc.',
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  // Device tokens for push notifications
  await queryInterface.createTable('DeviceTokens', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    deviceType: {
      type: DataTypes.ENUM('ios', 'android', 'web'),
      allowNull: false,
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

  // Indexes
  await queryInterface.addIndex('Conversations', ['bookingId']);
  await queryInterface.addIndex('Conversations', ['updatedAt']);
  await queryInterface.addIndex('ConversationParticipants', ['conversationId', 'userId']);
  await queryInterface.addIndex('ConversationParticipants', ['userId']);
  await queryInterface.addIndex('Messages', ['conversationId']);
  await queryInterface.addIndex('Messages', ['senderId']);
  await queryInterface.addIndex('Messages', ['createdAt']);
  await queryInterface.addIndex('Notifications', ['userId']);
  await queryInterface.addIndex('Notifications', ['userId', 'isRead']);
  await queryInterface.addIndex('Notifications', ['createdAt']);
  await queryInterface.addIndex('DeviceTokens', ['userId']);
  await queryInterface.addIndex('DeviceTokens', ['token']);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('DeviceTokens');
  await queryInterface.dropTable('Notifications');
  await queryInterface.dropTable('Messages');
  await queryInterface.dropTable('ConversationParticipants');
  await queryInterface.dropTable('Conversations');
}
