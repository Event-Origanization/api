import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { INewsletterSubscriber, NewsletterSubscriberCreationAttributes } from '@/types';

export class NewsletterSubscriber extends Model<INewsletterSubscriber, NewsletterSubscriberCreationAttributes> implements INewsletterSubscriber {
  public id!: number;
  public email!: string;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

NewsletterSubscriber.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: 'newsletter_subscribers',
    underscored: true,
    timestamps: true,
  }
);
