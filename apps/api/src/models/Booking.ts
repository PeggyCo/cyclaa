import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

export enum BookingStatus {
  PENDING_MATCH = 'pending_match',
  MATCHED = 'matched',
  CONFIRMED = 'confirmed',
  MECHANIC_EN_ROUTE = 'mechanic_en_route',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED_BY_RIDER = 'cancelled_by_rider',
  DECLINED_BY_MECHANIC = 'declined_by_mechanic',
  DISPUTED = 'disputed',
}

export enum BookingType {
  ON_DEMAND = 'on_demand',
  SCHEDULED = 'scheduled',
}

interface ServiceLocation {
  type: 'home' | 'work' | 'custom';
  address: string;
  lat: number;
  lng: number;
}

export interface BookingAttributes {
  id: string;
  riderId: string;
  mechanicId?: string;
  bikeId: string;
  serviceTypeId: string;
  status: BookingStatus;
  bookingType: BookingType;
  scheduledDate?: Date;
  scheduledTime?: string;
  serviceLocation: ServiceLocation;
  description?: string;
  photoUrls?: string[];
  quotedPrice?: number;
  partsCost: number;
  finalPrice?: number;
  commissionPercent: number;
  mechanicPayout?: number;
  completionNotes?: string;
  completionPhotos?: string[];
  riderRating?: number;
  riderReview?: string;
  mechanicRating?: number;
  mechanicReview?: string;
  estimatedEtaMinutes?: number;
  actualArrivedAt?: Date;
  actualCompletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookingCreationAttributes extends Optional<BookingAttributes, 'id' | 'createdAt' | 'updatedAt' | 'partsCost' | 'commissionPercent'> {}

export class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
  public id!: string;
  public riderId!: string;
  public mechanicId?: string;
  public bikeId!: string;
  public serviceTypeId!: string;
  public status!: BookingStatus;
  public bookingType!: BookingType;
  public scheduledDate?: Date;
  public scheduledTime?: string;
  public serviceLocation!: ServiceLocation;
  public description?: string;
  public photoUrls?: string[];
  public quotedPrice?: number;
  public partsCost!: number;
  public finalPrice?: number;
  public commissionPercent!: number;
  public mechanicPayout?: number;
  public completionNotes?: string;
  public completionPhotos?: string[];
  public riderRating?: number;
  public riderReview?: string;
  public mechanicRating?: number;
  public mechanicReview?: string;
  public estimatedEtaMinutes?: number;
  public actualArrivedAt?: Date;
  public actualCompletedAt?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    riderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    mechanicId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'Users', key: 'id' },
      onDelete: 'SET NULL',
    },
    bikeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Bikes', key: 'id' },
      onDelete: 'RESTRICT',
    },
    serviceTypeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'ServiceTypes', key: 'id' },
      onDelete: 'RESTRICT',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(BookingStatus)),
      defaultValue: BookingStatus.PENDING_MATCH,
      allowNull: false,
    },
    bookingType: {
      type: DataTypes.ENUM(...Object.values(BookingType)),
      defaultValue: BookingType.ON_DEMAND,
    },
    scheduledDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    scheduledTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    serviceLocation: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    photoUrls: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    quotedPrice: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
    partsCost: {
      type: DataTypes.DECIMAL(8, 2),
      defaultValue: 0,
    },
    finalPrice: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
    commissionPercent: {
      type: DataTypes.DECIMAL(4, 1),
      defaultValue: 18,
    },
    mechanicPayout: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
    completionNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    completionPhotos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    riderRating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 1, max: 5 },
    },
    riderReview: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mechanicRating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 1, max: 5 },
    },
    mechanicReview: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estimatedEtaMinutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    actualArrivedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    actualCompletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: getDatabase(),
    tableName: 'Bookings',
    indexes: [
      { fields: ['riderId'] },
      { fields: ['mechanicId'] },
      { fields: ['bikeId'] },
      { fields: ['status'] },
      { fields: ['createdAt'] },
      { fields: ['scheduledDate'] },
    ],
  }
);

export default Booking;
