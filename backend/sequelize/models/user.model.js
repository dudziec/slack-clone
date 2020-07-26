import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
    const User = sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: DataTypes.STRING,
    });

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