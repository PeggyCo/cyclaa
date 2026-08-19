import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

export enum ServiceCategory {
  MAINTENANCE = 'maintenance',
  REPAIR = 'repair',
  INSPECTION = 'inspection',
  CUSTOMIZATION = 'customization',
}

export interface ServiceTypeAttributes {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  category: ServiceCategory;
  minPrice: number;
  maxPrice: number;
  estimatedDurationMinutes: number;
  skillLevelRequired: 'basic' | 'intermediate' | 'advanced';
  partsTypicallyNeeded: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ServiceTypeCreationAttributes extends Optional<ServiceTypeAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class ServiceType extends Model<ServiceTypeAttributes, ServiceTypeCreationAttributes> implements ServiceTypeAttributes {
  public id!: string;
  public name!: string;
  public slug!: string;
  public description!: string;
  public iconName!: string;
  public category!: ServiceCategory;
  public minPrice!: number;
  public maxPrice!: number;
  public estimatedDurationMinutes!: number;
  public skillLevelRequired!: 'basic' | 'intermediate' | 'advanced';
  public partsTypicallyNeeded!: boolean;
  public isActive!: boolean;
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
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    iconName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Phosphor icon name',
    },
    category: {
      type: DataTypes.ENUM(...Object.values(ServiceCategory)),
      allowNull: false,
    },
    minPrice: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    maxPrice: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    estimatedDurationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    skillLevelRequired: {
      type: DataTypes.ENUM('basic', 'intermediate', 'advanced'),
      defaultValue: 'basic',
    },
    partsTypicallyNeeded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize: getDatabase(),
    tableName: 'ServiceTypes',
    indexes: [
      { fields: ['slug'] },
      { fields: ['category'] },
      { fields: ['isActive'] },
    ],
  }
);

export default ServiceType;
