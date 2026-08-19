/**
 * Migration: Create waitlist table
 * Tracks early access signups with referral tracking
 */

import { DataTypes, QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('Waitlists', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    borough: {
      type: DataTypes.ENUM('manhattan', 'brooklyn', 'queens', 'bronx', 'staten_island', 'other'),
      defaultValue: 'other',
    },
    referralCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      comment: 'Unique code for sharing',
    },
    referredBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'Waitlists', key: 'id' },
      onDelete: 'SET NULL',
      comment: 'Who referred this person',
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Position in waitlist queue',
    },
    emailConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    confirmationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    confirmationSentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    confirmedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    referralCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of successful referrals',
    },
    accessGranted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    accessGrantedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    source: {
      type: DataTypes.ENUM('website', 'app', 'social', 'other'),
      defaultValue: 'website',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Index for faster lookups
  await queryInterface.addIndex('Waitlists', ['email']);
  await queryInterface.addIndex('Waitlists', ['referralCode']);
  await queryInterface.addIndex('Waitlists', ['borough']);
  await queryInterface.addIndex('Waitlists', ['position']);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('Waitlists');
}
