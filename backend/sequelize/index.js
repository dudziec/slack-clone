const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.TEST_DB || 'slack', 'postgres', 'damian123', {
    dialect: 'postgres',
	port: '5432',
	define: { underscored: true }
});

const modelDefiners = [
    require('./models/user.model'),
	require('./models/channel.model'),
	require('./models/message.model'),
	require('./models/team.model'),
	require('./models/member.model'),
	require('./models/directMessage.model'),
];

for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize)
}

Object.keys(sequelize.models).forEach((modelName) => {
	if ('associate' in sequelize.models[modelName]) {
		sequelize.models[modelName].associate(sequelize.models);
	}
  });

const models = {...sequelize.models, sequelize: sequelize, Sequelize: Sequelize };

export { sequelize, models };