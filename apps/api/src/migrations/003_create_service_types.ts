/**
 * Migration: Create service_types table
 * Predefined catalog of 18 service types from spec
 */

import { DataTypes, QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('ServiceTypes', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'e.g., "Basic Tune-Up"',
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'URL-friendly slug',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    shortDescription: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Shown on card',
    },
    iconName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Phosphor icon name, e.g., "wrench"',
    },
    category: {
      type: DataTypes.ENUM(
        'maintenance',
        'repair',
        'installation',
        'inspection',
        'specialty',
        'e-bike'
      ),
      allowNull: false,
    },
    basePriceMin: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    basePriceMax: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    estimatedDurationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Estimated time to complete',
    },
    requiresParts: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether parts are typically needed',
    },
    commonParts: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Suggested parts for this service',
    },
    skillLevelRequired: {
      type: DataTypes.ENUM('basic', 'intermediate', 'advanced', 'specialist'),
      allowNull: false,
    },
    isMobileEligible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Can be done as mobile service',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    sortOrder: {
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

  await queryInterface.addIndex('ServiceTypes', ['slug']);
  await queryInterface.addIndex('ServiceTypes', ['category']);
  await queryInterface.addIndex('ServiceTypes', ['isActive']);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('ServiceTypes');
}
