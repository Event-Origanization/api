import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/database';
import { IPartner, PartnerCreationAttributes } from '@/types';

export class Partner extends Model<IPartner, PartnerCreationAttributes> {
  public id!: number;
  public name!: string;
  public logo!: string | null;
  public orderIndex!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Partner.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    logo: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
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
    tableName: 'partners',
    modelName: 'Partner',
  }
);

export default Partner;
