import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import { IProduct, ProductCreationAttributes } from '@/types';

export class Product extends Model<IProduct, ProductCreationAttributes> {
  public id!: number;
  public name_vi!: string;
  public name_en!: string;
  public name_zh!: string;
  public slug!: string;
  public content_vi!: string;
  public content_en!: string;
  public content_zh!: string;
  public price!: number;
  public images!: string[];
  public variants!: Record<string, unknown>[];
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name_vi: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name_en: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    name_zh: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
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
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    variants: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
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
    tableName: 'products',
    modelName: 'Product',
  }
);

export default Product;
