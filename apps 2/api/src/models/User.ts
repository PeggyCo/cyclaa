import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

// NOTE: mirrors the actual table shape created by
// migrations/001_create_users.ts exactly. An earlier version of this
// model (isEmailVerified, subscriptionStatus, stripeConnectAccountId,
// latitude/longitude, isSuspended, referralCount, etc) never matched the
// migration and failed at runtime on the very first query — fixed to
// track the migration, since that's what's actually in the database.
export enum UserRole {
  RIDER = 'rider',
  MECHANIC = 'mechanic',
  ADMIN = 'admin',
}

export interface UserAttributes {
  id: string;
  email: string;
  phone?: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  avatarUrl?: string;
  role: UserRole;
  isVerified: boolean;
  isPro: boolean;
  proExpiresAt?: Date;
  stripeCustomerId?: string;
  defaultPaymentMethodId?: string;
  referralCode?: string;
  referredBy?: string;
  pushToken?: string;
  lastLocationLat?: number;
  lastLocationLng?: number;
  lastLocationUpdatedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isVerified' | 'isPro'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public phone?: string;
  public passwordHash!: string;
  public firstName!: string;
  public lastName!: string;
  public displayName?: string;
  public avatarUrl?: string;
  public role!: UserRole;
  public isVerified!: boolean;
  public isPro!: boolean;
  public proExpiresAt?: Date;
  public stripeCustomerId?: string;
  public defaultPaymentMethodId?: string;
  public referralCode?: string;
  public referredBy?: string;
  public pushToken?: string;
  public lastLocationLat?: number;
  public lastLocationLng?: number;
  public lastLocationUpdatedAt?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;
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
      allowNull: true,
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
      allowNull: true,
      comment: "Auto-generated: firstName + lastInitial",
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
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isPro: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    proExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    stripeCustomerId: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    defaultPaymentMethodId: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    referralCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      comment: '6-char alphanumeric code',
    },
    referredBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'Users', key: 'id' },
      onDelete: 'SET NULL',
    },
    pushToken: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'OneSignal push token',
    },
    lastLocationLat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    lastLocationLng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    lastLocationUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Soft delete',
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
