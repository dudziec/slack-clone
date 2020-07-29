import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

module.exports = (sequelize) => {
    const User = sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isAlphanumeric: {
                    args: true,
                    msg: 'The username can only contain letters and numbers',
                },
                len: {
                    args: [3, 25],
                    msg: 'The username needs to be between 3 and 25 characters long',
                },
            }
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: {
                    args: true,
                    msg: 'Invalid email',
                },
            }
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                len: {
                    args: [8, 100],
                    msg: 'The password needs to be between 8 and 100 characters long',
                },
            },
        },
    },
        {
            hooks: {
              afterValidate: async(user) => {
                  const hashedPassword = await bcrypt.hash(user.password, 12);
                  user.password = hashedPassword;
              }
           },
        }
    );

    User.associate = (models) => {
        User.belongsToMany(models.team, {
            through: 'member',
            foreignKey: {
                name: 'userId',
                field: 'user_id',
            }
        });
        // N to M
        User.belongsToMany(models.channel, {
            through: 'channel_member',
            foreignKey: {
                name: 'userId',
                field: 'user_id',
            }
        })
    };
    
    return User;
}