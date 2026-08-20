import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

// NOTE: mirrors migrations/002_create_profiles.ts's MechanicProfiles
// table exactly. An earlier version of this model used different field
// names and enum values (serviceRadius, latitude/longitude,
// backgroundCheckPassed, insuranceActive, a 4-value status enum) that
// never matched the migration — fixed to track the migration.
export enum MechanicStatus {
  PENDING_REVIEW = 'pending_review',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DEACTIVATED = 'deactivated',
}

export enum InsuranceStatus {
  NONE = 'none',
  PARTIAL = 'partial',
  FULL = 'full',
  CYCLAA_COVERED = 'velo_covered',
}

export enum BackgroundCheckStatus {
  PENDING = 'pending',
  PASSED = 'passed',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

interface Certification {
  name: string;
  issuer: string;
  year: number;
  verified: boolean;
}

interface AvailabilitySchedule {
  [day: string]: {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  };
}

export interface MechanicProfileAttributes {
  id: string;
  userId: string;
  bio?: string;
  headline?: string;
  specialties: string[];
  yearsExperience?: number;
  certifications?: Certification[];
  isMobile: boolean;
  serviceRadiusKm: number;
  baseLocationLat?: number;
  baseLocationLng?: number;
  baseLocationAddress?: string;
  isFoundingMechanic: boolean;
  foundingMechanicNumber?: number;
  guaranteeActive: boolean;
  guaranteeStartDate?: Date;
  guaranteeEndDate?: Date;
  stripeConnectAccountId?: string;
  stripeConnectOnboarded: boolean;
  ratingAverage: number;
  ratingCount: number;
  totalJobsCompleted: number;
  completionRate: number;
  responseTimeAvgMinutes: number;
  isAvailable: boolean;
  availabilitySchedule?: AvailabilitySchedule;
  insuranceStatus: InsuranceStatus;
  insuranceExpiry?: Date;
  backgroundCheckStatus: BackgroundCheckStatus;
  backgroundCheckDate?: Date;
  toolsVerified: boolean;
  status: MechanicStatus;
  suspensionReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MechanicProfileCreationAttributes
  extends Optional<
    MechanicProfileAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'specialties'
    | 'isMobile'
    | 'serviceRadiusKm'
    | 'isFoundingMechanic'
    | 'guaranteeActive'
    | 'stripeConnectOnboarded'
    | 'ratingAverage'
    | 'ratingCount'
    | 'totalJobsCompleted'
    | 'completionRate'
    | 'responseTimeAvgMinutes'
    | 'isAvailable'
    | 'insuranceStatus'
    | 'backgroundCheckStatus'
    | 'toolsVerified'
    | 'status'
  > {}

export class MechanicProfile
  extends Model<MechanicProfileAttributes, MechanicProfileCreationAttributes>
  implements MechanicProfileAttributes
{
  public id!: string;
  public userId!: string;
  public bio?: string;
  public headline?: string;
  public specialties!: string[];
  public yearsExperience?: number;
  public certifications?: Certification[];
  public isMobile!: boolean;
  public serviceRadiusKm!: number;
  public baseLocationLat?: number;
  public baseLocationLng?: number;
  public baseLocationAddress?: string;
  public isFoundingMechanic!: boolean;
  public foundingMechanicNumber?: number;
  public guaranteeActive!: boolean;
  public guaranteeStartDate?: Date;
  public guaranteeEndDate?: Date;
  public stripeConnectAccountId?: string;
  public stripeConnectOnboarded!: boolean;
  public ratingAverage!: number;
  public ratingCount!: number;
  public totalJobsCompleted!: number;
  public completionRate!: number;
  public responseTimeAvgMinutes!: number;
  public isAvailable!: boolean;
  public availabilitySchedule?: AvailabilitySchedule;
  public insuranceStatus!: InsuranceStatus;
  public insuranceExpiry?: Date;
  public backgroundCheckStatus!: BackgroundCheckStatus;
  public backgroundCheckDate?: Date;
  public toolsVerified!: boolean;
  public status!: MechanicStatus;
  public suspensionReason?: string;
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
      validate: { len: [0, 500] },
    },
    headline: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    specialties: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    yearsExperience: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    certifications: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    isMobile: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    },
    responseTimeAvgMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    availabilitySchedule: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    insuranceStatus: {
      type: DataTypes.ENUM(...Object.values(InsuranceStatus)),
      defaultValue: InsuranceStatus.NONE,
    },
    insuranceExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    backgroundCheckStatus: {
      type: DataTypes.ENUM(...Object.values(BackgroundCheckStatus)),
      defaultValue: BackgroundCheckStatus.PENDING,
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
      type: DataTypes.ENUM(...Object.values(MechanicStatus)),
      defaultValue: MechanicStatus.PENDING_REVIEW,
    },
    suspensionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize: getDatabase(),
    tableName: 'MechanicProfiles',
    indexes: [
      { fields: ['userId'] },
      { fields: ['ratingAverage'] },
      { fields: ['status'] },
      { fields: ['isAvailable'] },
    ],
  }
);

export default MechanicProfile;
