/**
 * Waitlist Model
 * Tracks early access signups with referral tracking
 */

import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

export enum WaitlistBorough {
  MANHATTAN = 'manhattan',
  BROOKLYN = 'brooklyn',
  QUEENS = 'queens',
  BRONX = 'bronx',
  STATEN_ISLAND = 'staten_island',
  OTHER = 'other',
}

export enum WaitlistSource {
  WEBSITE = 'website',
  APP = 'app',
  SOCIAL = 'social',
  OTHER = 'other',
}

export interface WaitlistAttributes {
  id: string;
  email: string;
  name?: string;
  borough: WaitlistBorough;
  referralCode?: string;
  referredBy?: string;
  position?: number;
  emailConfirmed: boolean;
  confirmationToken?: string;
  confirmationSentAt?: Date;
  confirmedAt?: Date;
  referralCount: number;
  accessGranted: boolean;
  accessGrantedAt?: Date;
  source: WaitlistSource;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WaitlistCreationAttributes
  extends Optional<
    WaitlistAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'emailConfirmed'
    | 'referralCount'
    | 'accessGranted'
    | 'borough'
    | 'source'
  > {}

export class Waitlist
  extends Model<WaitlistAttributes, WaitlistCreationAttributes>
  implements WaitlistAttributes
{
  public id!: string;
  public email!: string;
  public name?: string;
  public borough!: WaitlistBorough;
  public referralCode?: string;
  public referredBy?: string;
  public position?: number;
  public emailConfirmed!: boolean;
  public confirmationToken?: string;
  public confirmationSentAt?: Date;
  public confirmedAt?: Date;
  public referralCount!: number;
  public accessGranted!: boolean;
  public accessGrantedAt?: Date;
  public source!: WaitlistSource;
  public createdAt?: Date;
  public updatedAt?: Date;

  // Convenience helper used by the referral increment flow
  public increment: any;
  public save!: () => Promise<this>;
}

Waitlist.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    borough: {
      type: DataTypes.ENUM(...Object.values(WaitlistBorough)),
      defaultValue: WaitlistBorough.OTHER,
    },
    referralCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      comment: 'Unique code for sharing',
    },
    referredBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'Waitlists', key: 'id' },
      onDelete: 'SET NULL',
      comment: 'Who referred this person',
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Position in waitlist queue',
    },
    emailConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    confirmationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    confirmationSentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    confirmedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    referralCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of successful referrals',
    },
    accessGranted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    accessGrantedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    source: {
      type: DataTypes.ENUM(...Object.values(WaitlistSource)),
      defaultValue: WaitlistSource.WEBSITE,
    },
  },
  {
    sequelize: getDatabase(),
    tableName: 'Waitlists',
    indexes: [
      { fields: ['email'] },
      { fields: ['referralCode'] },
      { fields: ['borough'] },
      { fields: ['position'] },
    ],
  }
);

export default Waitlist;
