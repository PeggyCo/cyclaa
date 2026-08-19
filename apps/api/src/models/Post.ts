import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

export enum PostType {
  TEXT = 'text',
  PHOTO = 'photo',
  RIDE_RECAP = 'ride_recap',
  QUESTION = 'question',
  ANNOUNCEMENT = 'announcement',
}

export interface PostAttributes {
  id: string;
  authorId: string;
  groupId?: string;
  type: PostType;
  content: string;
  photoUrls?: string[];
  linkedRideId?: string;
  linkedBikeId?: string;
  likeCount: number;
  commentCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PostCreationAttributes extends Optional<PostAttributes, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'commentCount'> {}

export class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: string;
  public authorId!: string;
  public groupId?: string;
  public type!: PostType;
  public content!: string;
  public photoUrls?: string[];
  public linkedRideId?: string;
  public linkedBikeId?: string;
  public likeCount!: number;
  public commentCount!: number;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'RideGroups', key: 'id' },
      onDelete: 'SET NULL',
    },
    type: {
      type: DataTypes.ENUM(...Object.values(PostType)),
      defaultValue: PostType.TEXT,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    photoUrls: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    linkedRideId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'Rides', key: 'id' },
      onDelete: 'SET NULL',
    },
    linkedBikeId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'Bikes', key: 'id' },
      onDelete: 'SET NULL',
    },
    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    commentCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize: getDatabase(),
    tableName: 'Posts',
    indexes: [
      { fields: ['authorId'] },
      { fields: ['groupId'] },
      { fields: ['createdAt'] },
    ],
  }
);

export default Post;
