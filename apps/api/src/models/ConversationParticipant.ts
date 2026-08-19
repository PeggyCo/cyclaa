import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

export interface ConversationParticipantAttributes {
  id: string;
  conversationId: string;
  userId: string;
  lastReadAt?: Date;
  createdAt?: Date;
}

export interface ConversationParticipantCreationAttributes extends Optional<ConversationParticipantAttributes, 'id' | 'createdAt'> {}

export class ConversationParticipant extends Model<ConversationParticipantAttributes, ConversationParticipantCreationAttributes> implements ConversationParticipantAttributes {
  public id!: string;
  public conversationId!: string;
  public userId!: string;
  public lastReadAt?: Date;
  public createdAt?: Date;
}

ConversationParticipant.init(
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    lastReadAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: getDatabase(),
    tableName: 'ConversationParticipants',
    indexes: [
      { fields: ['conversationId', 'userId'] },
      { fields: ['userId'] },
    ],
  }
);

export default ConversationParticipant;
