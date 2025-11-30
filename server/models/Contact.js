import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Contact extends Model {}

Contact.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please provide a name' }
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: { msg: 'Please provide a valid email' },
        notEmpty: { msg: 'Please provide an email' }
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please provide a phone number' }
      }
    },
    subject: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please provide a subject' }
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please provide a message' }
      }
    },
    service: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('new', 'contacted', 'converted', 'closed'),
      defaultValue: 'new'
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    notes: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: 'Array of {message, createdBy, createdAt}'
    },
    repliedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Contact',
    tableName: 'contacts',
    timestamps: true,
    indexes: [
      { fields: ['status'] },
      { fields: ['isRead'] },
      { fields: ['createdAt'] }
    ]
  }
);

export default Contact;
