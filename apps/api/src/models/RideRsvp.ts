import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

export enum RsvpStatus {
  GOING = 'going',
  MAYBE = 'maybe',
  NOT_GOING = 'not_going',
}

export interface RideRsvpAttributes {
  id: string;
  rideId: string;
  userId: string;
  status: RsvpStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RideRsvpCreationAttributes extends Optional<RideRsvpAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class RideRsvp extends Model<RideRsvpAttributes, RideRsvpCreationAttributes> implements RideRsvpAttributes {
  public id!: string;
  public rideId!: string;
  public userId!: string;
  public status!: RsvpStatus;
  public createdAt?: Date;
  public updatedAt?: Date;
}

RideRsvp.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rideId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Rides', key: 'id' },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(RsvpStatus)),
      defaultValue: RsvpStatus.GOING,
    },
  },
  {
    sequelize: getDatabase(),
    tableName: 'RideRsvps',
    indexes: [{ fields: ['rideId', 'userId'] }],
  }
);

export default RideRsvp;
