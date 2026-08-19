import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

export enum UserRole {
  RIDER = 'rider',
  MECHANIC = 'mechanic',
  ADMIN = 'admin',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended',
}

export interface UserAttributes {
  id: string;
  email: string;
  phone: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl?: string;
  role: UserRole;
  isEmailVerified: boolean;
  emailVerifiedAt?: Date;
  isPhoneVerified: boolean;
  phoneVerifiedAt?: Date;
  subscriptionStatus: SubscriptionStatus;
  subscriptionStartedAt?: Date;
  stripeCustomerId?: string;
  stripeConnectAccountId?: string;
  latitude?: number;
  longitude?: number;
  lastLocationUpdatedAt?: Date;
  referralCode?: string;
  referredByUserId?: string;
  referralCount: number;
  isSuspended: boolean;
  suspensionReason?: string;
  suspendedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isEmailVerified' | 'isPhoneVerified' | 'referralCount'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public phone!: string;
  public passwordHash!: string;
  public firstName!: string;
  public lastName!: string;
  public displayName!: string;
  public avatarUrl?: string;
  public role!: UserRole;
  public isEmailVerified!: boolean;
  public emailVerifiedAt?: Date;
  public isPhoneVerified!: boolean;
  public phoneVerifiedAt?: Date;
  public subscriptionStatus!: SubscriptionStatus;
  public subscriptionStartedAt?: Date;
  public stripeCustomerId?: string;
  public stripeConnectAccountId?: string;
  public latitude?: number;
  public longitude?: number;
  public lastLocationUpdatedAt?: Date;
  public referralCode?: string;
  public referredByUserId?: string;
  public referralCount!: number;
  public isSuspended!: boolean;
  public suspensionReason?: string;
  public suspendedAt?: Date;
  public deletedAt?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    avatarUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.RIDER,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isPhoneVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    phoneVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    subscriptionStatus: {
      type: DataTypes.ENUM(...Object.values(SubscriptionStatus)),
      defaultValue: SubscriptionStatus.ACTIVE,
    },
    subscriptionStartedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    stripeCustomerId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    stripeConnectAccountId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    lastLocationUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    referralCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    referredByUserId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    referralCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isSuspended: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    suspensionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    suspendedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: getDatabase(),
    tableName: 'Users',
    indexes: [
      { fields: ['email'] },
      { fields: ['phone'] },
      { fields: ['role'] },
      { fields: ['referralCode'] },
      { fields: ['createdAt'] },
    ],
  }
);

export default User;
