import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

export interface PostCommentAttributes {
  id: string;
  postId: string;
  authorId: string;
  parentCommentId?: string;
  content: string;
  likeCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PostCommentCreationAttributes extends Optional<PostCommentAttributes, 'id' | 'createdAt' | 'updatedAt' | 'likeCount'> {}

export class PostComment extends Model<PostCommentAttributes, PostCommentCreationAttributes> implements PostCommentAttributes {
  public id!: string;
  public postId!: string;
  public authorId!: string;
  public parentCommentId?: string;
  public content!: string;
  public likeCount!: number;
  public createdAt?: Date;
  public updatedAt?: Date;
}

PostComment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Posts', key: 'id' },
      onDelete: 'CASCADE',
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    parentCommentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'PostComments', key: 'id' },
      onDelete: 'CASCADE',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize: getDatabase(),
    tableName: 'PostComments',
    indexes: [
      { fields: ['postId'] },
      { fields: ['authorId'] },
    ],
  }
);

export default PostComment;
