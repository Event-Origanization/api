import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import { IProduct, ProductCreationAttributes } from '@/types';
import { PAGE_KEYS } from '@/constants/seo';

export class Product extends Model<IProduct, ProductCreationAttributes> {
  public id!: number;
  public name_vi!: string;
  public name_en!: string;
  public name_zh!: string;
  public slug!: string;
  public price!: number;
  public images!: string[];
  public isActive!: boolean;
  public productType!: typeof PAGE_KEYS.SOUND_LIGHT | typeof PAGE_KEYS.RENTAL;
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
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    productType: {
      type: DataTypes.ENUM(PAGE_KEYS.SOUND_LIGHT, PAGE_KEYS.RENTAL),
      allowNull: false,
      defaultValue: PAGE_KEYS.RENTAL,
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
    indexes: [
      { fields: ['productType'] },
      { fields: ['isActive'] },
      { fields: ['productType', 'isActive'] },
      { fields: ['createdAt'] },
      {
        name: 'products_search_fulltext',
        type: 'FULLTEXT',
        fields: ['name_vi', 'name_en', 'name_zh']
      }
    ]
  }
);

export default Product;
