import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';
import { RidePace } from './RideGroup';

export interface RideAttributes {
  id: string;
  groupId?: string;
  createdByUserId: string;
  title: string;
  rideDate: Date;
  startTime: string;
  distance?: number;
  pace: RidePace;
  meetingPoint: string;
  maxRiders?: number;
  rsvpCount: number;
  description?: string;
  isCancelled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RideCreationAttributes extends Optional<RideAttributes, 'id' | 'createdAt' | 'updatedAt' | 'rsvpCount'> {}

export class Ride extends Model<RideAttributes, RideCreationAttributes> implements RideAttributes {
  public id!: string;
  public groupId?: string;
  public createdByUserId!: string;
  public title!: string;
  public rideDate!: Date;
  public startTime!: string;
  public distance?: number;
  public pace!: RidePace;
  public meetingPoint!: string;
  public maxRiders?: number;
  public rsvpCount!: number;
  public description?: string;
  public isCancelled!: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Ride.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'RideGroups', key: 'id' },
      onDelete: 'SET NULL',
    },
    createdByUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    rideDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    distance: {
      type: DataTypes.DECIMAL(6, 1),
      allowNull: true,
      comment: 'Miles',
    },
    pace: {
      type: DataTypes.ENUM('casual', 'moderate', 'fast', 'mixed'),
      allowNull: false,
    },
    meetingPoint: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    maxRiders: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rsvpCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isCancelled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: getDatabase(),
    tableName: 'Rides',
    indexes: [
      { fields: ['groupId'] },
      { fields: ['rideDate'] },
    ],
  }
);

export default Ride;
