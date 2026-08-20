import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

export enum DeviceType {
  IOS = 'ios',
  ANDROID = 'android',
  WEB = 'web',
}

export interface DeviceTokenAttributes {
  id: string;
  userId: string;
  token: string;
  deviceType: DeviceType;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DeviceTokenCreationAttributes extends Optional<DeviceTokenAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isActive'> {}

export class DeviceToken extends Model<DeviceTokenAttributes, DeviceTokenCreationAttributes> implements DeviceTokenAttributes {
  public id!: string;
  public userId!: string;
  public token!: string;
  public deviceType!: DeviceType;
  public isActive!: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;
}

DeviceToken.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    deviceType: {
      type: DataTypes.ENUM(...Object.values(DeviceType)),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize: getDatabase(),
    tableName: 'DeviceTokens',
    indexes: [
      { fields: ['userId'] },
      { fields: ['token'] },
    ],
  }
);

export default DeviceToken;
