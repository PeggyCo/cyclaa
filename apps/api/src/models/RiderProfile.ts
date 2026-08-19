import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

interface LocationData {
  type: 'home' | 'work';
  address: string;
  lat: number;
  lng: number;
}

export interface RiderProfileAttributes {
  id: string;
  userId: string;
  homeAddress?: LocationData;
  workAddress?: LocationData;
  stravaToken?: string;
  stravaRefreshToken?: string;
  garminToken?: string;
  garminRefreshToken?: string;
  totalRidesCount: number;
  totalMilesDriven: number;
  averageRating: number;
  ratingCount: number;
  isFoundingMember: boolean;
  preferredLanguage: string;
  notificationPreferences?: Record<string, boolean>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RiderProfileCreationAttributes extends Optional<RiderProfileAttributes, 'id' | 'createdAt' | 'updatedAt' | 'totalRidesCount' | 'totalMilesDriven' | 'averageRating' | 'ratingCount'> {}

export class RiderProfile extends Model<RiderProfileAttributes, RiderProfileCreationAttributes> implements RiderProfileAttributes {
  public id!: string;
  public userId!: string;
  public homeAddress?: LocationData;
  public workAddress?: LocationData;
  public stravaToken?: string;
  public stravaRefreshToken?: string;
  public garminToken?: string;
  public garminRefreshToken?: string;
  public totalRidesCount!: number;
  public totalMilesDriven!: number;
  public averageRating!: number;
  public ratingCount!: number;
  public isFoundingMember!: boolean;
  public preferredLanguage!: string;
  public notificationPreferences?: Record<string, boolean>;
  public createdAt?: Date;
  public updatedAt?: Date;
}

RiderProfile.init(
  {
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
    },
    workAddress: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    stravaToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    stravaRefreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    garminToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    garminRefreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    totalRidesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalMilesDriven: {
      type: DataTypes.DECIMAL(10, 1),
      defaultValue: 0,
    },
    averageRating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 5.0,
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isFoundingMember: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    preferredLanguage: {
      type: DataTypes.STRING(10),
      defaultValue: 'en',
    },
    notificationPreferences: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize: getDatabase(),
    tableName: 'RiderProfiles',
    indexes: [
      { fields: ['userId'] },
      { fields: ['averageRating'] },
    ],
  }
);

export default RiderProfile;
