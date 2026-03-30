import { DataTypes, Model } from 'sequelize';
import sequelize from '@/config/database';
import { IContactMessage, ContactMessageCreationAttributes } from '@/types';

export class ContactMessage extends Model<IContactMessage, ContactMessageCreationAttributes> implements IContactMessage {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone!: string;
  public message!: string;
  public isRead!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ContactMessage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'contact_messages',
    underscored: true,
    timestamps: true,
  }
);
