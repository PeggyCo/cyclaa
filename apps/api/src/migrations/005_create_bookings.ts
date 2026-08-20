/**
 * Migration: Create bookings table
 * Core booking model with all status states
 */

import { DataTypes, QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('Bookings', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    riderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    mechanicId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'Users', key: 'id' },
      onDelete: 'SET NULL',
      comment: 'NULL until matched with mechanic',
    },
    bikeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Bikes', key: 'id' },
      onDelete: 'RESTRICT',
    },
    serviceTypeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'ServiceTypes', key: 'id' },
      onDelete: 'RESTRICT',
    },
    status: {
      type: DataTypes.ENUM(
        'pending_match',
        'matched',
        'confirmed',
        'mechanic_en_route',
        'in_progress',
        'completed',
        'cancelled_by_rider',
        'declined_by_mechanic',
        'disputed'
      ),
      defaultValue: 'pending_match',
      allowNull: false,
    },
    bookingType: {
      type: DataTypes.ENUM('on_demand', 'scheduled'),
      defaultValue: 'on_demand',
    },
    scheduledDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'For scheduled bookings',
    },
    scheduledTime: {
      type: DataTypes.TIME,
      allowNull: true,
      comment: 'For scheduled bookings',
    },
    serviceLocation: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: '{ type: "home"|"work"|"custom", address, lat, lng }',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'What needs fixing',
    },
    photoUrls: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      comment: 'Photos of bike issue',
    },
    quotedPrice: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      comment: 'Initial estimate based on service type',
    },
    partsCost: {
      type: DataTypes.DECIMAL(8, 2),
      defaultValue: 0,
      comment: 'Cost of parts used',
    },
    finalPrice: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      comment: 'Final price after completion',
    },
    commissionPercent: {
      type: DataTypes.DECIMAL(4, 1),
      defaultValue: 18,
      comment: 'Cyclaa commission percentage',
    },
    mechanicPayout: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      comment: 'Amount mechanic receives',
    },
    completionNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'What was done',
    },
    completionPhotos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      comment: 'After-repair photos',
    },
    riderRating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 1, max: 5 },
    },
    riderReview: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mechanicRating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 1, max: 5 },
    },
    mechanicReview: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estimatedEtaMinutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Calculated when mechanic en-route',
    },
    actualArrivedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    actualCompletedAt: {
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
  });

  // Indexes
  await queryInterface.addIndex('Bookings', ['riderId']);
  await queryInterface.addIndex('Bookings', ['mechanicId']);
  await queryInterface.addIndex('Bookings', ['bikeId']);
  await queryInterface.addIndex('Bookings', ['status']);
  await queryInterface.addIndex('Bookings', ['createdAt']);
  await queryInterface.addIndex('Bookings', ['scheduledDate']);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('Bookings');
}
