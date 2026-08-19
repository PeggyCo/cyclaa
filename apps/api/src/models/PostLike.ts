import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

export interface PostLikeAttributes {
  id: string;
  postId: string;
  userId: string;
  createdAt?: Date;
}

export interface PostLikeCreationAttributes extends Optional<PostLikeAttributes, 'id' | 'createdAt'> {}

export class PostLike extends Model<PostLikeAttributes, PostLikeCreationAttributes> implements PostLikeAttributes {
  public id!: string;
  public postId!: string;
  public userId!: string;
  public createdAt?: Date;
}

PostLike.init(
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize: getDatabase(),
    tableName: 'PostLikes',
    indexes: [{ fields: ['postId', 'userId'] }],
  }
);

export default PostLike;
