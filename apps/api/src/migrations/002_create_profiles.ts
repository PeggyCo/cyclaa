/**
 * Migration: Create rider_profiles and mechanic_profiles
 * Role-specific extensions of users table
 */

import { DataTypes, QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  // Rider Profiles
  await queryInterface.createTable('RiderProfiles', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    homeAddress: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: '{ street, apt, city, state, zip, lat, lng }',
    },
    workAddress: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Same structure as homeAddress',
    },
    preferredServiceLocation: {
      type: DataTypes.ENUM('home', 'work', 'other'),
      allowNull: true,
      defaultValue: 'home',
    },
    stravaAccessToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Encrypted',
    },
    stravaRefreshToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Encrypted',
    },
    stravaAthleteId: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    garminAccessToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Encrypted',
    },
    totalRidesLogged: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalMilesLogged: {
      type: DataTypes.DECIMAL(10, 1),
      defaultValue: 0,
    },
    memberSinceDisplay: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date they joined for "Member since" display',
    },
    foundingMember: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    foundingMemberNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Sequential number for founding members only',
    },
    notificationPreferences: {
      type: DataTypes.JSONB,
      defaultValue: {
        bookingUpdates: true,
        communityActivity: true,
        maintenanceAlerts: true,
        promotions: true,
        rideReminders: true,
      },
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

  // Mechanic Profiles
  await queryInterface.createTable('MechanicProfiles', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: { len: [0, 500] },
    },
    headline: {
      type: DataTypes.STRING(150),
      allowNull: true,
      comment: 'e.g., "E-bike specialist with 8 years experience"',
    },
    specialties: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
      comment: 'road, mountain, e-bike, cargo, etc.',
    },
    yearsExperience: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    certifications: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Array of { name, issuer, year, verified }',
    },
    isMobile: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Can do mobile repairs',
    },
    serviceRadiusKm: {
      type: DataTypes.DECIMAL(4, 1),
      defaultValue: 8.0,
    },
    baseLocationLat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    baseLocationLng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    baseLocationAddress: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isFoundingMechanic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    foundingMechanicNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    guaranteeActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    guaranteeStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    guaranteeEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    stripeConnectAccountId: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    stripeConnectOnboarded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ratingAverage: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0.0,
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalJobsCompleted: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    completionRate: {
      type: DataTypes.DECIMAL(4, 1),
      defaultValue: 100.0,
      comment: 'Percentage of accepted jobs completed',
    },
    responseTimeAvgMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Real-time toggle',
    },
    availabilitySchedule: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Day-by-day availability blocks with times',
    },
    insuranceStatus: {
      type: DataTypes.ENUM('none', 'partial', 'full', 'velo_covered'),
      defaultValue: 'none',
    },
    insuranceExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    backgroundCheckStatus: {
      type: DataTypes.ENUM('pending', 'passed', 'failed', 'expired'),
      defaultValue: 'pending',
    },
    backgroundCheckDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    toolsVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('pending_review', 'active', 'suspended', 'deactivated'),
      defaultValue: 'pending_review',
    },
    suspensionReason: {
      type: DataTypes.TEXT,
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
  await queryInterface.addIndex('RiderProfiles', ['userId']);
  await queryInterface.addIndex('MechanicProfiles', ['userId']);
  await queryInterface.addIndex('MechanicProfiles', ['ratingAverage']);
  await queryInterface.addIndex('MechanicProfiles', ['status']);
  await queryInterface.addIndex('MechanicProfiles', ['isAvailable']);
  // GIN index for specialties array
  await queryInterface.sequelize.query(
    'CREATE INDEX idx_mechanic_specialties ON "MechanicProfiles" USING GIN (specialties)'
  );
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('MechanicProfiles');
  await queryInterface.dropTable('RiderProfiles');
}
