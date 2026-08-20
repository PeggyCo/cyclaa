import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

// NOTE: these field names/enum values mirror the actual table shape
// created by migrations/003_create_service_types.ts exactly. An earlier
// version of this model used a different shape (minPrice/maxPrice,
// partsTypicallyNeeded, a 4-value category enum) that never matched the
// migration and would fail at runtime — fixed to track the migration,
// since that's what's actually in the database.
export enum ServiceCategory {
  MAINTENANCE = 'maintenance',
  REPAIR = 'repair',
  INSTALLATION = 'installation',
  INSPECTION = 'inspection',
  SPECIALTY = 'specialty',
  E_BIKE = 'e-bike',
}

interface CommonPart {
  name: string;
  estimatedCost?: number;
}

export interface ServiceTypeAttributes {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  iconName?: string;
  category: ServiceCategory;
  basePriceMin: number;
  basePriceMax: number;
  estimatedDurationMinutes: number;
  requiresParts: boolean;
  commonParts?: CommonPart[];
  skillLevelRequired: 'basic' | 'intermediate' | 'advanced' | 'specialist';
  isMobileEligible: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ServiceTypeCreationAttributes
  extends Optional<
    ServiceTypeAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'requiresParts' | 'isMobileEligible' | 'isActive' | 'sortOrder'
  > {}

export class ServiceType
  extends Model<ServiceTypeAttributes, ServiceTypeCreationAttributes>
  implements ServiceTypeAttributes
{
  public id!: string;
  public name!: string;
  public slug!: string;
  public description?: string;
  public shortDescription?: string;
  public iconName?: string;
  public category!: ServiceCategory;
  public basePriceMin!: number;
  public basePriceMax!: number;
  public estimatedDurationMinutes!: number;
  public requiresParts!: boolean;
  public commonParts?: CommonPart[];
  public skillLevelRequired!: 'basic' | 'intermediate' | 'advanced' | 'specialist';
  public isMobileEligible!: boolean;
  public isActive!: boolean;
  public sortOrder!: number;
  public createdAt?: Date;
  public updatedAt?: Date;
}

ServiceType.init(
  {
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
      type: DataTypes.ENUM(...Object.values(ServiceCategory)),
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
  },
  {
    sequelize: getDatabase(),
    tableName: 'ServiceTypes',
    indexes: [{ fields: ['slug'] }, { fields: ['category'] }, { fields: ['isActive'] }],
  }
);

export default ServiceType;
