import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

export enum NotificationType {
  BOOKING_MATCHED = 'booking_matched',
  BOOKING_CONFIRMED = 'booking_confirmed',
  MECHANIC_EN_ROUTE = 'mechanic_en_route',
  BOOKING_COMPLETED = 'booking_completed',
  NEW_MESSAGE = 'new_message',
  BOOKING_CANCELLED = 'booking_cancelled',
  RIDE_REMINDER = 'ride_reminder',
  GROUP_ACTIVITY = 'group_activity',
  POST_LIKE = 'post_like',
  POST_COMMENT = 'post_comment',
  SYSTEM = 'system',
}

export enum NotificationRelatedType {
  BOOKING = 'booking',
  CONVERSATION = 'conversation',
  RIDE = 'ride',
  POST = 'post',
  GROUP = 'group',
}

export interface NotificationAttributes {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  relatedEntityType?: NotificationRelatedType;
  relatedEntityId?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt?: Date;
}

export interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id' | 'createdAt' | 'isRead'> {}

export class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: string;
  public userId!: string;
  public type!: NotificationType;
  public title!: string;
  public body!: string;
  public relatedEntityType?: NotificationRelatedType;
  public relatedEntityId?: string;
  public isRead!: boolean;
  public readAt?: Date;
  public createdAt?: Date;
}

Notification.init(
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
    type: {
      type: DataTypes.ENUM(...Object.values(NotificationType)),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    relatedEntityType: {
      type: DataTypes.ENUM(...Object.values(NotificationRelatedType)),
      allowNull: true,
    },
    relatedEntityId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: getDatabase(),
    tableName: 'Notifications',
    indexes: [
      { fields: ['userId'] },
      { fields: ['userId', 'isRead'] },
      { fields: ['createdAt'] },
    ],
  }
);

export default Notification;
