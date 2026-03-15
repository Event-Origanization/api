import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import { IHomeVideo, HomeVideoCreationAttributes } from '@/types';

export class HomeVideo extends Model<IHomeVideo, HomeVideoCreationAttributes> {
  public id!: number;
  public title_vi!: string;
  public title_en!: string;
  public title_zh!: string;
  public url!: string;
  public thumbnail!: string | null;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

HomeVideo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title_vi: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    title_en: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    title_zh: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: 'home_videos',
    modelName: 'HomeVideo',
  }
);

export default HomeVideo;
