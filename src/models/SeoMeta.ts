import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import { ISeoMeta, SeoMetaCreationAttributes } from '@/types';

export class SeoMeta extends Model<ISeoMeta, SeoMetaCreationAttributes> {
  public id!: number;
  public pageKey!: string;
  public title_vi!: string;
  public title_en!: string;
  public title_zh!: string;
  public description_vi!: string;
  public description_en!: string;
  public description_zh!: string;
  public path!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SeoMeta.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pageKey: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'page_key',
    },
    title_vi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title_en: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title_zh: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description_vi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description_en: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description_zh: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'seo_metas',
    modelName: 'SeoMeta',
    underscored: true,
  }
);

export default SeoMeta;
