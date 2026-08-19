import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
}

export interface MessageAttributes {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  imageUrls?: string[];
  status: MessageStatus;
  createdAt?: Date;
}

export interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'createdAt'> {}

export class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: string;
  public conversationId!: string;
  public senderId!: string;
  public content!: string;
  public imageUrls?: string[];
  public status!: MessageStatus;
  public createdAt?: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Conversations', key: 'id' },
      onDelete: 'CASCADE',
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrls: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(MessageStatus)),
      defaultValue: MessageStatus.SENT,
    },
  },
  {
    sequelize: getDatabase(),
    tableName: 'Messages',
    indexes: [
      { fields: ['conversationId'] },
      { fields: ['senderId'] },
      { fields: ['createdAt'] },
    ],
  }
);

export default Message;
