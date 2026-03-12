import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import { IPost, PostCreationAttributes } from '@/types';
import { POST_STATUS } from '@/constants';

export class Post extends Model<IPost, PostCreationAttributes> {
  public id!: number;
  public title!: string;
  public slug!: string;
  public content!: string;
  public media!: string;
  public status!: string;
  public publishAt!: Date | null;
  public seoScore!: number | null;
  public seoFeedback!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    media: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(POST_STATUS)),
      allowNull: false,
      defaultValue: POST_STATUS.DRAFT,
    },
    publishAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    seoScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    seoFeedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'posts',
    modelName: 'Post',
  }
);

export default Post;
