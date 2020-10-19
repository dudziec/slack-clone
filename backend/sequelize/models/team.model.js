import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
    const Team = sequelize.define('team', {
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
    });

    Team.associate = (models) => {
        Team.belongsToMany(models.user, {
            through: 'member',
            foreignKey: {
                name: 'teamId',
                field: 'team_id',
            }
        });
    };
    
    return Team;
}