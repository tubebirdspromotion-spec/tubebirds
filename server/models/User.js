import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/db.js';

class User extends Model {
  // Instance method to compare password
  async comparePassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
  
  // Hash password before creating/updating
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please provide a name' },
        len: { args: [1, 50], msg: 'Name cannot be more than 50 characters' }
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: 'Email already exists'
      },
      validate: {
        isEmail: { msg: 'Please provide a valid email' },
        notEmpty: { msg: 'Please provide an email' }
      },
      set(value) {
        this.setDataValue('email', value.toLowerCase());
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please provide a password' },
        len: { args: [6, 255], msg: 'Password must be at least 6 characters' }
      }
    },
    role: {
      type: DataTypes.ENUM('client', 'admin', 'editor'),
      defaultValue: 'client',
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
      validate: {
        is: {
          args: /^[0-9]{10,15}$/,
          msg: 'Please provide a valid phone number'
        }
      }
    },
    avatar: {
      type: DataTypes.STRING(500),
      defaultValue: 'https://via.placeholder.com/150'
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    verificationToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    resetPasswordToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    resetPasswordExpire: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        await user.hashPassword();
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          await user.hashPassword();
        }
      }
    },
    defaultScope: {
      attributes: { exclude: ['password'] }
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] }
      }
    }
  }
);

export default User;
