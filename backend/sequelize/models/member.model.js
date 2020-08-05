import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
    const Member = sequelize.define('member', {});
    
    return Member;
}