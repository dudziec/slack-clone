import { DataTypes } from "sequelize";

module.exports = (sequelize) => {
  const DirectMessage = sequelize.define("direct_message", {
    text: DataTypes.STRING,
  });

  DirectMessage.associate = (models) => {
    DirectMessage.belongsTo(models.team, {
      foreignKey: {
        name: "teamId",
        field: "team_id",
      },
    });
    // 1:M
    DirectMessage.belongsTo(models.user, {
      foreignKey: {
        name: "receiverId",
        field: "receiver_id",
      },
    });
    // 1:M
    DirectMessage.belongsTo(models.user, {
      foreignKey: {
        name: "senderId",
        field: "sender_id",
      },
    });
  };

  return DirectMessage;
};
