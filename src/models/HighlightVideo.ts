import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import { IHighlightVideo, HighlightVideoCreationAttributes } from '@/types';

export class HighlightVideo extends Model<IHighlightVideo, HighlightVideoCreationAttributes> {
  public id!: number;
  public title_vi!: string;
  public title_en!: string;
  public title_zh!: string;
  public url!: string;
  public orderIndex!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

HighlightVideo.init(
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
    orderIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    tableName: 'highlight_videos',
    modelName: 'HighlightVideo',
  }
);

export default HighlightVideo;
