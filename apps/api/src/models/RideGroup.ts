import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

export enum RidePace {
  CASUAL = 'casual',
  MODERATE = 'moderate',
  FAST = 'fast',
  MIXED = 'mixed',
}

export interface RideGroupAttributes {
  id: string;
  createdByUserId: string;
  name: string;
  description?: string;
  pace: RidePace;
  neighborhood?: string;
  rideStyle: string[];
  meetingPoint?: string;
  memberCount: number;
  photoUrl?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RideGroupCreationAttributes extends Optional<RideGroupAttributes, 'id' | 'createdAt' | 'updatedAt' | 'memberCount' | 'rideStyle'> {}

export class RideGroup extends Model<RideGroupAttributes, RideGroupCreationAttributes> implements RideGroupAttributes {
  public id!: string;
  public createdByUserId!: string;
  public name!: string;
  public description?: string;
  public pace!: RidePace;
  public neighborhood?: string;
  public rideStyle!: string[];
  public meetingPoint?: string;
  public memberCount!: number;
  public photoUrl?: string;
  public isActive!: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;
}

RideGroup.init(
  {
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
      type: DataTypes.ENUM(...Object.values(RidePace)),
      allowNull: false,
    },
    neighborhood: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    rideStyle: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
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
  },
  {
    sequelize: getDatabase(),
    tableName: 'RideGroups',
    indexes: [{ fields: ['createdByUserId'] }],
  }
);

export default RideGroup;
