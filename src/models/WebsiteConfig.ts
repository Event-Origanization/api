import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import { IWebsiteConfig, WebsiteConfigCreationAttributes } from '@/types';

export class WebsiteConfig extends Model<IWebsiteConfig, WebsiteConfigCreationAttributes> {
  public id!: number;
  public key!: string;
  public group!: string;
  public value_vi!: string;
  public value_en!: string;
  public value_zh!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WebsiteConfig.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    group: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'GENERAL',
    },
    value_vi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    value_en: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    value_zh: {
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
    tableName: 'website_configs',
    modelName: 'WebsiteConfig',
    indexes: [
      {
        fields: ['group']
      }
    ]
  }
);

export default WebsiteConfig;
