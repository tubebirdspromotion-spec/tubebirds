import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Consultation extends Model {}

Consultation.init(
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
    service: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Interested service name'
    },
    message: {
      type: DataTypes.TEXT,
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
    contactedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: 'Array of admin notes {message, createdBy, createdAt}'
    }
  },
  {
    sequelize,
    modelName: 'Consultation',
    tableName: 'consultations',
    timestamps: true,
    indexes: [
      { fields: ['status'] },
      { fields: ['isRead'] },
      { fields: ['createdAt'] }
    ]
  }
);

export default Consultation;
