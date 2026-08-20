import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

// NOTE: mirrors migrations/002_create_profiles.ts's RiderProfiles table
// exactly. An earlier version of this model used different field names
// (totalRidesCount, averageRating, preferredLanguage, garminToken, ...)
// that never matched the migration — fixed to track the migration.
interface LocationData {
  street?: string;
  apt?: string;
  city?: string;
  state?: string;
  zip?: string;
  lat?: number;
  lng?: number;
}

interface NotificationPreferences {
  bookingUpdates: boolean;
  communityActivity: boolean;
  maintenanceAlerts: boolean;
  promotions: boolean;
  rideReminders: boolean;
}

export interface RiderProfileAttributes {
  id: string;
  userId: string;
  homeAddress?: LocationData;
  workAddress?: LocationData;
  preferredServiceLocation?: 'home' | 'work' | 'other';
  stravaAccessToken?: string;
  stravaRefreshToken?: string;
  stravaAthleteId?: string;
  garminAccessToken?: string;
  totalRidesLogged: number;
  totalMilesLogged: number;
  memberSinceDisplay?: Date;
  foundingMember: boolean;
  foundingMemberNumber?: number;
  notificationPreferences?: NotificationPreferences;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RiderProfileCreationAttributes
  extends Optional<
    RiderProfileAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'totalRidesLogged' | 'totalMilesLogged' | 'foundingMember'
  > {}

export class RiderProfile
  extends Model<RiderProfileAttributes, RiderProfileCreationAttributes>
  implements RiderProfileAttributes
{
  public id!: string;
  public userId!: string;
  public homeAddress?: LocationData;
  public workAddress?: LocationData;
  public preferredServiceLocation?: 'home' | 'work' | 'other';
  public stravaAccessToken?: string;
  public stravaRefreshToken?: string;
  public stravaAthleteId?: string;
  public garminAccessToken?: string;
  public totalRidesLogged!: number;
  public totalMilesLogged!: number;
  public memberSinceDisplay?: Date;
  public foundingMember!: boolean;
  public foundingMemberNumber?: number;
  public notificationPreferences?: NotificationPreferences;
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
    preferredServiceLocation: {
      type: DataTypes.ENUM('home', 'work', 'other'),
      allowNull: true,
      defaultValue: 'home',
    },
    stravaAccessToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    stravaRefreshToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    stravaAthleteId: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    garminAccessToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    },
    foundingMember: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    foundingMemberNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
  },
  {
    sequelize: getDatabase(),
    tableName: 'RiderProfiles',
    indexes: [{ fields: ['userId'] }],
  }
);

export default RiderProfile;
