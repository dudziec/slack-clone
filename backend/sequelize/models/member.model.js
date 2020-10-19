import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
    const Member = sequelize.define('member', {
        admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    });
    
    return Member;
}