import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

export enum GroupMemberRole {
  MEMBER = 'member',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

export interface RideGroupMemberAttributes {
  id: string;
  groupId: string;
  userId: string;
  role: GroupMemberRole;
  joinedAt?: Date;
}

export interface RideGroupMemberCreationAttributes extends Optional<RideGroupMemberAttributes, 'id' | 'joinedAt'> {}

export class RideGroupMember extends Model<RideGroupMemberAttributes, RideGroupMemberCreationAttributes> implements RideGroupMemberAttributes {
  public id!: string;
  public groupId!: string;
  public userId!: string;
  public role!: GroupMemberRole;
  public joinedAt?: Date;
}

RideGroupMember.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'RideGroups', key: 'id' },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    role: {
      type: DataTypes.ENUM(...Object.values(GroupMemberRole)),
      defaultValue: GroupMemberRole.MEMBER,
    },
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: getDatabase(),
    tableName: 'RideGroupMembers',
    indexes: [{ fields: ['groupId', 'userId'] }],
  }
);

export default RideGroupMember;
