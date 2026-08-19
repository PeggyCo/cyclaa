import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

export enum MechanicStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_BREAK = 'on_break',
  BANNED = 'banned',
}

interface AvailabilitySchedule {
  [key: string]: {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  };
}

interface Certification {
  name: string;
  issuer: string;
  issuedDate: string;
  expiryDate?: string;
}

export interface MechanicProfileAttributes {
  id: string;
  userId: string;
  bio?: string;
  headline?: string;
  specialties: string[];
  certifications?: Certification[];
  serviceRadius: number;
  latitude?: number;
  longitude?: number;
  stripeConnectAccountId?: string;
  status: MechanicStatus;
  averageRating: number;
  ratingCount: number;
  totalJobsCompleted: number;
  totalEarnings: number;
  backgroundCheckPassed: boolean;
  backgroundCheckDate?: Date;
  insuranceActive: boolean;
  insuranceExpiryDate?: Date;
  availabilitySchedule?: AvailabilitySchedule;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MechanicProfileCreationAttributes extends Optional<MechanicProfileAttributes, 'id' | 'createdAt' | 'updatedAt' | 'averageRating' | 'ratingCount' | 'totalJobsCompleted' | 'totalEarnings'> {}

export class MechanicProfile extends Model<MechanicProfileAttributes, MechanicProfileCreationAttributes> implements MechanicProfileAttributes {
  public id!: string;
  public userId!: string;
  public bio?: string;
  public headline?: string;
  public specialties!: string[];
  public certifications?: Certification[];
  public serviceRadius!: number;
  public latitude?: number;
  public longitude?: number;
  public stripeConnectAccountId?: string;
  public status!: MechanicStatus;
  public averageRating!: number;
  public ratingCount!: number;
  public totalJobsCompleted!: number;
  public totalEarnings!: number;
  public backgroundCheckPassed!: boolean;
  public backgroundCheckDate?: Date;
  public insuranceActive!: boolean;
  public insuranceExpiryDate?: Date;
  public availabilitySchedule?: AvailabilitySchedule;
  public createdAt?: Date;
  public updatedAt?: Date;
}

MechanicProfile.init(
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
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    headline: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    specialties: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    certifications: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    serviceRadius: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      comment: 'Miles',
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    stripeConnectAccountId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(MechanicStatus)),
      defaultValue: MechanicStatus.ACTIVE,
    },
    averageRating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 5.0,
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalJobsCompleted: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalEarnings: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    backgroundCheckPassed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    backgroundCheckDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    insuranceActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    insuranceExpiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    availabilitySchedule: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize: getDatabase(),
    tableName: 'MechanicProfiles',
    indexes: [
      { fields: ['userId'] },
      { fields: ['status'] },
      { fields: ['averageRating'] },
      { fields: ['specialties'], using: 'gin' },
    ],
  }
);

export default MechanicProfile;
