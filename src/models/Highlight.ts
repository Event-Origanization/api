import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import { IHighlight, HighlightCreationAttributes } from '@/types';

export class Highlight extends Model<IHighlight, HighlightCreationAttributes> {
  public id!: number;
  public title_vi!: string;
  public title_en!: string;
  public title_zh!: string;
  public content_vi!: string;
  public content_en!: string;
  public content_zh!: string;
  public orderIndex!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Highlight.init(
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
    content_vi: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    content_en: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    content_zh: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'order_index'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    },
  },
  {
    sequelize,
    tableName: 'highlights',
    modelName: 'Highlight',
    indexes: [
      { fields: ['order_index'] }
    ]
  }
);

export default Highlight;
