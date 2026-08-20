/**
 * Migration: Create bikes table
 * Digital Bike Passport with full service history and component tracking
 */

import { DataTypes, QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('Bikes', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    nickname: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'e.g., "The Commuter", "Weekend Beast"',
    },
    make: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Brand, e.g., "Trek"',
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Model, e.g., "Domane SL 6"',
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM(
        'road',
        'mountain',
        'hybrid',
        'commuter',
        'e-bike',
        'cargo',
        'gravel',
        'track',
        'bmx',
        'folding',
        'other'
      ),
      allowNull: false,
    },
    frameMaterial: {
      type: DataTypes.ENUM('carbon', 'aluminum', 'steel', 'titanium', 'other'),
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    serialNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Encrypted at rest',
    },
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    purchasePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    estimatedValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Calculated from age, condition, service history',
    },
    photoUrls: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      comment: 'S3 URLs, max 6 photos',
    },
    isEbike: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ebikeMotorType: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ebikeBatteryCapacityWh: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    totalMiles: {
      type: DataTypes.DECIMAL(10, 1),
      defaultValue: 0,
      comment: 'Synced from Strava/Garmin or manual',
    },
    milesSinceLastService: {
      type: DataTypes.DECIMAL(10, 1),
      defaultValue: 0,
    },
    lastServiceDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nextServiceDueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Calculated by predictive maintenance',
    },
    nextServiceDueMiles: {
      type: DataTypes.DECIMAL(10, 1),
      allowNull: true,
    },
    components: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Full component tracking: chain, tires, brakes, etc.',
    },
    isStolen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    stolenReportedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isForSale: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    salePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    saleDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    insurancePolicyId: {
      type: DataTypes.STRING(100),
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
  await queryInterface.addIndex('Bikes', ['ownerId']);
  await queryInterface.addIndex('Bikes', ['type']);
  await queryInterface.addIndex('Bikes', ['isForSale']);
  await queryInterface.addIndex('Bikes', ['serialNumber']);
  await queryInterface.addIndex('Bikes', ['isStolen']);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('Bikes');
}
