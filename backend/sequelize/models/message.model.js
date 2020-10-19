import { DataTypes } from "sequelize";

module.exports = (sequelize) => {
  const Message = sequelize.define("message", {
    text: DataTypes.STRING,
  });

  Message.associate = (models) => {
    // 1:M
    Message.belongsTo(models.channel, {
      foreignKey: {
        name: "channelId",
        field: "channel_id",
      },
    });
    // 1:M
    Message.belongsTo(models.user, {
      foreignKey: {
        name: "userId",
        field: "user_id",
      },
    });
  };

  return Message;
};
