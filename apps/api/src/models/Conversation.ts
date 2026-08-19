import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

export interface ConversationAttributes {
  id: string;
  bookingId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ConversationCreationAttributes extends Optional<ConversationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Conversation extends Model<ConversationAttributes, ConversationCreationAttributes> implements ConversationAttributes {
  public id!: string;
  public bookingId?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Conversation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'Bookings', key: 'id' },
      onDelete: 'SET NULL',
    },
  },
  {
    sequelize: getDatabase(),
    tableName: 'Conversations',
    indexes: [
      { fields: ['bookingId'] },
      { fields: ['updatedAt'] },
    ],
  }
);

export default Conversation;
