/**
 * Migration: Create users table
 * Core user model with role ENUM (rider, mechanic, admin)
 */

import { DataTypes, QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('Users', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Auto-generated: firstName + lastInitial',
    },
    avatarUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('rider', 'mechanic', 'admin'),
      allowNull: false,
      defaultValue: 'rider',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isPro: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    proExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    stripeCustomerId: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    defaultPaymentMethodId: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    referralCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      comment: '6-char alphanumeric code',
    },
    referredBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'Users', key: 'id' },
      onDelete: 'SET NULL',
    },
    pushToken: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'OneSignal push token',
    },
    lastLocationLat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    lastLocationLng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    lastLocationUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Soft delete',
    },
  });

  // Indexes for performance
  await queryInterface.addIndex('Users', ['email']);
  await queryInterface.addIndex('Users', ['phone']);
  await queryInterface.addIndex('Users', ['role']);
  await queryInterface.addIndex('Users', ['referralCode']);
  await queryInterface.addIndex('Users', ['createdAt']);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('Users');
}
